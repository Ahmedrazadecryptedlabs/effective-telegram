"use client";

import React, { useEffect, useState } from "react";
import { Settings, Maximize2, SquareDot, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/Sheet";
import { Button } from "@/components/ui/button";
import SettingsModal from "./SettingsModal";

interface WalletOption {
  name: string;
  id: string;
  icon: string;
}

export default function TopNavigation() {
  const pathname = usePathname();
  const { connected, publicKey, connect } = useWallet();
  const [isClient, setIsClient] = useState(false);
  const [isWalletModalOpen, setWalletModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const activeTab = pathname.startsWith("/onboard") ? "Onboard" : "Spot";

  const wallets: WalletOption[] = [
    { name: "Solflare", id: "solflare", icon: "/wallet-icons/solflare.svg" },
    { name: "Google via TipLink", id: "tiplink", icon: "/wallet-icons/google.svg" },
    { name: "Phantom", id: "phantom", icon: "/wallet-icons/phantom.svg" },
    { name: "Coinbase Wallet", id: "coinbase", icon: "/wallet-icons/coinbase.svg" },
    { name: "Trust", id: "trust", icon: "/wallet-icons/trust.svg" },
    { name: "Ledger", id: "ledger", icon: "/wallet-icons/ledger.svg" },
    { name: "Trezor", id: "trezor", icon: "/wallet-icons/trezor.svg" },
    { name: "WalletConnect", id: "walletconnect", icon: "/wallet-icons/walletconnect.svg" },
    { name: "Ethereum Wallet", id: "ethereum", icon: "/wallet-icons/ethereum.svg" },
    { name: "Coin98", id: "coin98", icon: "/wallet-icons/coin98.svg" },
    { name: "Magic Eden", id: "magiceden", icon: "/wallet-icons/magiceden.svg" },
    { name: "Backpack", id: "backpack", icon: "/wallet-icons/backpack.svg" },
    { name: "Bitget Wallet", id: "bitget", icon: "/wallet-icons/bitget.svg" },
    { name: "Frontier", id: "frontier", icon: "/wallet-icons/frontier.svg" },
  ];

  const WalletOption: React.FC<WalletOption> = ({ icon, name, id }) => (
    <Button
      variant="outline"
      style={{padding: "1.9rem"}}
      className="flex items-center justify-start sm:w-full    bg-[#1C2A3A] !gap-0 border-none text-white"
      onClick={() => handleConnect(id)}
    >
      <img src={icon} alt={name} className="w-6 h-6 mr-3" />
      <span className="font-bold">{name}</span>
    </Button>
  );

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

  const shortenedPublicKey = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : "";

  return (
   <div className="flex items-center justify-between px-4 bg-[#131C25] w-full flex-nowrap">
  <div className="hidden sm:flex sm:flex-1"></div>

  <div className="flex gap-4 justify-center flex-grow sm:flex-grow-0">
    <Link href="/" passHref>
      <div
        className={`group flex items-center gap-2 px-10 py-5 cursor-pointer ${
          activeTab === "Spot"
            ? "bg-[rgba(199,242,130,0.05)] text-cyan-400 border-b-2 border-cyan-400"
            : "text-white"
        } `}
      >
        <div
          className={`w-5 h-5 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg ${
            activeTab === "Spot"
              ? "bg-[rgba(199,242,130,0.05)]"
              : "bg-[#1C2A3A]"
          } group-hover:text-primary`}
        >
          <Maximize2
            className={`w-3 sm:w-4 h-3 sm:h-4 ${
              activeTab === "Spot" ? "text-cyan-400" : "text-white"
            } group-hover:text-primary`}
          />
        </div>
        <span className="text-sm sm:text-base font-bold group-hover:text-primary">
          Spot
        </span>
      </div>
    </Link>

    <Link href="/onboard/onramp" passHref>
      <div
        className={`group flex items-center gap-2 px-10 py-5 cursor-pointer ${
          activeTab === "Onboard"
            ? "bg-[rgba(199,242,130,0.05)] text-cyan-400 border-b-2 border-cyan-400"
            : "text-white"
        } `}
      >
        <div
          className={`w-5 h-5 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg ${
            activeTab === "Onboard"
              ? "bg-[rgba(199,242,130,0.05)]"
              : "bg-[#1C2A3A]"
          } group-hover:text-primary`}
        >
          <SquareDot
            className={`w-3 sm:w-4 h-3 sm:h-4 ${
              activeTab === "Onboard" ? "text-cyan-400" : "text-white"
            } group-hover:text-primary`}
          />
        </div>
        <span className="text-sm sm:text-base font-bold group-hover:text-primary">
          Onboard
        </span>
      </div>
    </Link>
  </div>

  <div className="flex items-center gap-3 justify-end flex-none sm:flex-1">
    <div
      onClick={() => setSettingsModalOpen(true)}
      className="w-8 h-8 sm:w-8 sm:h-8 flex items-center justify-center bg-[#1C2A3A] rounded-full hover:bg-gray-600 hover:border border-primary group"
    >
      <Settings className="text-white w-4 h-4 font-extrabold group-hover:text-primary" />
    </div>

    {isClient && (
      <Sheet open={isWalletModalOpen} onOpenChange={setWalletModalOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="bg-[#1C2A3A] border-none hover:bg-[#2C3A4A] text-white rounded-3xl"
          >
            <span className="bg-gradient-to-r from-cyan-400 to-lime-400 bg-clip-text text-transparent font-bold">
              {connected ? shortenedPublicKey : "Connect Wallet"}
            </span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[480px] bg-[#283747] border-l border-gray-800"
        >
          <div className="flex justify-between sm:items-center text-start mb-4">
            <SheetHeader className="text-white">
              <SheetTitle className="text-white text-2xl font-bold">
                Connect Wallet
              </SheetTitle>
              <p className="text-gray-400 text-sm">
                You need to connect to a Solana wallet.
              </p>
              <h2 className="text-sm font-bold"> Wallets</h2>
            </SheetHeader>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 pr-4 max-h-[calc(100vh-120px)] overflow-y-auto">
            {wallets.map((wallet) => (
              <WalletOption
                key={wallet.id}
                icon={wallet.icon}
                name={wallet.name}
                id={wallet.id}
              />
            ))}
          </div>
        </SheetContent>
      </Sheet>
    )}
  </div>

  {isSettingsModalOpen && (
    <SettingsModal
      isOpen={isSettingsModalOpen}
      onClose={() => setSettingsModalOpen(false)}
    />
  )}
</div>

  );
}