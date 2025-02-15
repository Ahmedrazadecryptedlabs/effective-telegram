import { Dispatch, SetStateAction } from 'react';

export type SwapProps = {
    fromToken: { tokenName: string; address: string };
    toToken: { tokenName: string; address: string };
};
export type Token = {
    tokenName: string;
    address: string;
    decimals: number;
};

export type LoginProps = {
  magicToken: string;
    setMagicToken: Dispatch<SetStateAction<string>>;
};
export type Mint = {
    chainId: number;
    address: string;
    programId: string;
    logoURI: string;
    symbol: string;
    name: string;
    decimals: number;
    tags: string[];
    extensions: object;
};

export type PoolData = {
    type: string;
    programId: string;
    id: string;
    mintA: Mint;
    mintB: Mint;
    price: number;
    mintAmountA: number;
    mintAmountB: number;
    feeRate: number;
    openTime: string;
    tvl: number;
    day: object;
    week: object;
    month: object;
    pooltype: string[];
    rewardDefaultPoolInfos: string;
    rewardDefaultInfos: any[];
    farmUpcomingCount: number;
    farmOngoingCount: number;
    farmFinishedCount: number;
    marketId: string;
    lpMint: Mint;
    lpPrice: number;
    lpAmount: number;
    burnPercent: number;
};

export type GetPoolsInfoApiResponse = {
    id: string;
    success: boolean;
    data: PoolData[];
};

export type  RaydiumSwapCompute = {
    id: string
    success: true
    version: 'V0' | 'V1'
    openTime?: undefined
    msg: undefined
    data: {
      swapType: 'BaseIn' | 'BaseOut'
      inputMint: string
      inputAmount: string
      outputMint: string
      outputAmount: string
      otherAmountThreshold: string
      slippageBps: number
      priceImpactPct: number
      routePlan: {
        poolId: string
        inputMint: string
        outputMint: string
        feeMint: string
        feeRate: number
        feeAmount: string
      }[]
    }
  }
