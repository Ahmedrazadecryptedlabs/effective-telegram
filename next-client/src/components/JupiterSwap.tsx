'use client';
// JupiterSwap.tsx
import React, { useEffect, useState } from 'react';
import { PoolData } from '../types';
import { getPoolsInfo } from '../utils';
import PoolCard from './PoolCard'; // Import the PoolCard component
import styles from '../styles/Home.module.css';
import dynamic from 'next/dynamic';
import MagicLogin from './MagicLogin';
import MagicDashboard from './MagicDashboard';
import { useWallet } from '@solana/wallet-adapter-react';
import SpinnerWithStyles from './Spinner';
import { ALLOWED_POOL_IDS } from '../constants';

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);
// const WalletDisconnectButtonDynamic = dynamic(
//     async () => (await import('@solana/wallet-adapter-react-ui')).WalletDisconnectButton,
//     { ssr: false }
// );

const JupiterSwap = () => {
    const { publicKey: connecetdWallet, sendTransaction, signTransaction } = useWallet(); // Get connected wallet

    const [poolDataLoading, setPoolDataLoading] = useState<boolean>(false);
    const [poolData, setPoolData] = useState<PoolData[]>([]);

    const [magicToken, setMagicToken] = useState('');

    useEffect(() => {
        setMagicToken(localStorage.getItem('magic_token') ?? '');
    }, [setMagicToken]);

    useEffect(() => {
        (async () => {
            setPoolDataLoading(true);
            const response = await getPoolsInfo(ALLOWED_POOL_IDS);
            if (response.success) {
                console.log('🚀 ~ response.data:', response.data);
                setPoolData(response.data);
            }
            setPoolDataLoading(false);
        })();
    }, []);

    if (poolDataLoading) {
        return <SpinnerWithStyles />;
    }

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '20px',
                    backgroundColor: '#f4f4f4',
                    borderRadius: '10px',
                    margin: '20px auto',
                    width: '80%',
                }}
            >
                <div style={{ marginBottom: '20px' }}>
                    <WalletMultiButtonDynamic />
                </div>

                {magicToken.length > 0 ? (
                    <div style={{ marginTop: '20px', width: '100%' }}>
                        <MagicDashboard magicToken={magicToken} setMagicToken={setMagicToken} />
                    </div>
                ) : (
                    <div style={{ marginTop: '20px', width: '100%' }}>
                        <MagicLogin magicToken={magicToken} setMagicToken={setMagicToken} />
                    </div>
                )}
            </div>

            {ALLOWED_POOL_IDS.split(',').map((pool, ind) => (
                <p
                    key={ind}
                    style={{
                        display: 'flex',
                        // flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        padding: '20px',
                        border: '1px solid #ccc',
                        borderRadius: '10px',
                        width: '80%',
                        margin: '15px auto',
                        backgroundColor: '#f9f9f9',
                    }}
                >
                    ({ind + 1}) Pool: {pool}
                </p>
            ))}
            {poolData.map((pool, ind) => {
                if (pool !== null) {
                    return <PoolCard key={pool.id} pool={pool} ind={ind + 1} />;
                }
            })}
        </div>
    );
};

export default JupiterSwap;
