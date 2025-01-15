import React, { useState } from "react";
import { Info } from "lucide-react";

const PriceRangeSection = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col bg-[#131B24] rounded-lg px-4 py-4 my-4 w-full shadow-md focus-within:ring-[1.2px] focus-within:ring-cyan-400 focus-within:shadow-[0_0_8px_2px_rgba(34,211,238,0.5)]">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-3 relative">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400">Price Range (optional)</span>
          <Info
            size={14}
            className="text-gray-400 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
          {isHovered && (
            <div
              className="absolute left-0 top-[-40px] bg-black text-white text-xs p-2 rounded shadow-md w-[250px] pointer-events-none"
            >
              DCA will only be executed if the price falls within the range of your pricing strategy.
            </div>
          )}
        </div>
        <span className="text-xs text-v2-lily-50">
          Rate: <span className="text-xs  font-bold">0.005388  <span className="text-xxs">USDC / SOL</span></span>
        </span>
      </div>

      {/* Input Section */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Min Price"
          className="bg-[#18222D] text-gray-400 text-sm font-bold placeholder-gray-500 rounded-md py-[0.6rem] px-4 w-full focus:outline-none"
        />
        <span className="text-gray-400 font-bold">-</span>
        <input
          type="text"
          placeholder="Max Price"
          className="bg-[#18222D] text-gray-400 text-sm font-bold placeholder-gray-500 rounded-md py-[0.6rem] px-4 w-full focus:outline-none"
        />
      </div>
    </div>
  );
};

export default PriceRangeSection;
