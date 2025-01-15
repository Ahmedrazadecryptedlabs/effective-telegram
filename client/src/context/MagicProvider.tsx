import { OAuthExtension } from '@magic-ext/oauth';
import { Magic as MagicBase } from 'magic-sdk';
import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { SolanaExtension } from '@magic-ext/solana';
import { Connection } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { MAGIC_API_KEY, NEXT_PUBLIC_SOLANA_NETWORK } from '../constants';

export type Magic = MagicBase<OAuthExtension[] & SolanaExtension[]>;

export const getNetworkUrl = () => {
    switch (NEXT_PUBLIC_SOLANA_NETWORK) {
        case WalletAdapterNetwork.Devnet:
            return 'https://solana-devnet.g.alchemy.com/v2/2aUvl36AwoIdzsS64jsHiO9QE5t8Ftyh';
        case WalletAdapterNetwork.Mainnet:
            // return 'https://solana-mainnet.g.alchemy.com/v2/2aUvl36AwoIdzsS64jsHiO9QE5t8Ftyh';
            return 'https://newest-solemn-dream.solana-mainnet.quiknode.pro/59b7a3cd20aab7912b885cf0bbbd833179121442';
        default:
            throw new Error('Network not supported');
    }
};

export const getNetworkName = () => {
    switch (NEXT_PUBLIC_SOLANA_NETWORK) {
        case WalletAdapterNetwork.Devnet:
            return 'Solana (Devnet)';
        case WalletAdapterNetwork.Mainnet:
            return 'Solana (Mainnet Beta)';
    }
};

export const getBlockExplorer = (address: string) => {
    switch (NEXT_PUBLIC_SOLANA_NETWORK) {
        case WalletAdapterNetwork.Devnet:
            return `https://explorer.solana.com/address/${address}?cluster=devnet`;
        case WalletAdapterNetwork.Mainnet:
            return `https://explorer.solana.com/address/${address}`;
    }
};

type MagicContextType = {
    magic: Magic | null;
    connection: Connection | null;
};

const MagicContext = createContext<MagicContextType>({
    magic: null,
    connection: null,
});

export const useMagic = () => useContext(MagicContext);

const MagicProvider = ({ children }: { children: ReactNode }) => {
    const [magic, setMagic] = useState<Magic | null>(null);
    const [connection, setConnection] = useState<Connection | null>(null);

    useEffect(() => {
        if (MAGIC_API_KEY) {
            const magic = new MagicBase(MAGIC_API_KEY, {
                extensions: [
                    new OAuthExtension(),
                    new SolanaExtension({
                        rpcUrl: getNetworkUrl(),
                    }),
                ],
            });
            const connection = new Connection(getNetworkUrl());
            setMagic(magic);
            setConnection(connection);
        }
    }, []);

    const value = useMemo(() => {
        return {
            magic,
            connection,
        };
    }, [magic, connection]);

    return <MagicContext.Provider value={value}>{children}</MagicContext.Provider>;
};

export default MagicProvider;
