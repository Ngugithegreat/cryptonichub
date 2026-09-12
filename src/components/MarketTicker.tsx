"use client";

import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { MARKETS } from "@/lib/markets";
import { basePrice, baseChange, fmtPrice, roundTo } from "@/lib/mockPrices";

type Row = { symbol: string; short: string; decimals: number; price: number; change: number };

// A Binance/Bybit-style tape: auto-scrolling row of markets with a mono price
// and a green/red 24h change. Prices are seeded deterministically (SSR-safe)
// then gently jittered on the client so the strip feels alive.
export function MarketTicker() {
  const [rows, setRows] = useState<Row[]>(() =>
    MARKETS.map((m) => ({
      symbol: m.symbol,
      short: m.short,
      decimals: m.decimals,
      price: basePrice(m),
      change: baseChange(m),
    }))
  );

  useEffect(() => {
    const id = setInterval(() => {
      setRows((prev) =>
        prev.map((r) => {
          const wobble = (Math.random() - 0.5) * r.price * 0.0016;
          const price = roundTo(Math.max(r.price + wobble, 0.01), r.decimals);
          const change = Math.round((r.change + (Math.random() - 0.5) * 0.08) * 100) / 100;
          return { ...r, price, change };
        })
      );
    }, 1400);
    return () => clearInterval(id);
  }, []);

  // Duplicate the list so the marquee loops seamlessly.
  const loop = [...rows, ...rows];

  return (
    <div className="relative overflow-hidden border-y border-border bg-surface/60">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg to-transparent" />
      <div className="tape-track flex w-max items-center gap-6 py-2.5">
        {loop.map((r, i) => {
          const up = r.change >= 0;
          return (
            <span
              key={`${r.symbol}-${i}`}
              className="flex shrink-0 items-center gap-2 whitespace-nowrap px-1 text-[13px]"
            >
              <span className="font-semibold tracking-tight">{r.short}</span>
              <span className="num text-muted">{fmtPrice(r.price, r.decimals)}</span>
              <span
                className={`num inline-flex items-center gap-0.5 font-medium ${
                  up ? "text-up" : "text-down"
                }`}
              >
                {up ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {up ? "+" : ""}
                {r.change.toFixed(2)}%
              </span>
              <span className="text-border">|</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
