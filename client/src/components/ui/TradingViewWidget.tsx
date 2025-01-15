"use client";

import React, { useEffect, useRef, memo } from "react";

interface TradingViewWidgetProps {
  symbol: string;
}

function TradingViewWidget({ symbol }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (container.current) {
      container.current.innerHTML = "";
    }

    const timer = setTimeout(() => {
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;

      const widgetOptions = {
        autosize: true,
        symbol,
        interval: "1",
        widgetbar: {
          details: false,
          watchlist: false,
          news: false,
          datawindow: false,
          watchlist_settings: { default_symbols: [] },
        },
        timeFrames: [
          { text: "5y", resolution: "1W" },
          { text: "1y", resolution: "1W" },
          { text: "6m", resolution: "120" },
          { text: "3m", resolution: "60" },
          { text: "1m", resolution: "30" },
          { text: "5d", resolution: "5" },
          { text: "1d", resolution: "1" },
        ],
        locale: "en",
        uid: "tradingview_dynamic_" + symbol,
        clientId: "0",
        userId: "0",
        chartsStorageVer: "1.0",
        customCSS: "https://static.jup.ag/tv/css/tradingview.css",
        autoSaveDelay: "1",
        debug: "false",
        timezone: "Etc/UTC",
        theme: "dark",
      };

      script.innerHTML = JSON.stringify(widgetOptions);

      if (container.current) {
        container.current.appendChild(script);
        console.log("TradingView widget rendered with symbol:", symbol);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [symbol]);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ height: "500px", width: "100%" }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "calc(100% - 32px)", width: "100%" }}
      />
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);


// import React, { useEffect, useRef, memo } from "react";

// interface TradingViewWidgetProps {
//   tradingViewSymbol: string; // e.g. "BINANCE:SOLUSDT"
//   interval?: string;         // e.g. "D", "1h", "15m"
//   theme?: "dark" | "light";
// }

// function TradingViewWidget({
//   tradingViewSymbol,
//   interval = "D",
//   theme = "light",
// }: TradingViewWidgetProps) {
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     // 1) Create the <script> element
//     const script = document.createElement("script");
//     script.src =
//       "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
//     script.type = "text/javascript";
//     script.async = true;

//     // 2) The script’s config (innerHTML)
//     script.innerHTML = JSON.stringify({
//       autosize: true,
//       symbol: tradingViewSymbol,
//       interval,         // e.g. "1h" or "D"
//       timezone: "Etc/UTC",
//       theme,            // "dark" or "light"
//       style: "1",
//       locale: "en",
//       allow_symbol_change: true,
//       hide_side_toolbar: false,
//     });

//     // 3) Append <script> into container
//     containerRef.current.appendChild(script);

//     // 4) Cleanup if props change
//     return () => {
//       if (script.parentNode) {
//         script.parentNode.removeChild(script);
//       }
//     };
//   }, [tradingViewSymbol, interval, theme]);

//   return (
//     <div
//       ref={containerRef}
//       className="tradingview-widget-container"
//       style={{ width: "100%", height: "100%" }}
//     >
//       <div
//         className="tradingview-widget-container__widget"
//         style={{ width: "100%", height: "100%" }}
//       />
//     </div>
//   );
// }

// // Export as default
// export default memo(TradingViewWidget);
