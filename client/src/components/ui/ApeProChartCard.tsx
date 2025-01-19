"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart4,
  Settings,
  ChevronsDownUp,
  Activity,
  ArrowRightLeft,
  ExternalLink,
} from "lucide-react";
import TradingViewWidget from "./TradingViewWidget";

/** 
 * The Token type you already have in your code.
 */
interface Token {
  symbol: string;
  address: string;
  logoURI?: string;
}

/**
 * Props for our reusable chart card:
 * - baseToken, quoteToken: the "sell" + "buy" tokens
 */
interface TradingViewChartCardProps {
  baseToken: Token | null;
  quoteToken: Token | null;
}

/** 
 * Shorten addresses, e.g. "So111...11112"
 */
function shortenAddress(address: string) {
  if (!address) return "";
  return address.slice(0, 4) + "..." + address.slice(-5);
}

/** 
 * (Optional) fetch the current price from Jupiter’s FE API 
 *   https://fe-api.jup.ag/api/v1/tokens/[baseMint]?quote_address=[quoteMint]
 */
async function fetchJupiterPrice(baseMint: string, quoteMint: string) {
  const url = `https://fe-api.jup.ag/api/v1/tokens/${baseMint}?quote_address=${quoteMint}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch Jupiter price: ${res.statusText}`);
  }
  const json = await res.json();
  // Typically returns { data: { price: 23.45, mintSymbol: "SOL", ... } }
  return json?.data?.price as number | undefined;
}

/**
 * If you want to fetch candlestick data from Jupiter’s "charts" endpoint:
 *   https://fe-api.jup.ag/api/v1/charts/[baseMint]?quote_address=[quoteMint]&type=30m&time_from=...&time_to=...
 * you can do it here. But TradingView’s embed can’t directly use that data.
 * You’d need a custom chart library to plot it.
 */
