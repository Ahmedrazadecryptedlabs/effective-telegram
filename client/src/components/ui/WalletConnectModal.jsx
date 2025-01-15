import React from 'react';
import { X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose
} from '@/components/ui/sheet';

export default function WalletConnectModal({ isOpen, onClose }) {
  const wallets = [
    {
      name: 'Solflare',
      icon: '☀️',
      className: 'bg-orange-600/10'
    },
    {
      name: 'Google via TipLink',
      icon: 'G',
      className: 'bg-blue-600/10'
    },
    {
      name: 'Phantom',
      icon: '👻',
      className: 'bg-purple-600/10'
    },
    {
      name: 'Coinbase Wallet',
      icon: 'C',
      className: 'bg-blue-600/10'
    },
    {
      name: 'Trust',
      icon: '🛡️',
      className: 'bg-blue-600/10'
    },
    {
      name: 'Ledger',
      icon: 'L',
      className: 'bg-slate-600/10'
    },
    {
      name: 'Trezor',
      icon: 'T',
      className: 'bg-slate-600/10'
    },
    {
      name: 'WalletConnect',
      icon: 'W',
      className: 'bg-blue-500/10'
    },
    {
      name: 'Ethereum Wallet',
      icon: 'Ξ',
      className: 'bg-blue-600/10'
    },
    {
      name: 'Coin98',
      icon: '98',
      className: 'bg-yellow-600/10'
    },
    {
      name: 'Magic Eden',
      icon: 'M',
      className: 'bg-purple-600/10'
    },
    {
      name: 'Backpack',
      icon: '🎒',
      className: 'bg-red-600/10'
    },
    {
      name: 'Bitget Wallet',
      icon: 'B',
      className: 'bg-blue-600/10'
    },
    {
      name: 'Frontier',
      icon: 'F',
      className: 'bg-orange-600/10'
    }
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] bg-[#1C2A3A] border-l border-gray-800 p-0">
        <SheetHeader className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-xl font-bold text-white">
                Connect Wallet
              </SheetTitle>
              <p className="text-sm text-gray-400 mt-1">
                You need to connect to a Solana wallet.
              </p>
            </div>
            <SheetClose className="rounded-full p-2 hover:bg-gray-700">
              <X className="h-4 w-4 text-gray-400" />
            </SheetClose>
          </div>
        </SheetHeader>

        <div className="p-6">
          <h3 className="text-sm font-medium text-gray-400 mb-4">Wallets</h3>
          <div className="grid grid-cols-2 gap-3">
            {wallets.map((wallet) => (
              <button
                key={wallet.name}
                className={`flex items-center gap-3 p-3 rounded-lg ${wallet.className} hover:bg-gray-700/50 transition-colors`}
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800">
                  <span className="text-lg">{wallet.icon}</span>
                </div>
                <span className="text-sm font-medium text-white">
                  {wallet.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
