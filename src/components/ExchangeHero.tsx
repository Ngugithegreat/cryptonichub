"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { PriceChart } from "@/components/PriceChart";
import { useDerivFeed } from "@/lib/useDerivFeed";
import { MARKETS, PAYOUT_MULTIPLIER } from "@/lib/markets";
import { basePrice, orderBook, fmtPrice } from "@/lib/mockPrices";

const HERO_MARKET = MARKETS.find((m) => m.symbol === "R_100")!;

// A mock — but convincing — exchange trading terminal: a live chart, a compact
// order book, and a Buy/Sell ticket. Cosmetic marketing surface only.
export function ExchangeHero() {
  const feed = useDerivFeed(HERO_MARKET.symbol);
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("100");

  const rising = feed.last && feed.prev ? feed.last.price >= feed.prev.price : true;
  const mid = feed.last?.price ?? basePrice(HERO_MARKET);
  const book = useMemo(() => orderBook(mid, HERO_MARKET.decimals), [mid]);

  const amt = Math.max(0, Number(amount) || 0);
  const payout = (amt * PAYOUT_MULTIPLIER).toFixed(2);
  const sideUp = side === "buy";

  return (
    <div className="term-glow term-card overflow-hidden">
      {/* Terminal top bar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-md border border-border bg-surface2 px-2 py-1 text-xs font-semibold">
            {HERO_MARKET.short}
            <span className="text-muted">/ USDT</span>
          </span>
          <span className="flex items-center gap-1 text-[11px] text-muted">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                feed.connected ? "bg-up animate-pulseSoft" : "bg-muted"
              }`}
            />
            {feed.connected ? "Live" : "connecting"}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`num text-lg font-bold ${rising ? "text-up" : "text-down"}`}>
            {fmtPrice(mid, HERO_MARKET.decimals)}
          </span>
          <span
            className={`num inline-flex items-center text-xs ${
              rising ? "text-up" : "text-down"
            }`}
          >
            {rising ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {rising ? "+1.24%" : "-1.24%"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto]">
        {/* Chart */}
        <div className="h-[260px] border-b border-border p-2 sm:border-b-0 sm:border-r">
          <PriceChart points={feed.points} up={rising} decimals={HERO_MARKET.decimals} />
        </div>

        {/* Order book */}
        <div className="w-full px-3 py-2 sm:w-[190px]">
          <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted">
            <span>Price</span>
            <span>Size</span>
          </div>
          <div className="space-y-0.5">
            {book.asks.map((a, i) => (
              <Row key={`a${i}`} price={fmtPrice(a.price, HERO_MARKET.decimals)} size={a.size} tone="down" />
            ))}
          </div>
          <div className="my-1 flex items-center justify-center gap-1 border-y border-border py-1 text-xs">
            <Activity className="h-3 w-3 text-[rgb(var(--teal))]" />
            <span className="num font-semibold text-[rgb(var(--teal))]">
              {fmtPrice(mid, HERO_MARKET.decimals)}
            </span>
          </div>
          <div className="space-y-0.5">
            {book.bids.map((b, i) => (
              <Row key={`b${i}`} price={fmtPrice(b.price, HERO_MARKET.decimals)} size={b.size} tone="up" />
            ))}
          </div>
        </div>
      </div>

      {/* Buy / Sell ticket */}
      <div className="border-t border-border p-3">
        <div className="grid grid-cols-2 gap-1 rounded-md border border-border bg-surface2 p-1">
          <button
            type="button"
            onClick={() => setSide("buy")}
            className={`rounded py-1.5 text-sm font-semibold transition ${
              sideUp ? "bg-up text-black" : "text-muted hover:text-fg"
            }`}
          >
            Rise
          </button>
          <button
            type="button"
            onClick={() => setSide("sell")}
            className={`rounded py-1.5 text-sm font-semibold transition ${
              !sideUp ? "bg-down text-white" : "text-muted hover:text-fg"
            }`}
          >
            Fall
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between rounded-md border border-border bg-input px-3 py-2">
          <span className="text-xs text-muted">Amount</span>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted">$</span>
            <input
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              className="num w-16 bg-transparent text-right text-sm font-semibold outline-none"
              aria-label="Amount"
            />
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-muted">Payout ({PAYOUT_MULTIPLIER}x)</span>
          <span className="num font-bold text-[rgb(var(--teal))]">${payout}</span>
        </div>

        <Link
          href="/register"
          className={`btn mt-3 w-full py-2.5 text-sm font-bold ${
            sideUp ? "bg-up text-black" : "bg-down text-white"
          }`}
        >
          {sideUp ? "Trade Rise" : "Trade Fall"}
        </Link>
      </div>
    </div>
  );
}

function Row({ price, size, tone }: { price: string; size: string; tone: "up" | "down" }) {
  return (
    <div className="relative flex items-center justify-between text-[11px]">
      <span className={`num ${tone === "up" ? "text-up" : "text-down"}`}>{price}</span>
      <span className="num text-muted">{size}</span>
    </div>
  );
}
