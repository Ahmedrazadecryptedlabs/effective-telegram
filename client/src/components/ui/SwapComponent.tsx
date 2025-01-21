"use-client"

import React, { useState } from "react";
import TokenInputSection from "./TokenInputSection";
import SwapButton from "@/components/ui/SwapButton";
import JupiterZToggle from "@/components/ui/jupiterztoggle";
import SettingsToggle from "@/components/ui/SettingsToggle";
import { ReusableButton } from "./connect_wallet_btn";
import WalletModal from "./WalletConnectModal";
import { useWallet } from "@solana/wallet-adapter-react";

/**
 * 1. Define the missing WalletOption interface so TypeScript knows the shape of each wallet.
 */
interface WalletOption {
  name: string;
  id: string;
  icon: string;
}

interface SwapComponentProps {
  tokenListLoading: boolean;
  sellCurrency: any;
  setSellCurrency: (token: any) => void;
  buyCurrency: any;
  setBuyCurrency: (token: any) => void;
  sellAmount: number | undefined;
  setSellAmount: (amount: number | undefined) => void;
  buyAmount: number | undefined;
  quoteLoading: boolean;
  modalType: "sell" | "buy";
  setModalType: (type: "sell" | "buy") => void;
  setModalOpen: (open: boolean) => void;
  connected: boolean;
  executeJupiterSwap: () => void;
  loadingSwap: boolean;
}

const SwapComponent: React.FC<SwapComponentProps> = ({
  tokenListLoading,
  sellCurrency,
  setSellCurrency,
  buyCurrency,
  setBuyCurrency,
  sellAmount,
  setSellAmount,
  buyAmount,
  quoteLoading,
  modalType,
  setModalType,
  setModalOpen,
  connected,
  executeJupiterSwap,
  loadingSwap,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { publicKey, connect } = useWallet();
  const [isWalletModalOpen, setWalletModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const handleOpenModal = () => {
    setWalletModalOpen(true);
  };

  /**
   * 2. Use the new WalletOption interface:
   */
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
    <div className="space-y-2">
      <SettingsToggle />
      <TokenInputSection
        label="You're Selling"
        tokenListLoading={tokenListLoading}
        selectedToken={sellCurrency}
        amount={sellAmount}
        onAmountChange={setSellAmount}
        onSelectToken={setSellCurrency}
        quoteLoading={quoteLoading}
        modalType="sell"
        setModalType={setModalType}
        setModalOpen={setModalOpen}
        showAmountSpan={false} // Explicitly false
      />
      <SwapButton
        onSwap={() => {
          const tempCurrency = sellCurrency;
          setSellCurrency(buyCurrency);
          setBuyCurrency(tempCurrency);
          setSellAmount(buyAmount);
        }}
      />
      <TokenInputSection
        label="You're Buying"
        tokenListLoading={tokenListLoading}
        selectedToken={buyCurrency}
        amount={buyAmount}
        onSelectToken={setBuyCurrency}
        onAmountChange={() => {}}
        modalType="buy"
        setModalType={setModalType}
        setModalOpen={setModalOpen}
        quoteLoading={quoteLoading}
        showAmountSpan={false} // Explicitly false
        backgroundColorClass="bg-[#19232D]" // or any other custom Tailwind class
      />
      <JupiterZToggle />
      <ReusableButton
        text={connected ? "Swap" : "Connect Wallet"}
        onClick={handleOpenModal}
        marginTop="mt-4" // Optional margin top if needed
      />
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        wallets={wallets}
        handleConnect={handleConnect}
      />
      {/* Modal component */}
    </div>
  );
};

export default SwapComponent;