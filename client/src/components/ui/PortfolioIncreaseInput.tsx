import React, { useState } from "react";

const PortfolioIncreaseInput: React.FC = () => {
  const [value, setValue] = useState<number | string>(50);

  return (
    <div className="flex items-center justify-between bg-[#131B24] rounded-xl px-4 py-4 w-full shadow-md focus-within:ring-[1.2px] focus-within:ring-cyan-400 focus-within:shadow-[0_0_8px_2px_rgba(34,211,238,0.5)]">
      {/* Label Section */}
      <div className="flex flex-col w-full">
        <span className="text-xs text-gray-400 mb-3">To Increase Portfolio Value By</span>
        <div className="flex justify-between items-center w-full">
          {/* USD Label */}
          <div className="rounded-lg bg-[#1C2936] p-2 px-3 flex items-center justify-center">
            <span className="text-sm font-bold text-white">USD</span>
          </div>

          {/* Input Section */}
          <input
            type="number"
            placeholder="0"
            className="bg-transparent text-xl font-bold text-white text-right w-16 focus:outline-none"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default PortfolioIncreaseInput;
