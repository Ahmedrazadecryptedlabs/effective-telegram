import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownProps {
  label: string; // Label to show above the dropdown
  options: string[]; // Dropdown options
  selectedOption: string; // Currently selected option
  onSelect: (option: string) => void; // Callback for when an option is selected
}

const ReusableDropdown: React.FC<DropdownProps> = ({
  label,
  options,
  selectedOption,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (option: string) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full ">
      {/* Dropdown Header */}

      <div
        className={`flex items-center justify-between bg-[#131B24]  text-white px-4 h-[90px] rounded-lg shadow-md cursor-pointer ${
          isOpen ? "ring-2 ring-cyan-400" : ""
        }`}
        onClick={toggleDropdown}
      >
        <div className=" items-end justify-between w-full">
          <div className="flex  justify-between  ">
            <span className="text-xs text-gray-400">{label}</span>
          </div>

          {/* Arrow Icon */}
          <div className="flex items-center justify-between my-2">
            <span className="text-sm font-bold">{selectedOption}</span>
            <ChevronDown className="text-gray-400" size={16} />
          </div>
        </div>
        {/* Expiry Label and Selected Option (Column) */}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 mt-2 bg-[#1A1E24] rounded-lg shadow-lg w-full">
          <ul className="text-white text-sm">
            {options.map((option) => (
              <li
                key={option}
                className={`px-4 py-2 hover:bg-[#2A2F36] ${
                  selectedOption === option ? "text-cyan-400" : ""
                }`}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReusableDropdown;
