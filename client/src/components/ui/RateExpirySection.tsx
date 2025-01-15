import React, { useState } from "react";
import RateCard from "./RateCard";
import ReusableDropdown from "./ExpiryDropdown";

interface RateExpirySectionProps {
  rate: string; // The rate value for RateCard
  currency: string; // The currency symbol for RateCard
  approxValue: string; // Approx value for RateCard
  onUseMarketClick?: () => void; // Optional click handler for RateCard
}

const RateExpirySection: React.FC<RateExpirySectionProps> = ({
  rate,
  currency,
  approxValue,
  onUseMarketClick,
}) => {
  // State for managing selected option in ReusableDropdown
  const [selectedEveryOption, setSelectedEveryOption] = useState("minute");

  return (
    <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-2 h-full py-1">
      {/* Rate Card Section */}
      <div className="w-full sm:flex-[3_3_60%]">
        <RateCard
          rate={rate}
          currency={currency}
          approxValue={approxValue}
          onUseMarketClick={onUseMarketClick}
        />
      </div>

      {/* Expiry Dropdown Section */}
      <div className="w-full sm:flex-[2_2_30%]">
        <ReusableDropdown
          label="Expiry"
          options={[
            "Never",
            "10 Min",
            "1 Hour",
            "1 Day",
            "3 Days",
            "7 Days",
            "Custom",
          ]}
          selectedOption={selectedEveryOption}
          onSelect={(option) => setSelectedEveryOption(option)}
        />
      </div>
    </div>
  );
};

export default RateExpirySection;
