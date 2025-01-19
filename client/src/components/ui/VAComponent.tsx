import React from "react";
import TokenInputSection from "./TokenInputSection";
import SwapButton from "@/components/ui/SwapButton";
import LimitOrderSummary from "./LimitOrderSummary";
import TokenInputDropdown from "./TokenInputDropdown";
import PortfolioIncreaseInput from "./PortfolioIncreaseInput";
import AutoReceiveToggle from "./AutoReceiveToggle";
import Orderdate from "./OrderDate";

interface VAComponentProps {
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

const VAComponent: React.FC<VAComponentProps> = ({
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

  const vaDetails = [
    { label: "Max budget", value: "100 USDC" },
    { label: "To buy", value: "SOL" },
    { label: "To increase portfolio value by", value: "50 USD" },
    { label: "Every", value: "1 day" },
    { label: "Start date", value: "13, Jan 2025, 4:44 PM" },
    { label: "Platform fee", value: "0.1%" },
  ];

  return (
    <div className="space-y-[5px]">
      {/* Selling Token Input */}
      <TokenInputSection
        label="I Have A Max Budget Of"
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

      <PortfolioIncreaseInput />

      {/* Rate and Expiry Section */}
      <Orderdate
        rate="1.23456"
        currency="BTC"
        approxValue="$1234.56"
        onUseMarketClick={handleUseMarketClick}
      />

      <AutoReceiveToggle />
      {/* Action Button */}
      <button
        disabled={!sellAmount}
        onClick={executeJupiterSwap}
        className="w-full  !mt-4 !mb-2  px-4 py-4 text-primary rounded-xl font-bold text-lg bg-primary/10  border-cyan-400 border border-transparent  hover:border-cyan-400border  hover:border-cyan-400"
      >
        {connected ? "Swap" : "Connect Wallet"}
      </button>

      {/* VA Summary */}
      <LimitOrderSummary
        headerText="VA Summary"
        linkText="Learn more"
        linkUrl="#"
        orderDetails={vaDetails}
      />
    </div>
  );
};

export default VAComponent;
