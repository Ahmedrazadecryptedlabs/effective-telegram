import React from "react";
import TokenInputSection from "./TokenInputSection";
import SwapButton from "@/components/ui/SwapButton";
import JupiterZToggle from "@/components/ui/jupiterztoggle";

import RateExpirySection from "./RateExpirySection";
import LimitOrderSummary from "./LimitOrderSummary";

interface LimitComponentProps {
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

const LimitComponent: React.FC<LimitComponentProps> = ({
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
  const handleUseMarketClick = () => {
    console.log("Use Market clicked");
  };
  const orderDetails = [
    { label: "Sell Order", value: "5 USDC" },
    { label: "To Buy", value: "0.026082225 SOL" },
    { label: "Buy SOL at Rate", value: "191.701436515 USDC" },
    { label: "Expiry", value: "Never" },
    { label: "Platform Fee", value: "0.10%" },
  ];
  return (
    <div className="space-y-[4px]">
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
        showWalletInfo={true} // Control whether to show wallet info

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
        quoteLoading={quoteLoading}
        modalType="buy"
        setModalType={setModalType}
        setModalOpen={setModalOpen}
          showAmountSpan={true} // Explicitly false
          showWalletInfo={true} // Control whether to show wallet info

      />
    <RateExpirySection
        rate="191.530483704"
        currency="USDC"
        approxValue="$191.54"
        onUseMarketClick={handleUseMarketClick}
      />
      
      <button
        disabled={!sellAmount}
        onClick={executeJupiterSwap}
        className="w-full  !my-2  px-4 py-5 text-primary rounded-xl font-bold text-md bg-primary/10  border-cyan-400 border border-transparent  hover:border-cyan-400border  hover:border-cyan-400"
      >
        {connected ? "Swap" : "Connect Wallet"}
      </button>
      <LimitOrderSummary
  headerText="Limit Order Summary"
  infoText="You will receive exactly what you have specified, minus platform fees."
  linkText="Learn more"
  linkUrl="#"
  orderDetails={orderDetails}
/>

    </div>
  );
};

export default LimitComponent;
