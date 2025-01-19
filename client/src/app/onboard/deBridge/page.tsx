"use client";

import { useEffect, useState } from "react";

export default function DeBridgePage() {
  const [isSkeletonVisible, setSkeletonVisible] = useState(true);
  const [widgetZIndex, setWidgetZIndex] = useState(-1); // Initially hidden

  useEffect(() => {
    // Preload the script immediately
    const script = document.createElement("script");
    script.src = "https://app.debridge.finance/assets/scripts/widget.js";
    script.async = true;

    // Handle when the script is ready
    script.onload = () => {
      initializeWidget();

      // Add a 10-second delay before displaying the widget
      setTimeout(() => {
        setSkeletonVisible(false); // Hide skeleton
        setWidgetZIndex(10); // Bring the widget to the front
      }, 10000);
    };

    // Append the script to the document
    document.body.appendChild(script);

    // Cleanup: remove script on unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeWidget = () => {
    try {
      // Initialize the widget
      window.deBridge?.widget({
        v: "1",
        element: "debridgeWidget",
        title: "",
        description: "",
        width: "600",
        height: "720",
        r: null,
        supportedChains: JSON.stringify({
          inputChains: {
            "1": "all",
            "10": "all",
            "56": "all",
            "100": "all",
            "137": "all",
            "146": "all",
            "250": "all",
            "998": "all",
            "1088": "all",
            "7171": "all",
            "8453": "all",
            "42161": "all",
            "43114": "all",
            "59144": "all",
            "7565164": "all",
            "245022934": "all",
          },
          outputChains: {
            "1": "all",
            "10": "all",
            "56": "all",
            "100": "all",
            "137": "all",
            "146": "all",
            "250": "all",
            "998": "all",
            "1088": "all",
            "7171": "all",
            "8453": "all",
            "42161": "all",
            "43114": "all",
            "59144": "all",
            "7565164": "all",
            "245022934": "all",
          },
        }),
        inputChain: 56,
        outputChain: 1,
        inputCurrency: "",
        outputCurrency: "",
        address: "",
        showSwapTransfer: true,
        amount: "",
        outputAmount: "",
        isAmountFromNotModifiable: false,
        isAmountToNotModifiable: false,
        lang: "en",
        mode: "deswap",
        isEnableCalldata: false,
        styles:
          "eyJhcHBCYWNrZ3JvdW5kIjoiIzMwNDI1NiIsImJvcmRlclJhZGl1cyI6MTIsInByaW1hcnlCdG5CZyI6IiMxMjFEMjgiLCJwcmltYXJ5QnRuVGV4dCI6IiMxZmJkZTgiLCJkZXNjcmlwdGlvbkZvbnRTaXplIjoiMTIifQ==",
        theme: "dark",
        isHideLogo: false,
        logo: "",
        disabledWallets: [],
        disabledElements: [],
      });
    } catch (error) {
      console.error("Error initializing widget:", error);
    }
  };

  return (
    <div className="text-white text-center flex flex-col justify-center items-center">
      <p className="text-center text-base font-medium text-v2-lily-75 mt-6 mb-4">
        Experience native cross-chain trading with deep liquidity and <br className="hidden sm:block" />
        lightning-fast execution, powered by deBridge and Jupiter.
      </p>

      <div className="relative w-[600px] h-[720px]">
        {/* Show Skeleton until the widget is ready */}
        {isSkeletonVisible && (
          <div className="absolute top-0 left-0 w-full h-full bg-[#192531] rounded-2xl animate-pulse p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-8 w-1/4 bg-[#202a36] rounded"></div>
              <div className="h-8 w-8 bg-[#202a36] rounded"></div>
            </div>
            <div className="h-40 w-full bg-[#202a36] rounded"></div>
            <div className="h-8 w-16 bg-[#202a36] rounded mx-auto"></div>
            <div className="h-24 w-full bg-[#202a36] rounded"></div>
            <div className="flex justify-between items-center">
              <div className="h-8 w-1/3 bg-[#202a36] rounded"></div>
              <div className="h-8 w-1/3 bg-[#202a36] rounded"></div>
            </div>
            <div className="h-10 w-full bg-[#202a36] rounded"></div>
          </div>
        )}

        {/* Render the Widget */}
        <div
          id="debridgeWidget"
          className={`absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl [&>iframe]:max-w-full`}
          style={{
            zIndex: widgetZIndex,
            opacity: widgetZIndex > 0 ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
          }}
        ></div>
      </div>
    </div>
  );
}
