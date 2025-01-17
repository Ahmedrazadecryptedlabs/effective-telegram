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