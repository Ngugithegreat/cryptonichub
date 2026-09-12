"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { MARKETS } from "@/lib/markets";
import { basePrice, baseChange, fmtPrice, roundTo, sparkPoints } from "@/lib/mockPrices";
import { Sparkline } from "@/components/Sparkline";

type Row = {
  symbol: string;
  short: string;
  name: string;
  volatility: string;
  decimals: number;
  price: number;
  change: number;
};

// Exchange-style markets table. Prices are seeded deterministically (SSR-safe)
// then gently jittered client-side. Cosmetic marketing surface only.
export function MarketsTable() {
  const [rows, setRows] = useState<Row[]>(() =>
    MARKETS.map((m) => ({
      symbol: m.symbol,
      short: m.short,
      name: m.name.replace(" Index", ""),
      volatility: m.volatility,
      decimals: m.decimals,
      price: basePrice(m),
      change: baseChange(m),
    }))
  );

  useEffect(() => {
    const id = setInterval(() => {
      setRows((prev) =>
        prev.map((r) => {
          const wobble = (Math.random() - 0.5) * r.price * 0.0014;
          return { ...r, price: roundTo(Math.max(r.price + wobble, 0.01), r.decimals) };
        })
      );
    }, 1600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="term-card overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted">
            <th className="px-4 py-3 font-medium">Market</th>
            <th className="px-4 py-3 text-right font-medium">Price</th>
            <th className="px-4 py-3 text-right font-medium">24h</th>
            <th className="px-4 py-3 text-center font-medium">Trend</th>
            <th className="px-4 py-3 text-right font-medium">Volatility</th>
            <th className="px-4 py-3 text-right font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const up = r.change >= 0;
            const m = MARKETS.find((x) => x.symbol === r.symbol)!;
            return (
              <tr
                key={r.symbol}
                className="border-b border-border/60 transition-colors last:border-0 hover:bg-surface2"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface2 text-[10px] font-bold text-[rgb(var(--teal))]">
                      {r.short.replace(" 1s", "")}
                    </span>
                    <div>
                      <div className="font-semibold leading-tight">{r.short}</div>
                      <div className="text-[11px] text-muted">{r.name}</div>
                    </div>
                  </div>
                </td>
                <td className="num px-4 py-3 text-right font-medium">
                  {fmtPrice(r.price, r.decimals)}
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`num inline-flex items-center justify-end gap-0.5 font-medium ${
                      up ? "text-up" : "text-down"
                    }`}
                  >
                    {up ? (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5" />
                    )}
                    {up ? "+" : ""}
                    {r.change.toFixed(2)}%
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center">
                    <Sparkline points={sparkPoints(m, up)} up={up} width={96} height={30} />
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-xs text-muted">{r.volatility}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href="/register"
                    className="inline-flex rounded-md border border-[rgb(var(--teal))] bg-[rgb(var(--teal)/0.1)] px-3 py-1.5 text-xs font-semibold text-[rgb(var(--teal))] transition hover:bg-[rgb(var(--teal)/0.18)]"
                  >
                    Trade
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
