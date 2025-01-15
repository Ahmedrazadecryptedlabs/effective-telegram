import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface LimitOrderSummaryProps {
  headerText: string;
  infoText?: string; // Optional: Info text
  linkText?: string; // Optional: Link text
  linkUrl?: string; // Optional: Link URL
  orderDetails: { label: string; value: string }[]; // Details to display
}

const   LimitOrderSummary: React.FC<LimitOrderSummaryProps> = ({
  headerText,
  infoText,
  linkText = "Learn more",
  linkUrl = "#",
  orderDetails,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSummary = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="text-white rounded-lg w-full max-w-lg mx-auto">
      {/* Optional Informational Text and Link */}
      {infoText && (
        <div className="bg-white-5 px-3 py-3 border border-gray-600 w-full rounded-lg mb-4">
          <p className="text-xs text-gray-400">
            {infoText}{" "}
            {linkText && (
              <a
                href={linkUrl}
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {linkText}
              </a>
            )}
          </p>
        </div>
      )}

      {/* Collapsible Section Header */}
      <div
        className={`flex items-center justify-center cursor-pointer ${
          isOpen ? "text-primary" : "text-gray-400"
        }`}
        onClick={toggleSummary}
      >
        {isOpen ? (
          <ChevronUp className="mx-2" size={14} />
        ) : (
          <ChevronDown className="mx-2" size={14} />
        )}
        <span className="text-xs text-gray-500">{headerText}</span>
      </div>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="w-full rounded-lg border border-gray-600 p-5 mt-1 text-xs">
          {orderDetails.map((detail, index) => (
            <div className="flex justify-between space-y-1" key={index}>
              <span className="text-v2-lily-50">{detail.label}</span>
              <span className="text-v2-lily-50">{detail.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LimitOrderSummary;
