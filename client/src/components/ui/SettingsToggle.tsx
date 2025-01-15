import React, { useState } from "react";
import { Settings, RefreshCcw, RotateCcw } from "lucide-react";
import SwapSettingsModal from "./SwapSettingsModal";

const SettingsToggle: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<"Auto" | "Manual">("Auto");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModeChange = (mode: "Auto" | "Manual") => {
    setSelectedMode(mode);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="flex items-center justify-between rounded-xl">
      {/* Auto / Manual Toggle */}
      <div className="flex  rounded-full py-1 px-1 bg-[#18222D]">
        <button
          className={`px-3  py-1 text-xs font-bold rounded-xl ${
            selectedMode === "Auto" ? "bg-primary/10 text-cyan-400" : "text-gray-400"
          }`}
          onClick={() => handleModeChange("Auto")}
        >
          Auto
        </button>
        <button
          className={`px-3  py-1 text-xs font-bold rounded-xl ${
            selectedMode === "Manual" ? "bg-primary/10 text-cyan-400" : "text-gray-400"
          }`}
          onClick={() => handleModeChange("Manual")}
        >
          Manual
        </button>
      </div>

      {/* Settings Icon and Text */}
      <div className="flex items-center text-xs text-gray-400 ml-2">
        <button className="p-2  mx-1  rounded-full bg-[#18222D]" onClick={toggleModal}>
          <Settings size={13} className="text-v2-lily\/50" />
        </button>
        <span className="ml-1 text-xxs">
          {selectedMode === "Auto" ? "Jito Only: Off" : "Fixed: 0.5%, Jito Only: Off"}
        </span>
      </div>

      {/* Refresh Icon */}
      <div className="ml-auto flex items-center">
  <button
    className="
      group 
      p-2 
      rounded-full 
      bg-[#18222D] 
      border 
      border-transparent 
      hover:border-cyan-400 
      hover:bg-[#334155]
    "
  >
    <RotateCcw
      size={15}
      className="
        text-white 
        stroke-[0.3]               
        group-hover:stroke-2    
        group-hover:text-cyan-400 
        transition-all
      "
    />
  </button>
</div>



      {/* Modal */}
      {isModalOpen && (
        <SwapSettingsModal
          onClose={toggleModal}
          selectedMode={selectedMode}
          handleModeChange={handleModeChange}
        />
      )}
    </div>
  );
};

export default SettingsToggle;
