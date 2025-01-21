"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/Sheet";

/**
 * Here is the minimal type adjustment:
 *
 * 1. The `WalletOptionProps` interface is now just the shape of each wallet item
 *    **without** `handleConnect`.
 * 2. We keep `handleConnect` as a separate prop in `WalletModalProps`.
 */

/* Each wallet in the array: */
interface WalletOptionProps {
  name: string;
  id: string;
  icon: string;
}

/* Full modal props: arrays of wallet items + a connect function. */
interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallets: WalletOptionProps[];
  handleConnect: (walletId: string) => void;
}

/* Props for the individual WalletOption component:
   We'll pass handleConnect separately. */
interface WalletOptionComponentProps extends WalletOptionProps {
  handleConnect: (walletId: string) => void;
}

const WalletOption: React.FC<WalletOptionComponentProps> = ({
  icon,
  name,
  id,
  handleConnect,
}) => (
  <div
    className="relative flex h-[70px] items-center justify-start gap-4 rounded-lg bg-[#1C2936] p-4 text-sm shadow-md md:text-base border-none hover:bg-[#22303C] overflow-hidden"
    onClick={() => handleConnect(id)}
  >
    <img
      src={icon}
      alt={name}
      className="w-8 h-8 object-contain flex-shrink-0"
    />
    <span
      className="font-semibold text-white truncate"
      style={{ maxWidth: "calc(100% - 48px)" }} // Prevents text overflow by limiting width
    >
      {name}
    </span>
  </div>
);

const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  wallets,
  handleConnect,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[550px] bg-[#283747] border-l border-gray-800 px-4"
      >
        <div className="flex flex-col justify-start sm:items-start text-start">
          <SheetHeader className="text-white !space-y-0 flex flex-col sm:items-start">
            <SheetTitle className="text-white text-2xl font-bold">
              Connect Wallet
            </SheetTitle>
            <p className="text-gray-400 text-sm">
              You need to connect to a Solana wallet.
            </p>
          </SheetHeader>
          <h2 className="text-sm font-bold mt-4 text-white">Wallets</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4 max-h-[calc(100vh-120px)] overflow-y-auto px-2">
          {wallets.map((wallet) => (
            <WalletOption
              key={wallet.id}
              icon={wallet.icon}
              name={wallet.name}
              id={wallet.id}
              handleConnect={handleConnect}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default WalletModal;