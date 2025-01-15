import React from "react";
import Skeleton from "react-loading-skeleton";
import { ChevronDown } from "lucide-react";

interface TokenInputDropdownProps {
  label: string;
  tokenListLoading: boolean;
  selectedToken: {
    logoURI?: string;
    symbol?: string;
  } | null;
  modalType: "sell" | "buy";
  setModalType: (type: "sell" | "buy") => void;
  setModalOpen: (open: boolean) => void;
}

const TokenInputDropdown: React.FC<TokenInputDropdownProps> = ({
  label,
  tokenListLoading,
  selectedToken,
  modalType,
  setModalType,
  setModalOpen,
}) => {
  return (
    <div className="flex items-end bg-[#131B24] rounded-xl px-4 py-4 gap-4 border-none focus-within:ring-2 focus-within:ring-cyan-400">
      {/* Token Selector */}
      <div className="flex-1">
        <label className="block text-sm mb-4 font-semibold text-gray-200">
          {label}
        </label>
        {tokenListLoading ? (
          <Skeleton height={40} width={150} baseColor="#374151" />
        ) : (
          <button
            className="flex w-full text-white rounded-lg py-4  items-center justify-between"
            onClick={() => {
              setModalType(modalType);
              setModalOpen(true);
            }}
          >
           <div className="flex items-center" >
            <img
              src={selectedToken?.logoURI || "/icons/coins/default.png"}
              alt={selectedToken?.symbol || "Unknown"}
              className="w-4 h-4 rounded-full"
            />
            <span className="text-sm font-bold text-white mx-2">
              {selectedToken?.symbol || "Select Token"}
            </span>
            </div>
            <ChevronDown className="text-gray-400 w-4 h-4 font-bold" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TokenInputDropdown;
