"use client";
import { useEffect } from "react";

export default function DeBridgePage() {
  useEffect(() => {
    // Create and append the widget script dynamically
    const script = document.createElement("script");
    script.src = "https://app.debridge.finance/assets/scripts/widget.js";
    script.async = true;

    script.onload = () => {
      // Initialize the deBridge widget after the script loads
      if (window.deBridge) {
        window.deBridge.widget({
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
      }
    };

    // Append the script to the document
    document.body.appendChild(script);

    // Cleanup function to remove the script to prevent memory leaks
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className=" text-white text-center flex flex-col justify-center items-center">
<p className=" text-center text-base font-medium text-v2-lily-75 mt-6 mb-4">Experience native cross-chain trading with deep liquidity and <br className="hidden sm:block"/> lightning-fast execution, powered by deBridge and Jupiter.</p>
      <div
        id="debridgeWidget"
        className="overflow-hidden rounded-2xl [&>iframe]:max-w-full"
      >
        {/* The widget will render here */}
      </div>
    </div>
  );
}
