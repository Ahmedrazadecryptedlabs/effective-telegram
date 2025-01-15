import React, { useState } from "react";
import PriceRangeDropdown from "./pricerangedropdown";
import DatePickerComponent from "./DateSection";

interface RateExpirySectionProps {
  rate: string; // The rate value for RateCard
  currency: string; // The currency symbol for RateCard
  approxValue: string; // Approx value for RateCard
  onUseMarketClick?: () => void; // Optional click handler for RateCard
}

const Orderdate: React.FC<RateExpirySectionProps> = ({
  rate,
  currency,
  approxValue,
  onUseMarketClick,
}) => {
  // State for managing selected option in ReusableDropdown
  const [selectedOption, setSelectedOption] = useState("hour");
  const [inputValue, setInputValue] = useState("1");
  const [orderCount, setOrderCount] = useState("2");
  return (
    <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-2 h-full py-1">
      <div className="w-full sm:flex-[2_2_40%]">
        <PriceRangeDropdown
          label="Every"
          options={["day", "hour", "day", "week", "month"]}
          selectedOption={selectedOption}
          onSelect={setSelectedOption}
          inputValue={inputValue}
          onInputChange={setInputValue}
          showInfoIcon={false} // Show the Info icon

        />
      </div>

      <div className="w-full sm:flex-[2_2_80%]">
    
      <DatePickerComponent
  label="Select Date"
  onDateChange={(date) => console.log("Selected Date:", date)}
/>



      </div>
    </div>
  );
};

export default Orderdate;

