import React from "react";

interface RateCardProps {
  rate: string; // The rate value, e.g., "191.530483704"
  currency: string; // The currency symbol, e.g., "USDC"
  approxValue: string; // The approximate value, e.g., "$191.54"
  onUseMarketClick?: () => void; // Optional click handler for "Use Market"
}

const RateCard: React.FC<RateCardProps> = ({
  rate,
  currency,
  approxValue,
  onUseMarketClick,
}) => {
  return (
    <div    className="flex items-center justify-between bg-[#131B24] text-white px-4 h-[90px]  rounded-lg shadow-md w-full px:w-[230px] ">
      {/* Left Section */}
      <div className="flex flex-col mb-4">
        <span className="text-xs text-v2-lily-50">Buy SOL at rate</span>
        <span className="text-sm font-bold mt-1">{rate}</span>
      </div>

      {/* Right Section */}
      <div className="flex flex-col items-end justify-end">
        <span
          className="text-[9px] text-gray-400 underline cursor-pointer"
          onClick={onUseMarketClick}
        >
          Use Market
        </span>
        <div className="flex flex-col items-end mt-1 ">
          <span className="text-sm font-bold">{currency}</span>
          <span className="text-xs text-gray-400 ml-2">≈ {approxValue}</span>
        </div>
      </div>
    </div>
  );
};

export default RateCard;
