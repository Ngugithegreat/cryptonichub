import { NextResponse } from "next/server";
import { db, ensureSchema } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";
import { sendEmail, welcomeEmail } from "@/lib/email";
import { issueEmailOtp } from "@/lib/emailVerify";
import { idFromAccountNo } from "@/lib/format";
import { otpRequiredFor, verifySignupOtp } from "@/lib/otp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { name, email, password, country, ref, phone, code } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    const cleanCountry = country ? String(country).trim().toUpperCase().slice(0, 8) : null;
    const cleanPhone = phone ? String(phone).trim().slice(0, 24) : null;
    if (String(password).length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }
    const cleanEmail = String(email).trim().toLowerCase();

    await ensureSchema();
    const sql = db();

    const existing = (await sql`SELECT id FROM cryptonichub_users WHERE email = ${cleanEmail} LIMIT 1`) as any[];
    if (existing.length) {
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 409 }
      );
    }

    // Phone-OTP gate (Kenya): the account is only created after the SMS code is
    // verified. Enforced here independently of the client, so it can't be
    // skipped by calling register directly. Fail-safe: otpRequiredFor is false
    // when SMS isn't configured, so signups are never blocked.
    if (otpRequiredFor(cleanCountry)) {
      if (!cleanPhone) {
        return NextResponse.json({ error: "A phone number is required." }, { status: 400 });
      }
      const v = await verifySignupOtp(cleanPhone, String(code || ""));
      if (!v.ok) {
        return NextResponse.json({ error: v.error || "Phone verification failed.", needOtp: true }, { status: 400 });
      }
    }

    // Admin if the email matches ADMIN_EMAIL, OR if this is the very first
    // account (so the site owner always ends up with an admin login).
    const isAdminEmail =
      process.env.ADMIN_EMAIL &&
      cleanEmail === process.env.ADMIN_EMAIL.trim().toLowerCase();
    const countRows = (await sql`SELECT COUNT(*)::int AS n FROM cryptonichub_users`) as Array<{ n: number }>;
    const isFirstUser = (countRows[0]?.n ?? 0) === 0;
    const role = isAdminEmail || isFirstUser ? "admin" : "user";

    const hash = await hashPassword(String(password));

    // Resolve an optional referral code (account number) to the referrer's id.
    let referredBy: number | null = null;
    if (ref) {
      const rid = idFromAccountNo(String(ref));
      if (rid) {
        const r = (await sql`SELECT id FROM cryptonichub_users WHERE id = ${rid} LIMIT 1`) as any[];
        if (r.length) referredBy = rid;
      }
    }

    const rows = (await sql`
      INSERT INTO cryptonichub_users (name, email, password_hash, role, balance, country, phone, referred_by)
      VALUES (${String(name).trim()}, ${cleanEmail}, ${hash}, ${role}, 0, ${cleanCountry}, ${cleanPhone}, ${referredBy})
      RETURNING id, email, name, role
    `) as any[];

    const user = rows[0];
    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // Welcome email + email-verification code — fire-and-forget so signup never
    // blocks or fails on email delivery.
    const w = welcomeEmail(user.name);
    sendEmail({ to: user.email, subject: w.subject, html: w.html, text: w.text }).catch(() => {});
    issueEmailOtp(user.id, user.name, user.email).catch(() => {});

    return NextResponse.json({ ok: true, user: { ...user, balance: 0 } });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
