import React from "react";
import { Info } from "lucide-react";

interface InputInfoBoxProps {
  label: string; // Label like "Over"
  info?: boolean; // Whether to show the info icon
  inputValue: string | number; // The input value
  onInputChange: (value: string | number) => void; // Callback for input change
  staticText: string; // The static text like "orders"
}

const InputInfoBox: React.FC<InputInfoBoxProps> = ({
  label,
  info = false,
  inputValue,
  onInputChange,
  staticText,
}) => {
  return (
    <div className="relative w-full bg-[#131B24] text-white px-4 h-20 rounded-lg shadow-md flex flex-col  justify-center">
      {/* Label with optional Info icon */}
      <div className="flex items-center ">
        <span className="text-xs text-gray-400">{label}</span>
        {info && <Info className="text-gray-400 ml-1" size={14} />}
      </div>

      {/* Input and Static Text */}
      <div className="flex items-center justify-between mt-1">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          className="bg-transparent text-lg font-bold text-white focus:outline-none w-1/4"
        />
        <span className="text-sm font-bold">{staticText}</span>
      </div>
    </div>
  );
};

export default InputInfoBox;
