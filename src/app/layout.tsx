import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cryptonichub.tech"),
  title: "Cryptonichub — Trade Volatility Indices",
  description:
    "Trade Volatility Indices live with instant deposits and withdrawals. Simple, fast, and built for everyone.",
  openGraph: {
    title: "Cryptonichub — Trade Volatility Indices",
    description:
      "Trade Volatility Indices live with instant deposits and withdrawals. Simple, fast, and built for everyone.",
    url: "https://cryptonichub.tech",
    siteName: "Cryptonichub",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    title: "Cryptonichub",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#2F6FED",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
