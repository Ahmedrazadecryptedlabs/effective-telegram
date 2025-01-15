import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PublicKey } from '@solana/web3.js';
import { clusterApiUrl, Connection } from '@solana/web3.js';

export const NEXT_PUBLIC_SOLANA_NETWORK = 'mainnet-beta' as WalletAdapterNetwork;
export const NEXT_PUBLIC_SOLANA_CUSTOM_RPC =
    'https://falling-maximum-star.solana-mainnet.quiknode.pro/1cd1bbeb37e123d8aad7d47d4715772e4a66c03f';

// You can also provide a custom RPC endpoint.
// export const endpoint =  clusterApiUrl(NEXT_PUBLIC_SOLANA_NETWORK);
export const endpoint = NEXT_PUBLIC_SOLANA_CUSTOM_RPC;

export const APP_CONNECTION = new Connection(endpoint,"confirmed");
export const MAGIC_API_KEY = 'pk_live_30A055BCB39446A6';
export const DEFAULT_SELL_ADDRESS = 'So11111111111111111111111111111111111111112';
export const DEFAULT_BUY_ADDRESS = 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB';

//valid pool addresses seperated by ,
export const ALLOWED_POOL_IDS =
    '7XawhbbxtsRcQA8KTkHT9f9nc6d69UwqCDh6U5EEbEmX,HVNwzt7Pxfu76KHCMQPTLuTCLTm6WnQ1esLv4eizseSv,8vMrQrYEM5H5i6JKwntfSMbhZNtSgu2qBoM9cYqmFGE6,CbnU6a4gPqjrdQ5aNj6kufheDDRmrZ7apW1osaDPHQbY';

export const FEE_CONFIG = {
    feeAccountPublicKey: '9H3j5eoxYRpTxbA34WypTFgmisjKuGUtjDawdM1rPYWq', // your account which will be claiming fee tokens
    feeAccountReferralPublicKey: '3Fn9fXRqKW1o1pmXNovLwxvjSFdxxptEoZRSsJyjhtMi', // your account referral account

    platformFeeBps: 50, // 0.5% of output token will be collected as platform fee
    jupiterReferralProgram: 'REFER4ZgmyYx9c6He5XfaTMiGfdLwRnkV4RPp9t9iF3', //always kept same
};
