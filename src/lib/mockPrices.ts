// Deterministic pseudo-market data for the public landing page ONLY.
// These are cosmetic seeds so the marketing terminal renders identically on the
// server and the client's first paint (no hydration mismatch). They are NOT the
// live trading feed — the real app uses useDerivFeed / the Deriv stream.

import type { Market } from "@/lib/markets";
import type { Point } from "@/lib/useDerivFeed";

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Small deterministic PRNG (mulberry32) seeded per symbol. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A stable, plausible base price for a market (kept in a crypto-ish range). */
export function basePrice(m: Market): number {
  const h = hash(m.symbol);
  const raw = 40 + (h % 96000) / 100; // ~40 – 1000
  return roundTo(raw, m.decimals);
}

/** A stable 24h change percentage in roughly -8% … +8%. */
export function baseChange(m: Market): number {
  const h = hash(m.symbol + "chg");
  const pct = ((h % 1600) - 800) / 100; // -8.00 … +8.00
  return Math.round(pct * 100) / 100;
}

export function roundTo(v: number, decimals: number): number {
  const p = Math.pow(10, decimals);
  return Math.round(v * p) / p;
}

export function fmtPrice(v: number, decimals: number): string {
  return v.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Deterministic sparkline series for a market (24 points), trending with change. */
export function sparkPoints(m: Market, up: boolean, n = 24): Point[] {
  const r = rng(hash(m.symbol + "spark"));
  const base = basePrice(m);
  const drift = (up ? 1 : -1) * base * 0.0009;
  let price = base * (up ? 0.985 : 1.015);
  const out: Point[] = [];
  for (let i = 0; i < n; i++) {
    price += drift + (r() - 0.5) * base * 0.004;
    out.push({ epoch: i, price });
  }
  return out;
}

/** A deterministic mini order book (bids below / asks above the mid price). */
export function orderBook(mid: number, decimals: number, levels = 6) {
  const r = rng(Math.round(mid * 1000) + 7);
  const step = Math.max(mid * 0.0004, Math.pow(10, -decimals));
  const bids = [];
  const asks = [];
  for (let i = 1; i <= levels; i++) {
    const size = (0.4 + r() * 9).toFixed(3);
    const size2 = (0.4 + r() * 9).toFixed(3);
    bids.push({ price: roundTo(mid - step * i, decimals), size });
    asks.push({ price: roundTo(mid + step * i, decimals), size: size2 });
  }
  return { bids, asks: asks.reverse() };
}
