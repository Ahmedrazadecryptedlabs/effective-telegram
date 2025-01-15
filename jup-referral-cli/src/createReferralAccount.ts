import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { ReferralProvider } from "@jup-ag/referral-sdk";
import {
  Connection,
  Keypair,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

import { CONNECTTION, JUPITER_PROJECT, KEY_PAIR } from "./constant";


const provider = new ReferralProvider(CONNECTTION);
const referralAccountKeypair = Keypair.generate();

(async () => {
  const tx = await provider.initializeReferralAccount({
    payerPubKey: KEY_PAIR.publicKey,
    partnerPubKey: KEY_PAIR.publicKey,
    projectPubKey: JUPITER_PROJECT,
    referralAccountPubKey: referralAccountKeypair.publicKey,
  });

  const referralAccount = await CONNECTTION.getAccountInfo(
    referralAccountKeypair.publicKey,
  );

  if (!referralAccount) {
    const txId = await sendAndConfirmTransaction(CONNECTTION, tx, [
      KEY_PAIR,
      referralAccountKeypair,
    ]);
    console.log({
      txId,
      referralAccountPubKey: referralAccountKeypair.publicKey.toBase58(),
    });
  } else {
    console.log(
      `referralAccount ${referralAccountKeypair.publicKey.toBase58()} already exists`,
    );
  }
})();
