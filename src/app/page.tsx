import Link from "next/link";
import {
  Zap,
  ShieldCheck,
  Wallet,
  Clock,
  ArrowRight,
  Terminal,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { RotatingWord } from "@/components/RotatingWord";
import { MarketTicker } from "@/components/MarketTicker";
import { ExchangeHero } from "@/components/ExchangeHero";
import { MarketsTable } from "@/components/MarketsTable";
import { MARKETS, PAYOUT_MULTIPLIER } from "@/lib/markets";
import { BRAND_NAME } from "@/lib/brand";

export default function Landing() {
  return (
    <div className="term-grid relative min-h-screen bg-bg">
      {/* single subtle teal top glow — replaces the blurry blob mesh */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[420px]"
        style={{
          background:
            "radial-gradient(680px 300px at 80% -8%, var(--teal-glow), transparent 70%)",
        }}
      />
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-8 w-8" />
              <span className="text-lg font-bold tracking-tight">{BRAND_NAME}</span>
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
              <a href="#markets" className="transition hover:text-fg">
                Markets
              </a>
              <Link href="/how-it-works" className="transition hover:text-fg">
                How it works
              </Link>
              <Link href="/login" className="transition hover:text-fg">
                Log in
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link
                href="/register"
                className="btn btn-teal px-4 py-2 text-sm !rounded-md"
              >
                Launch app
              </Link>
            </div>
          </div>
        </header>

        {/* Live market ticker strip */}
        <MarketTicker />

        {/* Hero — split, no blobs */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-10 lg:grid-cols-[1.05fr_1fr] lg:pt-16">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-[rgb(var(--teal))] bg-[rgb(var(--teal)/0.1)] px-2.5 py-1 text-xs font-semibold text-[rgb(var(--teal))]">
              <Terminal className="h-3.5 w-3.5" /> The crypto-native trading terminal
            </span>
            <h1 className="mt-4 text-4xl font-black leading-[1.03] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Trade volatility
              <br />
              markets.{" "}
              <span className="text-[rgb(var(--teal))]">
                <RotatingWord words={["Live.", "Instant.", "On-chain speed.", "Yours."]} />
              </span>
            </h1>
            <p className="mt-5 max-w-md text-base text-muted sm:text-lg">
              A real exchange-grade terminal for volatility index markets. Read the
              order flow, call Rise or Fall, and settle instantly — up to{" "}
              <span className="num font-semibold text-fg">{PAYOUT_MULTIPLIER}×</span> your
              stake, paid out to M-Pesa or crypto.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/register" className="btn btn-teal px-6 py-3 text-base !rounded-md">
                Start trading <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#markets"
                className="btn btn-ghost px-6 py-3 text-base !rounded-md"
              >
                View markets
              </a>
            </div>

            {/* Trust / stat row */}
            <dl className="mt-9 grid max-w-md grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border">
              <Stat value={`${PAYOUT_MULTIPLIER}×`} label="Max payout" />
              <Stat value={`${MARKETS.length}`} label="Live markets" />
              <Stat value="24/7" label="Instant payouts" />
            </dl>
          </div>

          {/* Terminal card */}
          <div className="lg:pl-2">
            <ExchangeHero />
          </div>
        </section>

        {/* Markets table */}
        <section id="markets" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Markets</h2>
              <p className="mt-1 text-sm text-muted">
                Live volatility indices. Prices stream tick-for-tick from the market feed.
              </p>
            </div>
            <Link
              href="/register"
              className="hidden shrink-0 text-sm font-semibold text-[rgb(var(--teal))] hover:underline sm:inline"
            >
              Open account →
            </Link>
          </div>
          <MarketsTable />
        </section>

        {/* Feature strip */}
        <section className="mx-auto max-w-6xl px-4 py-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Feature
              icon={Zap}
              title="Instant settlement"
              desc="Contracts settle the moment they expire — from 15 seconds up."
            />
            <Feature
              icon={ShieldCheck}
              title="Escrowed & secure"
              desc="Every stake and payout is written to a tamper-proof ledger."
            />
            <Feature
              icon={Wallet}
              title="M-Pesa & crypto payouts"
              desc="Fund and cash out instantly via mobile money, USDT or bank."
            />
            <Feature
              icon={Clock}
              title="24/7 markets"
              desc="Synthetic volatility indices never close — trade any time."
            />
          </div>
        </section>

        {/* CTA band */}
        <section className="mx-auto max-w-6xl px-4 py-14">
          <div className="term-card term-glow relative overflow-hidden px-6 py-12 text-center sm:px-12">
            <div className="term-grid pointer-events-none absolute inset-0 opacity-40" />
            <div className="relative">
              <h2 className="text-2xl font-black tracking-tight sm:text-4xl">
                Win up to <span className="text-[rgb(var(--teal))]">{PAYOUT_MULTIPLIER}×</span>{" "}
                your stake
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm text-muted sm:text-base">
                Open a {BRAND_NAME} account in under a minute. Deposit, trade the terminal,
                and withdraw your winnings instantly.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link href="/register" className="btn btn-teal px-8 py-3 text-base !rounded-md">
                  Create account <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/login" className="btn btn-ghost px-8 py-3 text-base !rounded-md">
                  I have an account
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-surface/40">
          <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted">
            <div className="flex flex-col justify-between gap-6 sm:flex-row">
              <div className="max-w-xs">
                <div className="flex items-center gap-2 text-fg">
                  <Logo className="h-6 w-6" />
                  <span className="font-bold">{BRAND_NAME}</span>
                </div>
                <p className="mt-3 text-xs leading-relaxed">
                  The crypto-native terminal for volatility index markets. Trade live,
                  settle instantly.
                </p>
              </div>
              <div className="flex flex-wrap gap-x-12 gap-y-2">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-fg">
                    Product
                  </span>
                  <a href="#markets" className="hover:text-fg">Markets</a>
                  <Link href="/how-it-works" className="hover:text-fg">How it works</Link>
                  <Link href="/payout-rules" className="hover:text-fg">Payout rules</Link>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-fg">
                    Account
                  </span>
                  <Link href="/login" className="hover:text-fg">Log in</Link>
                  <Link href="/register" className="hover:text-fg">Create account</Link>
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-border pt-6 text-xs leading-relaxed">
              <p className="max-w-3xl">
                Trading volatility indices carries risk and may not be suitable for
                everyone. Only trade with funds you can afford to lose. Prices are
                provided by the Deriv synthetic-index feed.
              </p>
              <p className="mt-3">
                © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-surface px-3 py-3 text-center">
      <div className="num text-xl font-bold text-fg">{value}</div>
      <div className="mt-0.5 text-[11px] text-muted">{label}</div>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <div className="term-card p-5 transition-colors hover:border-[rgb(var(--teal))]">
      <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[rgb(var(--teal))] bg-[rgb(var(--teal)/0.1)] text-[rgb(var(--teal))]">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-bold">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted">{desc}</p>
    </div>
  );
}
