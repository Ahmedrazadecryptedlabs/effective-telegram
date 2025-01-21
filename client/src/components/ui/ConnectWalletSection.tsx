import { Ban, RotateCw } from "lucide-react";
import React, { useState } from "react";
import WalletModal from "./WalletConnectModal";
import { useWallet } from "@solana/wallet-adapter-react";

interface ConnectWalletSectionProps {
  tabs: { id: string; label: string }[]; // Array of tab objects with id and label
  defaultActiveTab?: string; // Default active tab
  showCancelAll?: boolean; // Whether to show the "Cancel All" button section
  headerTop?: boolean; // Whether to show the top header section
}

/**
 * Define the WalletOption interface to fix the "Cannot find name 'WalletOption'" error.
 * @see https://www.typescriptlang.org/docs/handbook/interfaces.html
 */
interface WalletOption {
  name: string;
  id: string;
  icon: string;
}

const ConnectWalletSection: React.FC<ConnectWalletSectionProps> = ({
  tabs = [],
  defaultActiveTab = tabs[0]?.id || "",
  showCancelAll = true,
  headerTop = false,
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);
  const [isClient, setIsClient] = useState(false);
  const { connected, publicKey, connect } = useWallet();
  const [isWalletModalOpen, setWalletModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  React.useEffect(() => {
    if (tabs.length > 0) {
      setActiveTab(defaultActiveTab);
    }
  }, [defaultActiveTab, tabs]);

  if (!tabs.length) {
    return <p className="text-gray-400">No tabs available</p>;
  }

  const wallets: WalletOption[] = [
    { name: "Phantom", id: "phantom", icon: "/images/phantom.svg" },
    { name: "Solflare", id: "solflare", icon: "/images/solflare.svg" },
    { name: "Google via TipLink", id: "tiplink", icon: "/images/tiplink.svg" },
    { name: "Coinbase Wallet", id: "coinbase", icon: "/images/coinbase.svg" },
    { name: "Trust", id: "trust", icon: "/images/trust.svg" },
    { name: "Ledger", id: "ledger", icon: "/images/ledger.svg" },
    { name: "Trezor", id: "trezor", icon: "/images/trezor.svg" },
    {
      name: "WalletConnect",
      id: "walletconnect",
      icon: "/images/walletconnect.svg",
    },
    { name: "Ethereum Wallet", id: "ethereum", icon: "/images/ethereum.svg" },
    { name: "Coin98", id: "coin98", icon: "/images/coin98.svg" },
    { name: "Magic Eden", id: "magiceden", icon: "/images/magiceden.svg" },
    { name: "Backpack", id: "backpack", icon: "/images/backpack.png" },
    { name: "Bitget Wallet", id: "bitget", icon: "/images/bitget.png" },
    { name: "Frontier", id: "frontier", icon: "/images/frontier.svg" },
  ];

  const handleConnect = async (walletId: string) => {
    try {
      setConnectingWallet(walletId);
      setConnectionError(null);
      await connect();
      setWalletModalOpen(false);
    } catch (error) {
      console.error(`Failed to connect to ${walletId}:`, error);
      setConnectionError(`Failed to connect to ${walletId}. Please try again.`);
    } finally {
      setConnectingWallet(null);
    }
  };

  return (
    <div className="my-4">
      {/* Top Section: Tabs and Buttons */}
      {headerTop && (
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
              className="group flex items-center justify-center rounded-lg border border-white/10 px-3 sm:px-[12px] py-3 hover:border-primary"
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
      )}

      {/* Bottom Section */}
      <div className="flex h-[200px] w-full flex-col items-center justify-center space-y-2 rounded-lg border border-v2-lily/5 mt-3">
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-2">View History</p>
          <button
            onClick={() => setWalletModalOpen(true)}
            className="border border-transparent px-5 sm:px-6 py-2 text-primary bg-primary/10 text-black rounded-lg font-bold shadow-md transition-all duration-300 hover:border-cyan-400"
          >
            Connect Wallet
          </button>
        </div>
      </div>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        wallets={wallets}  
        handleConnect={handleConnect}
      />
    </div>
  );
};

export default ConnectWalletSection;