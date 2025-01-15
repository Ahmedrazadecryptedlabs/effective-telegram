import React from "react";
import TokenInputSection from "./TokenInputSection";
import SwapButton from "@/components/ui/SwapButton";
import JupiterZToggle from "@/components/ui/jupiterztoggle";
import SettingsToggle from "@/components/ui/SettingsToggle";

interface SwapComponentProps {
  tokenListLoading: boolean;
  sellCurrency: any;
  setSellCurrency: (token: any) => void;
  buyCurrency: any;
  setBuyCurrency: (token: any) => void;
  sellAmount: number | undefined;
  setSellAmount: (amount: number | undefined) => void;
  buyAmount: number;
  quoteLoading: boolean;
  modalType: "sell" | "buy";
  setModalType: (type: "sell" | "buy") => void;
  setModalOpen: (open: boolean) => void;
  connected: boolean;
  executeJupiterSwap: () => void;
  loadingSwap: boolean;
}

const SwapComponent: React.FC<SwapComponentProps> = ({
  tokenListLoading,
  sellCurrency,
  setSellCurrency,
  buyCurrency,
  setBuyCurrency,
  sellAmount,
  setSellAmount,
  buyAmount,
  quoteLoading,
  modalType,
  setModalType,
  setModalOpen,
  connected,
  executeJupiterSwap,
  loadingSwap,
}) => {
  return (
    <div className="space-y-2">
      <SettingsToggle />
      <TokenInputSection
        label="You're Selling"
        tokenListLoading={tokenListLoading}
        selectedToken={sellCurrency}
        amount={sellAmount}
        onAmountChange={setSellAmount}
        onSelectToken={setSellCurrency}
        quoteLoading={quoteLoading}
        modalType="sell"
        setModalType={setModalType}
        setModalOpen={setModalOpen}
        showAmountSpan={false} // Explicitly false
    
      />
      <SwapButton
        onSwap={() => {
          const tempCurrency = sellCurrency;
          setSellCurrency(buyCurrency);
          setBuyCurrency(tempCurrency);
          setSellAmount(buyAmount);
        }}
      />
      <TokenInputSection
        label="You're Buying"
        tokenListLoading={tokenListLoading}
        selectedToken={buyCurrency}
        amount={buyAmount}
        onSelectToken={setBuyCurrency}
        onAmountChange={() => {}}
        modalType="buy"
        setModalType={setModalType}
        setModalOpen={setModalOpen}
        quoteLoading={quoteLoading}
        showAmountSpan={false} // Explicitly false
        backgroundColorClass="bg-[#19232D]" // or any other custom Tailwind class

      />
      <JupiterZToggle />
      <button
        disabled={!sellAmount}
        className="w-full  px-4 py-5 text-primary rounded-xl font-bold text-md bg-primary/10  border-cyan-400 border border-transparent  hover:border-cyan-400border  hover:border-cyan-400"
      >
        {connected ? "Swap" : "Connect Wallet"}
      </button>
    </div>
  );
};

export default SwapComponent;
