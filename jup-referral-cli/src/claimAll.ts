import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { ReferralProvider } from "@jup-ag/referral-sdk";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmRawTransaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { CONNECTTION, KEY_PAIR, referralAccountPubKey } from "./constant";


(async () => {
  
  console.log("============start============")
  const provider = new ReferralProvider(CONNECTTION);
  // console.log("🚀 ~ provider:", provider)
  console.log("🚀 ~ provider:", {
    payerPubKey: KEY_PAIR.publicKey.toString(),
    referralAccountPubKey:referralAccountPubKey.toString(), // Referral Key. You can create this with createReferralAccount.ts.
  })
  // This method will returns a list of transactions for all claims batched by 5 claims for each transaction.
  const txs = await provider.claimAll({
    payerPubKey: KEY_PAIR.publicKey,
    referralAccountPubKey:referralAccountPubKey, // Referral Key. You can create this with createReferralAccount.ts.
  });
  console.log("🚀 ~ txs:", txs)

  const { blockhash, lastValidBlockHeight } =
    await CONNECTTION.getLatestBlockhash();

  // Send each claim transaction one by one.
  for (const tx of txs) {
    console.log("🚀 ~ tx:", tx.version)
    tx.sign([KEY_PAIR]);

    const txid = await CONNECTTION.sendTransaction(tx);
    const { value } = await CONNECTTION.confirmTransaction({
      signature: txid,
      blockhash,
      lastValidBlockHeight,
    });

    if (value.err) {
      console.log({ value, txid });
    } else {
      console.log({ txid });
    }
  }
})();
