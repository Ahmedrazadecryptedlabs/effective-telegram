import React from "react";
import Skeleton from "react-loading-skeleton";
import { ChevronDown, Wallet } from "lucide-react";

interface TokenInputSectionProps {
  label: string;
  tokenListLoading: boolean;
  selectedToken: {
    logoURI?: string;
    symbol?: string;
  } | null;
  amount: number | undefined;
  onAmountChange: (amount: number | undefined) => void;
  onSelectToken: (token: any) => void;
  quoteLoading: boolean;
  placeholder?: string;
  modalType: "sell" | "buy";
  setModalType: (type: "sell" | "buy") => void;
  setModalOpen: (open: boolean) => void;
  showAmountSpan?: boolean;
  showWalletInfo?: boolean;

  /**
   * A Tailwind class (e.g., "bg-[#131B24]" or "bg-red-500").
   * If not provided, "bg-[#131B24]" will be used by default.
   */
  backgroundColorClass?: string;
}

const TokenInputSection: React.FC<TokenInputSectionProps> = ({
  label,
  tokenListLoading,
  selectedToken,
  amount,
  onAmountChange,
  onSelectToken,
  quoteLoading,
  placeholder = "0.00",
  modalType,
  setModalType,
  setModalOpen,
  showAmountSpan = false,
  backgroundColorClass,
  showWalletInfo = false,
}) => {
  const bgClass = backgroundColorClass || "bg-[#131B24]";

  return (
    <div
      className={`flex flex-col ${bgClass} min-h-[123px] rounded-xl p-4 space-y-3 border-none transition duration-300 ease-in-out focus-within:ring-[0.7px] focus-within:ring-cyan-400 focus-within:shadow-[0_0_8px_2px_rgba(34,211,238,0.4)]`}
    >
      {/* Token Selector */}
      <div className="mb-2 flex justify-between">
        <label className="block text-sm font-semibold text-gray-200">
          {label}
        </label>
        {showWalletInfo && selectedToken?.symbol && (
          <div className="flex items-center">
            <Wallet className="text-v2-lily-50 stroke-[0.7]" size={12} />
            <span className="text-xs text-v2-lily-50">
              <span className="mx-[3px]">{"0"}</span>
              {selectedToken.symbol}
            </span>
          </div>
        )}
      </div>

      {/* Amount Input */}
      <div className="flex flex-1 items-center space-x-2">
        {/* Token Button */}
        <div className="flex items-center pb-2">
          {tokenListLoading ? (
            <Skeleton height={40} width={150} baseColor="#374151" />
          ) : (
            <button
              className="focus-within:ring-[1.2px] focus-within:ring-cyan-400 hover:shadow-[0_0_8px_2px_rgba(34,211,238,0.5)] group flex w-full space-x-3 bg-[#1C2936] text-white rounded-xl p-2 items-center justify-center transition duration-300 ease-in-out border border-transparent hover:border-cyan-400 hover:bg-primary/15"
              style={{ minWidth: "120px" }}
              onClick={() => {
                setModalType(modalType);
                setModalOpen(true);
              }}
            >
              <img
                src={selectedToken?.logoURI || "/icons/coins/default.png"}
                alt={selectedToken?.symbol || "Unknown"}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm font-bold text-white mx-2">
                {selectedToken?.symbol || "Select Token"}
              </span>
              <ChevronDown className="w-6 text-white-25 font-bold transition-colors duration-300 group-hover:text-cyan-400" />
            </button>
          )}
        </div>

        {/* Input Field */}
        <div className="flex-1 flex flex-col justify-end">
          {quoteLoading ? (
            <div
              style={{width: "300px" }}
              className="text-right"
            >
              {/* Skeleton for input */}
              <Skeleton height={30} width="50%" baseColor="#374151" />

              {/* Skeleton for the span below, if visible */}
              {showAmountSpan && (
                <Skeleton
                  height={12}
                  width="50px"
                  baseColor="#374151"
                  style={{ marginTop: "6px" }}
                />
              )}
            </div>
          ) : (
            <>
              <input
                type="number"
                placeholder={placeholder}
                className="bg-transparent text-xl font-bold text-white placeholder-gray-600 focus:outline-none text-right w-full leading-none"
                value={amount !== undefined ? amount : ""}
                onChange={(e) =>
                  onAmountChange(Number(e.target.value) || undefined)
                }
              />
              {showAmountSpan && amount != null && amount > 0 && (
                <span
                  className="text-xs text-v2-lily-50 mt-[8px] text-right"
                  style={{ lineHeight: "0" }}
                >
                  ${amount}
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenInputSection;
