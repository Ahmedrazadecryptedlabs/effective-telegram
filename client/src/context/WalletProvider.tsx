"use client";

import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { clusterApiUrl } from "@solana/web3.js";

// Import wallet modal styles
import "@solana/wallet-adapter-react-ui/styles.css";

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const network = clusterApiUrl("devnet"); // Change to "mainnet-beta" for production

  // Configure Phantom wallet adapter
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={network}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};
