"use client";
import React, { useState } from "react";
import {
  BarChart4,
  Settings,
  ChevronsDownUp,
  Activity,
} from "lucide-react";

/** 
 * Simplified interface for a token 
 * (include whichever fields you actually use).
 */
interface Token {
  symbol: string;
  address: string;
}

/**
 * Props for TradingPairCard 
 * - baseToken: your "sell" token
 * - quoteToken: your "buy" token
 * - price, priceChangePercent: optional placeholders if you want to show real data
 */
interface TradingPairCardProps {
  baseToken: Token | null;
  quoteToken: Token | null;
  price?: number;
  priceChangePercent?: number;
}

/** 
 * Helper to shorten an address like "So1111111111111111112" 
 * → "So11...11112" 
 */
function shortenAddress(address: string) {
  if (!address) return "";
  const start = address.slice(0, 4);
  const end = address.slice(-5);
  return `${start}...${end}`;
}

/** 
 * Hard-coded map from "BASE/QUOTE" → TradingView symbol. 
 * Fill out more pairs as you see fit. 
 */
const TV_SYMBOL_MAP: Record<string, string> = {
  "SOL/USDC": "KUCOIN:SOL-USDC",
  "SOL/USDT": "BINANCE:SOLUSDT",
  "BTC/USDT": "BINANCE:BTCUSDT",
  // Add more as you like...
};

/** 
 * If no exact match in the map, fallback to something that definitely exists 
 */
function getTradingViewSymbol(baseSymbol: string, quoteSymbol: string) {
  const pair = `${baseSymbol}/${quoteSymbol}`.toUpperCase();
  if (TV_SYMBOL_MAP[pair]) {
    return TV_SYMBOL_MAP[pair];
  }
  // fallback
  return "BINANCE:SOLUSDT";
}

export default function TradingPairCard({
  baseToken,
  quoteToken,
  price = 187.8,
  priceChangePercent = -0.32,
}: TradingPairCardProps) {
  const [selectedInterval, setSelectedInterval] = useState("1m");
  const intervals = ["1m", "30m", "1h", "15m"];

  // Decide if price change is negative
  const isNegative = priceChangePercent < 0;

  // If tokens are null, show placeholders
  const baseSymbol = baseToken?.symbol || "SOL";
  const baseAddress = baseToken?.address ? shortenAddress(baseToken.address) : "So11...11112";
  const quoteSymbol = quoteToken?.symbol || "USDC";
  const quoteAddress = quoteToken?.address ? shortenAddress(quoteToken.address) : "EPjF...Dt1v";

  // Construct TradingView symbol
  const tvSymbol = getTradingViewSymbol(baseSymbol, quoteSymbol);

  // Hard-coded OHLC placeholders:
  const open = 187.9;
  const high = 187.9;
  const low = 186.5;
  const close = 186.5;
  const changeAmt = 0.1;
  const changePct = -0.72;
  const volume = "119.943K";

  return (
    <div className="bg-[#192230] rounded-2xl p-4 text-white">
      {/* Top bar */}
      <div className="flex items-center justify-between pb-2">
        {/* Left: "SOL / USDC" + "=" (or your tokens) */}
        <div className="flex items-center space-x-2">
          {/* Fake colored icons */}
          <div className="relative">
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-green-500 to-teal-500 absolute -right-3 top-0" />
          </div>
          <span className="font-semibold text-lg">{baseSymbol} / {quoteSymbol}</span>
          <span className="text-gray-400 text-sm">=</span>
        </div>

        {/* Right: base token address + quote token address */}
        <div className="hidden sm:flex items-center space-x-6">
          <div className="flex items-center space-x-1">
            <span className="text-gray-200 font-semibold">{baseSymbol}</span>
            <span className="text-gray-500">{baseAddress}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-gray-200 font-semibold">{quoteSymbol}</span>
            <span className="text-gray-500">{quoteAddress}</span>
          </div>
        </div>
      </div>

      {/* Price row */}
      <div className="text-2xl font-bold">
        {price} {quoteSymbol}{" "}
        <span className={`ml-2 text-sm ${isNegative ? "text-red-400" : "text-green-400"}`}>
          {priceChangePercent}%
        </span>
      </div>

      {/* Intervals + icons row */}
      <div className="flex items-center justify-between mt-3">
        {/* intervals: 1m, 30m, 1h, 15m */}
        <div className="flex space-x-3 text-sm text-gray-300">
          {intervals.map((i) => (
            <button
              key={i}
              className={`
                ${
                  selectedInterval === i
                    ? "text-white border-b border-cyan-400"
                    : "hover:text-white"
                }
              `}
              onClick={() => setSelectedInterval(i)}
            >
              {i}
            </button>
          ))}
        </div>

        {/* Right: "Indicators" + icons + OHLC row */}
        <div className="flex items-center space-x-4 text-gray-300">
          {/* OHLC row: "O 187.9 ... Vol 119.943K" */}
          <div className="hidden md:flex items-center text-sm space-x-2">
            <span className="text-gray-500">
              O {open} | H {high} | L {low} | C {close} | {changeAmt} | {changePct}% | Vol {volume}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button className="hover:text-white flex items-center space-x-1">
              <span>Indicators</span>
              <Activity size={16} />
            </button>
            <button className="hover:text-white">
              <Settings size={16} />
            </button>
            <button className="hover:text-white">
              <BarChart4 size={16} />
            </button>
            <button className="hover:text-white">
              <ChevronsDownUp size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* TradingView chart iframe */}
      <div className="mt-3 rounded-xl overflow-hidden w-full border border-gray-700">
        <iframe
          title="TradingView Chart"
          src={`https://www.tradingview.com/widgetembed/?symbol=${encodeURIComponent(
            tvSymbol
          )}&interval=${selectedInterval}&hidesidetoolbar=1&theme=dark&style=1&locale=en&withdateranges=1&hidelegend=0&saveimage=1&toolbarbg=%2319191C&studies=[]&hideideas=1`}
          frameBorder="0"
          className="w-full"
          style={{ height: "400px", minHeight: "300px" }}
        />
      </div>

      {/* Bottom stats row */}
      <div className="flex items-center justify-end mt-3 space-x-6 text-sm text-gray-300">
        <div>
          <span className="text-gray-400">Mkt Cap</span> <span className="ml-1">$91B</span>
        </div>
        <div>
          <span className="text-gray-400">24h Vol</span> <span className="ml-1">$2.9B</span>
        </div>
        <div>
          <span className="text-gray-400">Liquidity</span> <span className="ml-1">$60B</span>
        </div>
      </div>
    </div>
  );
}
