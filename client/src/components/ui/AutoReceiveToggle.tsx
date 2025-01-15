import React, { useState } from "react";

const AutoReceiveToggle: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<"Auto" | "Manually">("Auto");

  return (
    <div className="flex items-center justify-between  rounded-lg   w-full ">
      {/* Label */}
      <span className="text-xs text-gray-400">
        Auto receive $SOL after every buy
      </span>

      {/* Toggle Section */}
      <div className="flex items-center gap-2 bg-[#131B24] rounded-lg p-[3px]">
  <button
    className={`px-[27px] py-[0.4rem] rounded-md font-bold text-xs transition-all duration-200 ${
      selectedOption === "Auto"
        ? "bg-[#1F2D3A] text-cyan-400"
        : "bg-transparent text-gray-400"
    }`}
    onClick={() => setSelectedOption("Auto")}
  >
    Auto
  </button>
  <button
    className={`px-4 py-[0.4rem] rounded-md font-bold text-xs transition-all duration-200 ${
      selectedOption === "Manually"
        ? "bg-[#1F2D3A] text-cyan-400"
        : "bg-transparent text-gray-400"
    }`}
    onClick={() => setSelectedOption("Manually")}
  >
    Manually
  </button>
</div>

    </div>
  );
};

export default AutoReceiveToggle;
