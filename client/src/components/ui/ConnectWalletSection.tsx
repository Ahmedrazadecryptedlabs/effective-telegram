import { Ban, RotateCw } from "lucide-react";
import React, { useState } from "react";

interface ConnectWalletSectionProps {
  tabs: { id: string; label: string }[]; // Array of tab objects with id and label
  defaultActiveTab?: string; // Default active tab
  showCancelAll?: boolean; // Whether to show the "Cancel All" button section
}

const ConnectWalletSection: React.FC<ConnectWalletSectionProps> = ({
  tabs,
  defaultActiveTab = "openOrders",
  showCancelAll = true,
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  return (
    <div className="my-4">
      {/* Top Section: Tabs and Buttons */}
      <div className="flex flex-wrap items-center justify-between rounded-lg w-full my-2">
        {/* Left Tab Navigation */}
        <div className="flex space-x-2 sm:space-x-3 items-center mb-2 sm:mb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-xs font-bold px-3 py-2 sm:px-4 sm:py-2 rounded-full ${
                activeTab === tab.id
                  ? "bg-primary/10 border border-cyan-400 text-primary"
                  : "text-gray-500 hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Buttons */}
          <div className="flex space-x-2 mt-2 sm:mt-0">
            {/* "C" Button */}
        
            <button
              className="group flex items-center justify-center rounded-lg border border-white/10 px-3 sm:px-[12px] py-3  hover:border-primary"
            >
              <RotateCw
                className="text-white/50 transition-colors duration-200 group-hover:text-primary"
                size={10}
              />
            </button>

           {showCancelAll && ( 
            <button
              className="group flex items-center space-x-1 sm:space-x-2 text-sm font-bold px-2 sm:px-3 py-2 rounded-lg text-gray-500 border border-gray-600 hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
            >
              <Ban
                size={12}
                className="text-gray-500 transition-colors duration-200 group-hover:text-primary"
              />
              <span className="text-xxs sm:text-xs">Cancel All</span>
            </button>
            )}
          </div>
        
      </div>

      {/* Bottom Section */}
      <div className="flex h-[200px] w-full flex-col items-center justify-center space-y-2 rounded-lg border border-v2-lily/5 mt-3">
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-2">View History</p>
          <button className="border border-transparent px-5 sm:px-6 py-2 text-primary bg-primary/10 text-black rounded-lg font-bold shadow-md transition-all duration-300 hover:border-cyan-400">
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectWalletSection;