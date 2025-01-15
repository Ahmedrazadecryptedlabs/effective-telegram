import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";

const PRIVATE_KEY = ""; //past your account 6 private key to execute scripts that will claim fee tokens

export const JUPITER_PROJECT = new PublicKey(
  "45ruCyfdRkWpRNGEqWzjCiXRHkZs8WXCLQ67Pnpye7Hp" //kept constant
);

export const CONNECTTION = new Connection(
  "https://newest-solemn-dream.solana-mainnet.quiknode.pro/59b7a3cd20aab7912b885cf0bbbd833179121442"
);
export const KEY_PAIR = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));

export const sol = "So11111111111111111111111111111111111111112"; //sol token address
export const usdt = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"; //usdt token address
export const usdc = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; //usdc token address

//this is referral account for account 6
export const RERERRAL_PUBKEY = "3Fn9fXRqKW1o1pmXNovLwxvjSFdxxptEoZRSsJyjhtMi"; //paste address after "yarn createReferralAccount"
export const referralAccountPubKey = new PublicKey(RERERRAL_PUBKEY);

export const solTokenAccount = "7xu1XAfF3BCQcy5VCHT9UK1uCnKTtBSv3Ab9Dp3XKDQr"; //sol token account address associated with referral account
export const usdtTokenAccount = "AVxJgKiooWc2bkLJr6wosc9WN3Ra32XENbEFNBGjS3rT"; //usdt token account address associated with referral account
export const usdcTokenAccount = "Cr8KRXKG4FFStvYBWZe24AR1SMZyLB2Hi98gG9ib8osY"; //usdc token account address associated with referral account
