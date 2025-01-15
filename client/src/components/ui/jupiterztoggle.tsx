import React, { useState } from "react";
import { Info } from "lucide-react";

const JupiterZToggle: React.FC = () => {
  const [isJupiterZEnabled, setIsJupiterZEnabled] = useState<boolean>(false);

  const handleToggle = () => {
    setIsJupiterZEnabled(!isJupiterZEnabled);
  };

  return (
    <div>
      {/* Tooltip for JupiterZ Toggle */}
      {isJupiterZEnabled && (
        <div className="mt-3 p-3 border border-v2-lily/10 bg-white-5 rounded-md text-xs shadow-lg text-white-75">
          <p className="text-xs">
            Swaps using JupiterZ are gasless and have 0% slippage.
          </p>
          <p className="text-warning-75 text-xs">
            Double-check your prices and note that not all pairs are available.
          </p>
        </div>
      )}

      {/* Toggle Section */}
      <div className="flex items-center gap-3 my-4 relative">
        {/* Info Icon with Tooltip */}
        <div className="relative group">
          <Info className="text-gray-400 cursor-pointer" size={14} />
          <div
            className="absolute bottom-full -left-24 mb-2 w-96 p-3 bg-black text-gray-300 text-xs rounded-xl shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          >
            Enable JupiterZ to enjoy gasless and 0% slippage swaps, available on
            certain pairs.
          </div>
        </div>

        <span className="text-gray-400 text-xs">Jupiterz Only</span>

        {/* Toggle Button */}
        <div
          className={`relative w-9 h-5 flex items-center rounded-full cursor-pointer transition-all duration-300 ${
            isJupiterZEnabled ? "bg-cyan-500" : "bg-slate-950"
          }`}
          onClick={handleToggle}
        >
          <div
            className={`w-4 h-4 bg-[#5A5A5A] rounded-full shadow-md transform transition-transform duration-300 ${
              isJupiterZEnabled ? "translate-x-5" : "translate-x-1"
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default JupiterZToggle;
