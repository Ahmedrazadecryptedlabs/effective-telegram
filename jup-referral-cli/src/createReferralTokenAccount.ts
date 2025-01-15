import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { ReferralProvider } from "@jup-ag/referral-sdk";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { CONNECTTION, KEY_PAIR, referralAccountPubKey, sol, usdc, usdt } from "./constant";


const provider = new ReferralProvider(CONNECTTION);

(async () => {
  // const mint = new PublicKey(sol); //sol
  // const mint = new PublicKey(usdt); //usdt
  const mint = new PublicKey(usdc); //usdc
  const { tx, referralTokenAccountPubKey } =
  await provider.initializeReferralTokenAccount({
    payerPubKey: KEY_PAIR.publicKey,
    referralAccountPubKey:referralAccountPubKey, // Referral Key. You can create this with createReferralAccount.ts.
    mint,
  });
  
  console.log("🚀 ~ referralTokenAccountPubKey:", referralTokenAccountPubKey.toString())
  const referralTokenAccount = await CONNECTTION.getAccountInfo(
    referralTokenAccountPubKey,
  );
  
  console.log("🚀 ~ referralTokenAccount:", referralTokenAccount)

  if (!referralTokenAccount) {
    const txId = await sendAndConfirmTransaction(CONNECTTION, tx, [KEY_PAIR]);
    console.log({
      txId,
      referralTokenAccountPubKey: referralTokenAccountPubKey.toBase58(),
    });
  } else {
    console.log(
      `referralTokenAccount ${referralTokenAccountPubKey.toBase58()} for mint ${mint.toBase58()} already exists`,
    );
  }
})();
