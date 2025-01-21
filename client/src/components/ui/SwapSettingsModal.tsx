import React, { useState } from "react";
import { Info, ChevronDown, ChevronUp } from "lucide-react";

interface SwapSettingsModalProps {
  selectedMode: "Auto" | "Manual";
  handleModeChange: (mode: "Auto" | "Manual") => void;
  onClose: () => void;
}

const SwapSettingsModal: React.FC<SwapSettingsModalProps> = ({
  selectedMode,
  handleModeChange,
  onClose,
}) => {
  const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = useState(false);

  /**
   * Fix: expand activeTab's type so it can hold "Enable", "Disable", "Dynamic", *and* "Fixed".
   * This way, we can re-use the same state variable for both "Enable/Disable" and "Dynamic/Fixed".
   */
  const [activeTab, setActiveTab] = useState<"Enable" | "Disable" | "Dynamic" | "Fixed">("Disable");

  const [activeBroadcastMode, setActiveBroadcastMode] = useState<
    "Priority Fee" | "Jito Only" | "Both"
  >("Both");

  const [activeFeeMode, setActiveFeeMode] = useState<"Max Cap" | "Exact Fee">("Exact Fee");
  const [slippageValue, setSlippageValue] = useState<number>(2);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [exactFee, setExactFee] = useState<number>(0.004);
  const [isUseWSolEnabled, setIsUseWSolEnabled] = useState(false);
  const [isAMMExclusionEnabled, setIsAMMExclusionEnabled] = useState(false);

  const toggleUseWSol = () => {
    setIsUseWSolEnabled(!isUseWSolEnabled);
  };

  const toggleAMMExclusion = () => {
    setIsAMMExclusionEnabled(!isAMMExclusionEnabled);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
      <div className="bg-[#222B33] rounded-lg shadow-lg p-6 w-[80%] md:w-[460px] border-2 border-gray-600">
        {/* Header with Auto/Manual Tabs */}
        <div className="flex justify-between items-center mb-2 bg-[#222B33]">
          <h2 className="text-white text-xl font-semibold">Swap Settings</h2>
          <div className="flex gap-2 bg-[#18222D] rounded-full py-1 px-1">
            <button
              className={`px-4 py-1 text-sm font-bold rounded-full ${
                selectedMode === "Auto" ? "bg-cyan-900 text-white" : "text-gray-400"
              }`}
              onClick={() => handleModeChange("Auto")}
            >
              Auto
            </button>
            <button
              className={`px-4 py-1 text-sm font-bold rounded-full ${
                selectedMode === "Manual" ? "bg-cyan-900 text-white" : "text-gray-400"
              }`}
              onClick={() => handleModeChange("Manual")}
            >
              Manual
            </button>
          </div>
        </div>

        {/* Modal Content */}
        {selectedMode === "Auto" ? (
          <div className="text-xs text-gray-400">
            <p className="mb-4 font-medium">
              Jupiter will help you to configure transaction fee and slippage
              settings based on your trade, heuristics, and market conditions.
            </p>
            <div className="space-y-4">
              <div className="text-sm text-gray-400">
                {/* Slippage Mode Section */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-white font-medium">Slippage Mode</h3>
                    <p>Set slippage based on simulation and heuristics.</p>
                  </div>
                  <button className="px-3 py-1 bg-secondary text-primary rounded-full font-bold border-4 border-[#1B1B1E]">
                    Dynamic
                  </button>
                </div>

                {/* Transaction Fees Section */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-white font-medium">Transaction Fees</h3>
                    <p>Set max cap based on trade size.</p>
                  </div>
                  <button className="px-3 py-1 bg-secondary text-primary rounded-full font-bold border-4 border-[#1B1B1E]">
                    Dynamic
                  </button>
                </div>

                {/* Jito Only Section */}
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-medium">Jito Only</h3>
                    <p className="text-xs">
                      Avoid sandwiching or being frontrun. Comes with higher gas
                      fees and lower tx success rates.
                    </p>
                  </div>
                  <div className="flex gap-2 bg-[#1B1B1E] rounded-full">
                    <button
                      className={`px-3 py-1 font-medium rounded-full border-4 border-[#1B1B1E] ${
                        activeTab === "Enable"
                          ? "bg-cyan-500 text-[#0d1117]"
                          : "text-cyan-500"
                      }`}
                      onClick={() => setActiveTab("Enable")}
                    >
                      Enable
                    </button>
                    <button
                      className={`px-3 py-1 font-medium rounded-full border-4 border-[#1B1B1E] ${
                        activeTab === "Disable"
                          ? "bg-cyan-500 text-[#0d1117]"
                          : "text-cyan-500"
                      }`}
                      onClick={() => setActiveTab("Disable")}
                    >
                      Disable
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-400">
            <p className="mb-4">
              You have full control over your own transaction fee and slippage
              settings, please use carefully.
            </p>
            <div className="space-y-4">
              {/* Slippage Mode Section */}
              <div className="space-y-4">
                <h3 className="text-white font-bold text-lg mt-4">Slippage</h3>
                <div className="border-b border-gray-700 pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-gray-400 font-medium">
                        <span className="flex items-center">
                          <Info size={12} className="mr-2" />
                          Slippage Mode
                        </span>
                      </h3>
                    </div>
                    <div className="flex gap-2 bg-[#1B1B1E] rounded-full">
                      <button
                        className={`px-3 py-1 font-medium rounded-full border-4 border-[#1B1B1E] ${
                          activeTab === "Dynamic"
                            ? "bg-cyan-500 text-[#0d1117]"
                            : "text-cyan-500"
                        }`}
                        onClick={() => setActiveTab("Dynamic")}
                      >
                        Dynamic
                      </button>
                      <button
                        className={`px-3 py-1 font-medium rounded-full border-4 border-[#1B1B1E] ${
                          activeTab === "Fixed"
                            ? "bg-cyan-500 text-[#0d1117]"
                            : "text-cyan-500"
                        }`}
                        onClick={() => setActiveTab("Fixed")}
                      >
                        Fixed
                      </button>
                    </div>
                  </div>

                  {/* Max Slippage Section */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Info size={14} />
                      <span className="font-medium">Max Slippage</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#1B1B1E] px-4 py-1 rounded-lg text-white">
                      <input
                        type="number"
                        value={slippageValue}
                        onChange={(e) =>
                          setSlippageValue(parseFloat(e.target.value))
                        }
                        className="bg-transparent border-none w-24 text-right outline-none text-white"
                      />
                      <span>%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Broadcasting Section */}
              <div className="space-y-4">
                <h3 className="text-white font-bold text-lg mt-4">
                  Transaction Broadcasting
                </h3>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-gray-400 font-medium">
                        <span className="flex items-center">
                          <Info size={12} className="mr-2" />
                          Broadcast Mode
                        </span>
                      </h3>
                    </div>
                    <div className="flex gap-2 bg-[#1B1B1E] rounded-full">
                      {["Priority Fee", "Jito Only", "Both"].map((mode) => (
                        <button
                          key={mode}
                          className={`px-2 py-1 font-medium rounded-full text-sm border-4 border-[#1B1B1E] ${
                            activeBroadcastMode === mode
                              ? "bg-cyan-500 text-[#0d1117]"
                              : "text-cyan-500"
                          }`}
                          onClick={() => setActiveBroadcastMode(mode as typeof activeBroadcastMode)}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fee Mode Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-gray-400 font-medium">
                        <span className="flex items-center">
                          <Info size={12} className="mr-2" />
                          Fee Mode
                        </span>
                      </h3>
                    </div>
                    <div className="flex gap-2 bg-[#1B1B1E] rounded-full">
                      {["Max Cap", "Exact Fee"].map((mode) => (
                        <button
                          key={mode}
                          className={`px-3 py-1 font-medium rounded-full border-4 border-[#1B1B1E] ${
                            activeFeeMode === mode
                              ? "bg-cyan-500 text-[#0d1117]"
                              : "text-cyan-500"
                          }`}
                          onClick={() => setActiveFeeMode(mode as typeof activeFeeMode)}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Exact Fee Section */}
                <div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Info size={14} />
                      <span className="font-medium">Exact Fee</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#1B1B1E] px-4 py-1 rounded-lg text-white">
                      <input
                        type="number"
                        value={exactFee}
                        onChange={(e) => setExactFee(parseFloat(e.target.value))}
                        className="bg-transparent border-none w-36 text-right outline-none text-white"
                      />
                      <span>SOL</span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs mt-1 text-right">~$0.77</p>
                </div>
              </div>

              {/* Advanced Settings Section */}
              <div className="space-y-4">
                <div
                  className="flex justify-between items-center cursor-pointer border-b border-gray-700 pb-2"
                  onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                >
                  <h3 className="text-white font-bold text-lg">Advanced Settings</h3>
                  {isAdvancedOpen ? (
                    <ChevronUp size={16} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-400" />
                  )}
                </div>

                {isAdvancedOpen && (
                  <div className="space-y-3">
                    {/* Use wSOL */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Info size={14} />
                        <span className="font-medium">Use wSOL</span>
                      </div>
                      <div
                        className={`relative w-10 h-5 flex items-center rounded-full cursor-pointer ${
                          isUseWSolEnabled ? "bg-cyan-500" : "bg-gray-700"
                        }`}
                        onClick={toggleUseWSol}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                            isUseWSolEnabled ? "translate-x-5" : "translate-x-1"
                          }`}
                        ></div>
                      </div>
                    </div>

                    {/* AMM Exclusion */}
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Info size={14} />
                          <span className="font-medium">AMM Exclusion</span>
                        </div>
                        <p className="text-xs text-gray-500">No amms are being excluded.</p>
                      </div>
                      <div
                        className={`relative w-10 h-5 flex items-center rounded-full cursor-pointer ${
                          isAMMExclusionEnabled ? "bg-cyan-500" : "bg-gray-700"
                        }`}
                        onClick={toggleAMMExclusion}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                            isAMMExclusionEnabled ? "translate-x-5" : "translate-x-1"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <button
          className="mt-6 w-full py-4 bg-cyan-400 text-white font-semibold text-md rounded-2xl"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SwapSettingsModal;