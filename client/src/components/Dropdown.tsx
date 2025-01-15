import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode; // Optional: Allows including an icon
}

interface DropdownProps {
  options: DropdownOption[];
  selectedOption: DropdownOption;
  onOptionSelect: (option: DropdownOption) => void;
  placeholder?: string; // Optional placeholder
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedOption,
  onOptionSelect,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: DropdownOption) => {
    onOptionSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-2/4	 text-sm">
      {/* Selected Option */}
      <div
        className={`flex items-center justify-between bg-[#1A1E24] text-white rounded-md px-4 py-2 cursor-pointer ${
          isOpen ? "ring-2 ring-cyan-400" : ""
        }`}
        onClick={toggleDropdown}
      >
        {selectedOption ? (
          <div className="flex items-center gap-2">
            {selectedOption.icon}
            <span className="font-semibold">{selectedOption.label}</span>
          </div>
        ) : (
          <span className="text-gray-400">{placeholder || "Select an option"}</span>
        )}
        <ChevronDown className="text-white" size={14} />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute mt-1 bg-[#1A1E24] rounded-md shadow-lg w-full z-20">
          <ul className="py-1">
            {options.map((option) => (
              <li
                key={option.value}
                className={`flex items-center px-4 py-2 hover:bg-[#2A2F36] gap-2 ${
                  selectedOption?.value === option.value
                    ? "text-cyan-400"
                    : "text-white"
                }`}
                onClick={() => handleOptionClick(option)}
              >
                {option.icon}
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
