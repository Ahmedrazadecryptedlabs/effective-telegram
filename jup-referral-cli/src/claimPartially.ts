import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { ReferralProvider } from "@jup-ag/referral-sdk";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { CONNECTTION, KEY_PAIR, referralAccountPubKey, RERERRAL_PUBKEY, usdtTokenAccount } from "./constant";



(async () => {
  const provider = new ReferralProvider(CONNECTTION);
  // This method will return an array of withdrawable token addresses.
  // const referralTokens = await provider.getReferralTokenAccountsWithStrategy(
  //   referralAccountPubKey.toString(),
  //   { type: "token-list", tokenList: "strict" },
  // );

  // const withdrawalableTokenAddress = [
  //   ...(referralTokens.tokenAccounts || []),
  //   ...(referralTokens.token2022Accounts || []),
  // ].map((a) => a.pubkey);

  // // You can do a chunk / slice of x withdrawalableTokenAddress to claim partially to prevent a RPC timeout
  // const tenWithdrawableTokenAddress = withdrawalableTokenAddress.slice(1, 10);

  
  const usdtPublicKey = new PublicKey(usdtTokenAccount); //usdt

  const withdrawableTokenAddress:PublicKey[] = [usdtPublicKey] ;

  console.log("======== start ===========")

  // This method will returns a list of transactions for all claims batched by 5 claims for each transaction.
  const txs = await provider.claimPartially({
    withdrawalableTokenAddress: withdrawableTokenAddress, // Enter your withdrawalable token address here.
    payerPubKey: KEY_PAIR.publicKey,
    referralAccountPubKey: referralAccountPubKey,
  });

  const { blockhash, lastValidBlockHeight } =
    await CONNECTTION.getLatestBlockhash();

  // Send each claim transaction one by one.
  for (const tx of txs) {
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
