// PoolCard.tsx
import React, { useEffect } from 'react';
import { Mint, PoolData, RaydiumSwapCompute } from '../types';
import { useWallet } from '@solana/wallet-adapter-react'; // Import wallet hook
import { createJupiterApiClient, QuoteResponse, SwapResponse } from '@jup-ag/api';
import {
    Connection,
    PublicKey,
    sendAndConfirmTransaction,
    Transaction,
    VersionedMessage,
    VersionedTransaction,
} from '@solana/web3.js';
import { APP_CONNECTION, FEE_CONFIG } from '../constants';
import { useMagic } from '../context/MagicProvider';
import axios from 'axios';
import { API_URLS } from '@raydium-io/raydium-sdk-v2';
import { getPlatformFeeAccounts } from '@jup-ag/core';
import { SystemProgram } from '@solana/web3.js';
import SpinnerWithStyles from './Spinner';
import showToast from '../utils/showToast';
const jupiterQuoteApi = createJupiterApiClient();

interface PoolCardProps {
    pool: PoolData;
    ind: number;
}

const PoolCard: React.FC<PoolCardProps> = ({ pool, ind }) => {
    const [FROM_TOKEN, set_FROM_TOKEN] = React.useState<Mint>(pool.mintA);
    const [TO_TOKEN, set_TO_TOKEN] = React.useState<Mint>(pool.mintB);

    // const FROM_TOKEN = pool.mintB;
    // const TO_TOKEN = pool.mintA;

    const { magic, connection: MAGIC_APP_CONNECTION } = useMagic();
    const { publicKey: connectedWalletPK, sendTransaction, signTransaction } = useWallet(); // Get connected wallet
    const [quote, setQuote] = React.useState<string | null>(null);
    const [quoteLoading, setQouteLoading] = React.useState<boolean>(false);
    const [loadingSwap, setLoadingSwap] = React.useState<boolean>(false);
    const [loadingMagicSwap, setLoadingMagicSwap] = React.useState<boolean>(false);
    const [inputAmount, setInputAmount] = React.useState<number | undefined>(0.0001);

    const getJupiterQuote = async (fromToken: Mint, toToken: Mint): Promise<QuoteResponse | null> => {
        if (!inputAmount || inputAmount == 0) {
            console.error('Please enter valid amount');
            return null;
        }
        try {
            setQouteLoading(true);
            const amount = inputAmount * 10 ** fromToken.decimals;

            const data: QuoteResponse = await jupiterQuoteApi.quoteGet({
                inputMint: fromToken.address,
                outputMint: toToken.address,
                amount: amount, // Example amount
                slippageBps: 2500,
                swapMode: 'ExactIn',
                platformFeeBps: FEE_CONFIG.platformFeeBps,
            });
            console.log('🚀 ~ getJupiterQuote ~ data:', data);

            if (data) {
                setQuote(`Quote: ${parseFloat(data.outAmount) / 10 ** toToken.decimals} ${toToken.symbol}`);
            } else {
                setQuote('No quote available.');
            }
            return data;
        } catch (error) {
            console.error('Error fetching Jupiter quote:', JSON.parse(JSON.stringify(error)));
            setQuote('Failed to fetch quote.');
            return null;
        } finally {
            setQouteLoading(false);
        }
    };

    const executeJupiterSwap = async () => {
        if (!connectedWalletPK || !signTransaction || !sendTransaction) {
            showToast({ message: 'Please connect your wallet.', type: 'error' });
            return;
        }

        try {
            setLoadingSwap(true);

            // Get the Jupiter quote
            const quoteResponse = await getJupiterQuote(FROM_TOKEN, TO_TOKEN);
            if (!quoteResponse) throw new Error('Could not get quote from Jupiter');

            const blockhash = await APP_CONNECTION.getLatestBlockhash('confirmed');

            if (!blockhash) {
                throw new Error('Error getting latest block');
            }
            console.log('🚀 ~ executeJupiterSwap ~ blockhash:', blockhash);

            // Set up referral and fee accounts as before
            const referralAccountPubkey = new PublicKey(FEE_CONFIG.feeAccountReferralPublicKey);
            const mint = new PublicKey(TO_TOKEN.address);
            const [feeAccount] = PublicKey.findProgramAddressSync(
                [Buffer.from('referral_ata'), referralAccountPubkey.toBuffer(), mint.toBuffer()],
                new PublicKey(FEE_CONFIG.jupiterReferralProgram)
            );

            // Prepare the Jupiter swap request with the correct fee account
            const swapObj: SwapResponse = await jupiterQuoteApi.swapPost({
                swapRequest: {
                    quoteResponse: quoteResponse,
                    userPublicKey: connectedWalletPK.toBase58(),
                    wrapAndUnwrapSol: true, // Auto wrap and unwrap SOL if necessary
                    dynamicComputeUnitLimit: true, // Dynamically adjust compute units
                    prioritizationFeeLamports: 'auto', // Optionally set prioritization fees
                    feeAccount: feeAccount.toBase58(), // Pass the created ATA as the fee account
                },
            });

            // Deserialize the transaction and sign with the wallet
            const transactionFromSwap = VersionedTransaction.deserialize(
                Buffer.from(swapObj.swapTransaction, 'base64')
            );

            if (!transactionFromSwap || !signTransaction) throw new Error('Transaction Error');
            transactionFromSwap.message.recentBlockhash = blockhash.blockhash;

            // Sign the VersionedTransaction
            const signedTransaction = await signTransaction(transactionFromSwap);
            if (!signedTransaction) throw new Error('Transaction signing failed');
            const RAW_TX = signedTransaction.serialize();

            // Send the signed VersionedTransaction
            const signature = await APP_CONNECTION.sendRawTransaction(RAW_TX);

            showToast({ message: `Swap Transaction Sent, Please wait to confirm`, type: 'info' });
            console.log(`Transaction sent: https://solana.fm/tx/${signature}`);

            // Wait for confirmation with a custom timeout or retries
            const confirmation = await APP_CONNECTION.confirmTransaction(signature, 'confirmed');
            showToast({ message: `Swap Success, transaction signature: ${signature}`, type: 'success' });
            console.log('Transaction confirmed:', confirmation);
        } catch (error: any) {
            console.error('Error executing Jupiter swap:', error);
            if (error.message?.includes('User rejected the request.')) {
                showToast({ message: 'User Rejected Transaction', type: 'error' });
            } else showToast({ message: error.message, type: 'error' });
        } finally {
            setLoadingSwap(false);
        }
    };

    const executeJupiterSwapMagicLink = async () => {
        try {
            setLoadingMagicSwap(true);
            if (!magic || !MAGIC_APP_CONNECTION) throw new Error('Magic Wallet not found');
            let magicPublicAddress: string | null = null;
            const isLoggedIn = await magic.user.isLoggedIn();
            if (isLoggedIn) {
                try {
                    const metadata = await magic.user.getInfo();
                    if (metadata) {
                        magicPublicAddress = metadata.publicAddress!;
                    }
                } catch (err) {}
            }

            if (!magicPublicAddress) {
                throw new Error('Please connect your magic wallet.');
            }

            const quoteResponse = await getJupiterQuote(FROM_TOKEN, TO_TOKEN);
            if (!quoteResponse) throw new Error('Could not get quote from');

            const blockhash = await MAGIC_APP_CONNECTION.getLatestBlockhash('confirmed');
            console.log('🚀 ~ executeJupiterSwapMagicLink ~ blockhash:', blockhash);
            if (!blockhash) {
                throw new Error('Error getting latest block');
            }

            const referralAccountPubkey = new PublicKey(FEE_CONFIG.feeAccountReferralPublicKey); // Jup referral account public key || WORKING
            const mint = new PublicKey(TO_TOKEN.address);

            const [feeAccount] = PublicKey.findProgramAddressSync(
                [Buffer.from('referral_ata'), referralAccountPubkey.toBuffer(), mint.toBuffer()],
                new PublicKey(FEE_CONFIG.jupiterReferralProgram)
            );

            const magicWalletPulickKey = new PublicKey(magicPublicAddress);
            const swapObj: SwapResponse = await jupiterQuoteApi.swapPost({
                swapRequest: {
                    quoteResponse: quoteResponse,
                    userPublicKey: magicWalletPulickKey.toBase58(),
                    wrapAndUnwrapSol: true, // Auto wrap and unwrap SOL if necessary
                    dynamicComputeUnitLimit: true, // Dynamically adjust compute units
                    prioritizationFeeLamports: 'auto', // Optionally set prioritization fees
                    feeAccount: feeAccount.toBase58(), // Pass the created ATA as the fee account
                },
            });
            console.log('🚀 ~ executeJupiterSwapMagicLink ~ swapObj:', swapObj);

            // Deserialize versioned transaction from SwapResponse
            const transactionFromSwap = VersionedTransaction.deserialize(
                Buffer.from(swapObj.swapTransaction, 'base64')
            );

            // Ensure fee payer and blockhash are set correctly
            transactionFromSwap.message.recentBlockhash = blockhash.blockhash;
            // transactionFromSwap.message.feePayer = magicWalletPulickKey;

            // Sign the transaction with Magic or your connected wallet
            const signedTransaction = await magic.solana.signTransaction(transactionFromSwap, {
                requireAllSignatures: false,
                verifySignatures: true,
            });
            if (!signedTransaction) throw new Error('Could not sign transaction');

            // Reconstruct the transaction from the raw signed transaction
            const RAW_TX = Buffer.from(Buffer.from(signedTransaction.rawTransaction).toString('base64'), 'base64');
            const signature = await MAGIC_APP_CONNECTION.sendRawTransaction(RAW_TX);

            showToast({ message: `Magic Swap Transaction Sent, Please wait to confirm`, type: 'info' });
            console.log(`Transaction sent: https://solana.fm/tx/${signature}`);

            // Wait for confirmation with a custom timeout or retries
            const confirmation = await APP_CONNECTION.confirmTransaction(signature, 'confirmed');
            showToast({ message: `Magic Swap Success, Wait to be mined ${signature}`, type: 'success' });
            console.log('Transaction confirmed:', confirmation);
        } catch (error: any) {
            console.error('Error executing magic Jupiter swap:', error);
            console.error('Error executing Jupiter swap:', error);
            if (error.message && error.message.includes('User rejected the request.')) {
                showToast({ message: 'User Rejected Transaction', type: 'error' });
            } else showToast({ message: error.message, type: 'error' });
        } finally {
            setLoadingMagicSwap(false);
        }
    };

    const toggleTokens = () => {
        set_FROM_TOKEN(TO_TOKEN);
        set_TO_TOKEN(FROM_TOKEN);
    };

    return (
        <div
            className="pool-card"
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
            <div style={{ marginBottom: '20px' }}>
                <h3>
                    ({ind}) {FROM_TOKEN.symbol} / {TO_TOKEN.symbol}
                </h3>
                <p>Price: $ {pool.price}</p>
                <label>Pool</label>
                <p>{pool.id}</p>
                <label>From</label>
                <p>
                    [ {FROM_TOKEN.symbol} ]: {FROM_TOKEN.address}
                </p>
                <button
                    onClick={toggleTokens}
                    style={{
                        padding: '10px 10px',
                        margin: '10px',
                        backgroundColor: '#703FD9',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Switch Tokens
                </button>
                <br />
                <label>To</label>
                <p>
                    [ {TO_TOKEN.symbol} ]: {TO_TOKEN.address}
                </p>

                <label>From Amount</label>
                <input
                    type="number"
                    value={inputAmount}
                    onChange={(e) => setInputAmount(parseFloat(e.target.value))}
                    style={{ padding: '10px', margin: '10px 10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <div style={{ marginBottom: '10px' }}>
                    <button
                        onClick={() => getJupiterQuote(FROM_TOKEN, TO_TOKEN)}
                        disabled={quoteLoading || !inputAmount}
                        style={{
                            padding: '10px 20px',
                            margin: '10px',
                            backgroundColor: '#703FD9',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        {quoteLoading ? 'Loading...' : `Get 1 ${FROM_TOKEN.symbol} Quote`}
                    </button>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                        <button
                            onClick={executeJupiterSwap}
                            disabled={loadingSwap || !inputAmount}
                            style={{
                                padding: '10px 20px',
                                margin: '0 10px',
                                border: '2px solid #8255DD',
                                color: '#8255DD',
                                borderRadius: '5px',
                                backgroundColor: 'transparent',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {loadingSwap ? 'Loading...' : 'Swap'} {loadingSwap && <SpinnerWithStyles />}
                        </button>
                        <button
                            onClick={executeJupiterSwapMagicLink}
                            disabled={loadingMagicSwap || !inputAmount}
                            style={{
                                padding: '10px 20px',
                                margin: '0 10px',
                                border: '2px solid #8255DD',
                                color: '#8255DD',
                                borderRadius: '5px',
                                backgroundColor: 'transparent',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {loadingMagicSwap ? 'Loading...' : 'Magic Swap'} {loadingMagicSwap && <SpinnerWithStyles />}
                        </button>
                    </div>
                </div>
                {quoteLoading ? <SpinnerWithStyles /> : quote && <p>{quote}</p>}
            </div>

            <div style={{ marginLeft: '20px' }}>
                <iframe
                    id={pool.id}
                    title={`${FROM_TOKEN.symbol} / ${TO_TOKEN.symbol}`}
                    width="500"
                    height="300"
                    src={`https://www.dextools.io/widget-chart/en/solana/pe-light/${pool.id}?theme=dark&chartType=1&chartResolution=30&drawingToolbars=false`}
                    style={{ border: 'none', borderRadius: '10px' }}
                ></iframe>
            </div>
        </div>
    );
};

export default PoolCard;
