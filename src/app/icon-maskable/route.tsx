import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const dynamic = "force-static";

// 512×512 maskable icon for the PWA manifest (extra padding for the safe zone).
const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none"><path d="M24.5 16.5 20.3 23.9 11.8 23.9 7.5 16.5 11.8 9.1 20.3 9.1Z" stroke="#fff" stroke-width="2.1" stroke-linejoin="round"/><path d="M16 12 19 16 16 20 13 16Z" fill="#fff"/></svg>`;

export function GET() {
  const mark = `data:image/svg+xml;base64,${Buffer.from(MARK).toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #7FA8FF 0%, #1E52C4 100%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mark} width={300} height={300} alt="" />
      </div>
    ),
    { width: 512, height: 512 }
  );
}
