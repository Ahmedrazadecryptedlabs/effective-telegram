import React from "react";
import TokenInputSection from "./TokenInputSection";
import SwapButton from "@/components/ui/SwapButton";
import LimitOrderSummary from "./LimitOrderSummary";
import TokenInputDropdown from "./TokenInputDropdown";
import DayOrderSection from "./dayorder";
import PriceRangeSection from "./PriceRangeSection";
interface DCAComponentProps {
  tokenListLoading: boolean;
  sellCurrency: any;
  setSellCurrency: (token: any) => void;
  buyCurrency: any;
  setBuyCurrency: (token: any) => void;
  sellAmount: number | undefined;
  setSellAmount: (amount: number | undefined) => void;
  buyAmount: number | undefined;
  quoteLoading: boolean;
  modalType: "sell" | "buy";
  setModalType: (type: "sell" | "buy") => void;
  setModalOpen: (open: boolean) => void;
  connected: boolean;
  executeJupiterSwap: () => void;
  loadingSwap: boolean;
}

const DCAComponent: React.FC<DCAComponentProps> = ({
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

const dcaDetails = [
  { label: "Sell total", value: "120 USDC" },
  { label: "Sell per order", value: "- USDC" },
  { label: "To buy", value: "SOL" },
  { label: "Order interval", value: "1 N71Q1g(s)" },
  { label: "Start date", value: "Immediate" },
  { label: "Estimated end date", value: "-" },
  { label: "Estimated price impact per order", value: "-%" },
  { label: "Platform fee", value: "0.1%" },
];

  return (
    <div className="space-y-[4px]">
      {/* Selling Token Input */}
      <TokenInputSection
        label="I Want To Allocate"
        tokenListLoading={tokenListLoading}
        selectedToken={sellCurrency}
        amount={sellAmount}
        onAmountChange={setSellAmount}
        onSelectToken={setSellCurrency}
        quoteLoading={quoteLoading}
        modalType="sell"
        setModalType={setModalType}
        setModalOpen={setModalOpen}
        showAmountSpan={true} // Ensure this is true
      />

      {/* Swap Button */}
      <SwapButton
        onSwap={() => {
          const tempCurrency = sellCurrency;
          setSellCurrency(buyCurrency);
          setBuyCurrency(tempCurrency);
          setSellAmount(buyAmount);
        }}
      />

      {/* Buying Token Input */}
      <TokenInputDropdown
        label="To Buy"
        tokenListLoading={tokenListLoading}
        selectedToken={buyCurrency}
        modalType="buy"
        setModalType={setModalType}
        setModalOpen={setModalOpen}
      
     
      />

      {/* Rate and Expiry Section */}
      <DayOrderSection
        rate="191.530483704"
        currency="USDC"
        approxValue="$191.54"
        onUseMarketClick={handleUseMarketClick}
      />


<PriceRangeSection/>
      {/* Action Button */}
      <button
        disabled={!sellAmount}
        onClick={executeJupiterSwap}
        className="w-full  !mt-4 !mb-2  px-4 py-4 text-primary rounded-xl font-bold text-lg bg-primary/10  border-cyan-400 border border-transparent  hover:border-cyan-400border  hover:border-cyan-400"
      >
        {connected ? "Swap" : "Connect Wallet"}
      </button>

      {/* DCA Summary */}
      <LimitOrderSummary
        headerText="DCA Summary"

        linkText="Learn more"
        linkUrl="#"
        orderDetails={dcaDetails}
      />
    </div>
  );
};

export default DCAComponent;
