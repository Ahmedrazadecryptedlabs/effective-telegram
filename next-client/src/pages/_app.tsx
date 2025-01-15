'use client';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import type { AppProps } from 'next/app';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import { BraveWalletAdapter } from '@solana/wallet-adapter-brave';
import {
    BitgetWalletAdapter,
    BitpieWalletAdapter,
    CloverWalletAdapter,
    Coin98WalletAdapter,
    CoinbaseWalletAdapter,
    CoinhubWalletAdapter,
    LedgerWalletAdapter,
    MathWalletAdapter,
    PhantomWalletAdapter,
    SafePalWalletAdapter,
    SolflareWalletAdapter,
    SolongWalletAdapter,
    TokenPocketWalletAdapter,
    TorusWalletAdapter,
    TrustWalletAdapter,
    WalletConnectWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { endpoint, NEXT_PUBLIC_SOLANA_NETWORK } from '../constants';
import MagicProvider from '../context/MagicProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Use require instead of import since order matters
require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');

const App: FC<AppProps> = ({ Component, pageProps }) => {
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new TrustWalletAdapter(),
            ...(typeof window === 'undefined' ? [] : [new SolflareWalletAdapter()]),
            new TorusWalletAdapter(),
            new LedgerWalletAdapter(),
            new MathWalletAdapter({ endpoint }),
            new TokenPocketWalletAdapter(),
            new CoinbaseWalletAdapter({ endpoint }),
            new SolongWalletAdapter({ endpoint }),
            new Coin98WalletAdapter({ endpoint }),
            new SafePalWalletAdapter({ endpoint }),
            new BitpieWalletAdapter({ endpoint }),
            new BitgetWalletAdapter({ endpoint }),
            new CloverWalletAdapter(),
            new CoinhubWalletAdapter(),
            new BraveWalletAdapter(),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [NEXT_PUBLIC_SOLANA_NETWORK]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <MagicProvider>
                        <ToastContainer />
                        <Component {...pageProps} />
                    </MagicProvider>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

export default App;
