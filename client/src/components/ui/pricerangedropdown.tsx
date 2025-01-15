import React, { useState } from "react";
import { ChevronDown, Info } from "lucide-react";

interface DropdownProps {
  label: string; // Label to show above the dropdown
  options: string[]; // Dropdown options
  selectedOption: string; // Currently selected option
  onSelect: (option: string) => void; // Callback for when an option is selected
  inputValue?: string; // Input value for the number field
  onInputChange?: (value: string) => void; // Callback for when the input value changes
  isTextOnly?: boolean; // Whether to show text instead of dropdown
  dynamicText?: string; // Dynamic text to display when isTextOnly is true
  tooltipText?: string; // Text to show in the hover tooltip
  showInfoIcon?: boolean; // Whether to show the Info icon
}

const PriceRangeDropdown: React.FC<DropdownProps> = ({
  label,
  options,
  selectedOption,
  onSelect,
  inputValue = "1", // Default input value
  onInputChange,
  isTextOnly = false, // Default to false
  dynamicText = "", // Default dynamic text
  tooltipText = "Default tooltip text", // Default tooltip text
  showInfoIcon = true, // Default to true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // Track hover state for Info icon

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (option: string) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* Dropdown Header */}
      <div
        className={`flex items-center justify-between bg-[#131B24] text-white px-4 h-20 rounded-lg shadow-md ${
          !isTextOnly ? "cursor-pointer" : ""
        } ${isOpen ? "ring-2 ring-cyan-400" : ""}`}
        onClick={!isTextOnly ? toggleDropdown : undefined}
      >
        <div className="flex flex-col w-full">
          <span className="text-xs flex text-gray-400 mb-1 items-center">
            {label}
            {showInfoIcon && (
              <Info
                className="w-3 h-3 mx-1 cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              />
            )}
          </span>
          <div className="flex items-center justify-between mt-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange?.(e.target.value)}
              className="bg-transparent text-sm font-bold text-white focus:outline-none w-1/3"
              disabled={isTextOnly} // Disable input in text-only mode
            />
            <div className="flex items-center">
              {isTextOnly ? (
                <span className="text-sm font-bold">
                  {dynamicText || selectedOption}
                </span>
              ) : (
                <>
                  <span className="text-sm font-bold">{selectedOption}</span>
                  <ChevronDown className="text-gray-400 ml-1" size={16} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {showInfoIcon && isHovered && (
        <div className="absolute left-0 top-[-40px] bg-gray-700 text-white text-xs p-2 rounded shadow-md w-[250px]">
          {tooltipText}
        </div>
      )}

      {/* Dropdown Options */}
      {!isTextOnly && isOpen && (
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

export default PriceRangeDropdown;
