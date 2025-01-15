"use client";

import React, { useState } from "react";
import { Switch } from "@headlessui/react";
import { ChevronDown, Info } from "lucide-react";
import Dropdown from "../Dropdown";

export default function SettingsModal({ isOpen, onClose }) {
  const generalOptions = [
    { value: "xray", label: "XRAY" },
    { value: "solscan", label: "Solscan" },
    { value: "solana-beach", label: "Solana Beach" },
    { value: "solana-explorer", label: "Solana Explorer" },
    { value: "solana-fm", label: "SolanaFM" },
    { value: "oklink", label: "OKLink" },
  ];
  const languageOptions = [
    { value: "en", label: "English", icon: <span>🇬🇧</span> },
    { value: "cn", label: "中文", icon: <span>🇨🇳</span> },
    { value: "vn", label: "Tiếng Việt", icon: <span>🇻🇳</span> },
    { value: "jp", label: "日本語", icon: <span>🇯🇵</span> },
    { value: "id", label: "Bahasa Indonesia", icon: <span>🇮🇩</span> },
    { value: "kr", label: "한국어", icon: <span>🇰🇷</span> },
    { value: "es", label: "Español", icon: <span>🇪🇸</span> },
    { value: "fr", label: "Français", icon: <span>🇫🇷</span> },
    { value: "it", label: "Italiano", icon: <span>🇮🇹</span> },
    { value: "nl", label: "Nederlands", icon: <span>🇳🇱</span> },
    { value: "pt", label: "Português", icon: <span>🇵🇹</span> },
    { value: "tr", label: "Türkçe", icon: <span>🇹🇷</span> },
  ];

  const [versionedTransaction, setVersionedTransaction] = useState(true);
  const [selectedRpc, setSelectedRpc] = useState("Custom");
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[0]);
  const [selectedOption, setSelectedOption] = useState(generalOptions[0]);

  // Prevent click events inside the modal from propagating
  const handleModalClick = (e) => {
    e.stopPropagation();
  };
  const handleLanguageChange = (option) => {
    setSelectedLanguage(option);
  };
  const handleExplorerChange = (option) => {
    console.log("Selected Explorer:", option);
    setSelectedOption(option);
  };

  return (
    <div
      className={`fixed backdrop-blur-[1.2px] inset-0 z-50 flex justify-end items-start ${
        isOpen ? "block" : "hidden"
      }`}
      onClick={onClose} // Closes modal when clicking outside
    >
      {/* Modal */}
      <div
      style={{ border: "0.1em solid #394148" }}
        className="max-w-sm bg-[#1B2936]  mt-16 mx-4 text-white p-4 rounded-lg shadow-lg overflow-auto max-h-[90vh] w-[300px] overflow-y-auto  border border-v2-lily-10 bg-v3 px-5 py-6 text-v2-lily  lg:w-[420px]"
        onClick={handleModalClick} // Stops click event propagation
      >
        {/* Header */}
        <div className="text-xl font-bold mb-6">Settings</div>

        <div className="space-y-6">
          {/* Language Selector */}
          <div className="flex justify-between items-center">
            <div>
              <label className="text-sm font-medium text-white">Language</label>
            </div>
            <Dropdown
              options={languageOptions}
              selectedOption={selectedLanguage}
              onOptionSelect={handleLanguageChange}
              placeholder="Select Language"
            />
          </div>

          {/* Preferred Explorer */}
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-white">
              Preferred Explorer
            </label>
            <Dropdown
              options={generalOptions}
              selectedOption={selectedOption}
              onOptionSelect={handleExplorerChange}
              placeholder="Select Explorer"
            />
          </div>

          {/* Versioned Transaction */}
          <div
            style={{ borderBottom: "0.1em solid #394148" }}
            className="flex items-center justify-between pb-3"
          >
            <div className="text-sm flex items-center font-medium text-white">
              Versioned Transaction <Info className="ml-1" size={15} />
            </div>
            <div className="flex justify-end items-center">
              <Switch
                checked={versionedTransaction}
                onChange={setVersionedTransaction}
                className={`relative inline-flex items-center h-5 w-10 rounded-full ${
                  versionedTransaction ? "bg-cyan-500" : "bg-gray-700"
                }`}
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                    versionedTransaction ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </Switch>
            </div>
          </div>

          {/* RPC Endpoint */}
          <div>
            <p className="text-sm font-medium text-white">RPC Endpoint</p>
            <div>
              {[{ label: "Triton RPC Pool 1", latency: "1,545ms" }, { label: "Helius RPC 1", latency: "957ms" }, { label: "Triton RPC Pool 2", latency: "1,963ms" }, { label: "Custom", latency: "" }].map((rpc) => (
                <div
                  key={rpc.label}
                  className={`w-full flex items-center justify-between ${
                    selectedRpc === rpc.label ? "rounded-md py-2 px-2" : "py-2 cursor-pointer px-2"
                  }`}
                  onClick={() => setSelectedRpc(rpc.label)}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="rpc"
                      checked={selectedRpc === rpc.label}
                      readOnly
                      className="accent-cyan-500 w-4 h-4"
                    />
                    <span className="text-sm text-gray-400 font-semibold">
                      {rpc.label}
                    </span>
                  </div>

                  {/* Conditionally render red circle and latency */}
                  {rpc.label !== "Custom" && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span className="text-xs font-medium text-gray-400">
                        {rpc.latency}
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {/* Custom RPC Input */}
              <div className="relative flex items-center w-full">
                <input
                  type="text"
                  placeholder="Custom RPC URL"
                  className={`w-full bg-[#090C0E] border-primary rounded-lg px-3 py-3 text-sm pr-16 focus:border-none focus:outline-none focus:outline-primary ${
                    selectedRpc !== "Custom" ? "cursor-not-allowed" : ""
                  }`}
                  disabled={selectedRpc !== "Custom"}
                />
                <button
                  className="absolute right-2 bg-[#292A33] text-gray-500 px-3 py-1 rounded text-xs"
                  type="button"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