async function fetchJupiterCandles(baseMint: string, quoteMint: string) {
  // Example:
  const url = `https://fe-api.jup.ag/api/v1/charts/${baseMint}?quote_address=${quoteMint}&type=30m&time_from=1736937036&time_to=1736938836`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch Jupiter candles: ${res.statusText}`);
  }
  const json = await res.json();
  // Typically returns { data: [ { t, o, h, l, c, v } ... ] }
  return json?.data;
}

/**
 * TradingView needs a "symbol" like "BINANCE:SOLUSDT" or "KUCOIN:SOL-USDC".
 * We can map from base/quote to a TradingView symbol if recognized.
 */
const TV_SYMBOL_MAP: Record<string, string> = {
  "SOL/USDC": "KUCOIN:SOL-USDC",
  "SOL/USDT": "BINANCE:SOLUSDT",
  "BTC/USDT": "BINANCE:BTCUSDT",
  "BONK/SOL":  "ORCA:BONK_SOL", // if available, example only
};

/**
 * Build or guess a TV symbol from base/quote, fallback if unknown.
 */
function getTradingViewSymbol(baseSym: string, quoteSym: string) {
  const pairKey = `${baseSym}/${quoteSym}`.toUpperCase();
  return TV_SYMBOL_MAP[pairKey] || "BINANCE:SOLUSDT"; // fallback
}

export default function TradingViewChartCard({
  baseToken,
  quoteToken,
}: TradingViewChartCardProps) {
  console.log("🚀 ~ quoteToken:", quoteToken)
  console.log("🚀 ~ baseToken:", baseToken)
  // We can store the fetched price
  const [price, setPrice] = useState<number | null>(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  // Basic intervals for the TradingView iframe
  const [selectedInterval, setSelectedInterval] = useState("1h");
  const intervals = ["1m", "30m", "1h", "4h", "1D"];

  // If tokens are null, fallback
  const baseSym = baseToken?.symbol || "SOL";
  const quoteSym = quoteToken?.symbol || "USDC";
  const baseAddr = baseToken?.address || "So11111111111111111111111111111111111111112";
  const quoteAddr = quoteToken?.address || "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

  // Shorten addresses
  const baseShort = shortenAddress(baseAddr);
  const quoteShort = shortenAddress(quoteAddr);

  // Token images
  const baseImg = baseToken?.logoURI || "/icons/sol.svg";
  const quoteImg = quoteToken?.logoURI || "/icons/usdc.svg";

  // If you want some dummy OHLC stats for display only
  const open = 23.0,
    high = 24.2,
    low = 22.9,
    close = 23.5,
    changeAmt = 0.1,
    changePct = -0.72,
    volume = "119.943K";

  // TradingView symbol
  const tvSymbol = getTradingViewSymbol(baseSym, quoteSym);

  // On mount or whenever tokens change, fetch the Jupiter price
  useEffect(() => {
    if (!baseAddr || !quoteAddr) {
      setPrice(null);
      return;
    }
    async function doFetchPrice() {
      try {
        setLoadingPrice(true);
        const p = await fetchJupiterPrice(baseAddr, quoteAddr);
        if (typeof p === "number") setPrice(p);
        else setPrice(null);
      } catch (err) {
        console.error(err);
        setPrice(null);
      } finally {
        setLoadingPrice(false);
      }
    }
    doFetchPrice();
  }, [baseAddr, quoteAddr]);

  // Optional: Also fetch the candlestick data from Jupiter’s charts
  // but we can’t show it in TradingView embed. This is just an example if you need it.
  useEffect(() => {
    (async () => {
      try {
        const candleData = await fetchJupiterCandles(baseAddr, quoteAddr);
        // console.log("Jupiter candlesticks data:", candleData);
        // If you want to do something with it, you'd need a custom chart library.
      } catch (error) {
        console.warn("No candle data or error:", error);
      }
    })();
  }, [baseAddr, quoteAddr]);

  // Price display
  let priceDisplay = "—";
  if (loadingPrice) priceDisplay = "Loading...";
  else if (price !== null) priceDisplay = price.toFixed(3);

  return (
    <div className="bg-[#131B24] rounded-2xl pt-1 text-white">
      {/* Top row: tokens + addresses */}
      <div   style={{"borderBottom" :"2px solid  #1E272F"}}   className="px-4 py-1 flex items-center justify-between ">
        {/* Left side: token icons + pair name */}
        <div   className="flex items-center space-x-2">
          <div className="relative flex items-center">
            <img
              src={baseImg}
              alt={baseSym}
              className="w-7 h-7 rounded-full border-2 border-[#192230] mr-[-8px]"
            />
            <img
              src={quoteImg}
              alt={quoteSym}
              className="w-7 h-7 rounded-full border-2 border-[#192230]"
            />
          </div>
          <span className="font-semibold text-md">
            {baseSym} <span className="text-[#535E66]" >/</span> {quoteSym}
          </span>
          <span className="text-sm"><ArrowRightLeft className="text-[#535E66]" size={11} /></span>
        </div>
        {/* Right side: shortened addresses */}
        <div className="hidden sm:flex flex-col items-center space-y-1 text-xs text-gray-400">
          <div className="flex items-center space-x-[6px]">
            <span className="text-xxs text-gray-200 font-semibold">{baseSym}</span>
            <span className="bg-[#0E141B] text-white px-[6px] py-[3px] text-xxs flex items-center  rounded-sm"><span className="px-2" >{baseShort}</span> <ExternalLink size={9}  /></span>
          </div>
          <div className="flex items-center space-x-[6px]">
            <span className="text-xxs text-gray-200 font-semibold">{quoteSym}</span>
            <span className="bg-[#0E141B] text-white px-[6px] py-[3px] text-xxs flex items-center  rounded-sm"><span className="px-1" >{quoteShort}</span> <ExternalLink size={9}  /></span>
          </div>
        </div>
      </div>

      {/* Price row */}
      <div className="px-4 py-1 flex items-center justify-between">
      <div className="text-md font-bold flex flex-col space-y-3 justify-start items-start">
       123 {quoteSym}

       <span className="text-xs text-green-500" >+6.89%</span>
      </div>
      <div className="flex items-center justify-end mt-3 space-x-5 text-sm text-gray-300">
        <div>
          <span className="text-[#41595A] font-semibold   flex flex-col justify-start items-start text-xs">Mkt Cap</span> <span className="text-v2-lily-50 font-semibold  text-gray-400"  >$91B</span>
        </div>
        <div>
          <span className="text-[#41595A] font-semibold   flex flex-col justify-start items-start text-xs">24h Vol</span> <span className="text-v2-lily-50 font-semibold  text-gray-400"  >$2.9B</span>
        </div>
        <div>
          <span className="text-[#41595A] font-semibold   flex flex-col justify-start items-start text-xs">Liquidity</span> <span  className="text-v2-lily-50 font-semibold  text-gray-400" >$60B</span>
        </div>
      </div>


      </div>

      {/* TradingView embed */}
      <div className="rounded-xl overflow-hidden w-full ">


        <iframe
          title="TradingView Chart"
          src={`https://www.tradingview.com/widgetembed/?frameElementId=tradingview_widget&symbol=BINANCE:SOLUSDT&interval=D&hidesidetoolbar=1&theme=dark&style=1&timezone=Etc/UTC&studies=[]&locale=en&utm_source=yourwebsite.com&utm_medium=widget&utm_campaign=chart&utm_term=BINANCE:SOLUSDT`}
          frameBorder="0"
          className="w-full !border-none"
          style={{ height: "385px", minHeight: "300px" }}
        />

      </div>

      {/* Bottom stats row */}
    
    </div>
  );
}
