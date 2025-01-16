"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { ChevronDown, Menu } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { usePoolContext } from "@/context/PoolContext";
import {
  DEFAULT_SELL_ADDRESS,
  DEFAULT_BUY_ADDRESS,
  FEE_CONFIG,
} from "@/constants";
import { IconOption, Token } from "@/types";
import { createJupiterApiClient, QuoteResponse } from "@jup-ag/api";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const jupiterQuoteApi = createJupiterApiClient();

export default function OnrampCard() {
  const { connected } = useWallet();
  const { tokenList, tokenListLoading } = usePoolContext();

  const initialSellCurrency = tokenList.find(
    (token) => token.address === DEFAULT_SELL_ADDRESS
  );
  const initialBuyCurrency = tokenList.find(
    (token) => token.address === DEFAULT_BUY_ADDRESS
  );

  const [sellCurrency, setSellCurrency] = useState<Token | null>(
    initialSellCurrency ?? null
  );
  const [buyCurrency, setBuyCurrency] = useState<Token | null>(
    initialBuyCurrency ?? null
  );

  const [currencyModalOpen, setCurrencyModalOpen] = useState(false);
  const [coinModalOpen, setCoinModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"sell" | "buy">("sell");

  const [spendValue, setSpendValue] = useState<number | undefined>(undefined);
  const [debouncedSpendValue, setDebouncedSpendValue] = useState<
    number | undefined
  >(undefined);
  const [getValue, setGetValue] = useState<number>(0);
  const [quoteLoading, setQuoteLoading] = useState<boolean>(false);

  const [selectedPayment, setSelectedPayment] = useState<IconOption>({
    name: "Debit Card",
    icon: "/images/credit-card.png",
  });

  const paymentMethods: IconOption[] = [
    { name: "Debit Card", icon: "/images/debit-card.png" },
    { name: "Credit Card", icon: "/images/credit-card.png" },
    { name: "PayPal", icon: "/images/paypal.png" },
  ];

  useEffect(() => {
    const handler = setTimeout(() => {
      if (spendValue !== undefined && spendValue > 0) {
        setDebouncedSpendValue(spendValue);
      } else {
        setDebouncedSpendValue(undefined);
        setGetValue(0);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [spendValue]);

  useEffect(() => {
    if (!sellCurrency || !buyCurrency || debouncedSpendValue === undefined) {
      return;
    }
    getJupiterQuote(sellCurrency, buyCurrency, debouncedSpendValue);
  }, [sellCurrency, buyCurrency, debouncedSpendValue]);

  const getJupiterQuote = async (
    fromToken: Token,
    toToken: Token,
    _sellAmount?: number
  ): Promise<void> => {
    if (!_sellAmount || _sellAmount <= 0) {
      console.error("Please enter a valid amount");
      setGetValue(0);
      return;
    }

    if (fromToken.address === toToken.address) {
      console.error("Input and output tokens cannot be the same.");
      alert(
        "Input and output tokens cannot be the same. Please select different tokens."
      );
      setGetValue(0);
      return;
    }

    try {
      setQuoteLoading(true);
      const amount = Math.floor(_sellAmount * 10 ** fromToken.decimals);
      const data: QuoteResponse = await jupiterQuoteApi.quoteGet({
        inputMint: fromToken.address,
        outputMint: toToken.address,
        amount,
        slippageBps: 2500,
        swapMode: "ExactIn",
        platformFeeBps: FEE_CONFIG.platformFeeBps,
      });

      if (data && data.outAmount) {
        const _buyAmount = parseFloat(data.outAmount) / 10 ** toToken.decimals;
        setGetValue(_buyAmount);
      } else {
        setGetValue(0);
      }
    } catch (error: any) {
      console.error(
        "Error fetching Jupiter quote:",
        error.response || error.message || error
      );
      alert("An error occurred while fetching the quote. Please try again.");
      setGetValue(0);
    } finally {
      setQuoteLoading(false);
    }
  };

  const handleSellCurrencySelect = (token: Token) => {
    if (token.address === buyCurrency?.address) {
      alert("You cannot select the same token for both selling and buying.");
      return;
    }
    setSellCurrency(token);
    setCurrencyModalOpen(false);
    setSpendValue(undefined);
    setGetValue(0);
  };

  const handleBuyCurrencySelect = (token: Token) => {
    if (token.address === sellCurrency?.address) {
      alert("You cannot select the same token for both selling and buying.");
      return;
    }
    setBuyCurrency(token);
    setCoinModalOpen(false);
    setSpendValue(undefined);
    setGetValue(0);
  };

  const handleSpendChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? Number(e.target.value) : undefined;
    setSpendValue(value);
  };

  useEffect(() => {
    if (!tokenListLoading && tokenList.length > 0) {
      setSellCurrency(initialSellCurrency ?? null);
      setBuyCurrency(initialBuyCurrency ?? null);
    }
  }, [tokenList, tokenListLoading]);

  return (
    <div className="flex flex-col items-center px-4 sm:px-0">
      <p className="py-6  text-center text-md font-bold text-gray-400">
        Onramp to Solana instantly!
      </p>

      <iframe
        src="https://buy.onramper.com?apiKey=pk_prod_41GGD8ENSBSM0EG0N0RKW2Y9ZZ&amp;themeName=dark&amp;containerColor=304256ff&amp;primaryColor=c7f284ff&amp;secondaryColor=2c4256ff&amp;cardColor=19232dff&amp;primaryTextColor=ffffff&amp;secondaryTextColor=ffffff&amp;borderRadius=1&amp;wgBorderRadius=1&amp;partnerContext=Jupiter&amp;successRedirectUrl=https%3A%2F%2Fjup.ag%2Fbridge%2Fonramp&amp;failureRedirectUrl=https%3A%2F%2Fjup.ag%2Fbridge%2Fonramp&amp;mode=buy&amp;defaultCrypto=sol&amp;onlyCryptoNetworks=solana&amp;networkWallets=&amp;supportOtcTxn=true&amp;excludeFiats=krw"
        title="Onramper Widget"
        height="630px"
        width="100%"
        allow="accelerometer; autoplay; camera; gyroscope; payment; microphone"
      ></iframe>

      {/* Sell Currency Modal */}
      {/* {currencyModalOpen && (
        <Modal onClose={() => setCurrencyModalOpen(false)}>
          <h3 className="text-lg font-bold mb-4">Select Currency</h3>
          {tokenListLoading ? (
            <Skeleton count={5} height={40} width="100%" baseColor="#374151" />
          ) : tokenList.length > 0 ? (
            <ul className="space-y-4">
              {tokenList.map((token) => (
                <li
                  key={token.address}
                  className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700"
                  onClick={() => handleSellCurrencySelect(token)}
                >
                  <img
                    src={token.logoURI || "/icons/coins/default.png"}
                    alt={token.symbol}
                    className="w-6 h-6"
                  />
                  <span className="text-white font-medium">{token.symbol}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tokens available</p>
          )}
        </Modal>
      )} */}

      {/* Buy Currency Modal */}
      {/* {coinModalOpen && (
        <Modal onClose={() => setCoinModalOpen(false)}>
          <h3 className="text-lg font-bold mb-4">Select Coin</h3>
          {tokenListLoading ? (
            <Skeleton count={5} height={40} width="100%" baseColor="#374151" />
          ) : tokenList.length > 0 ? (
            <ul className="space-y-4">
              {tokenList.map((token) => (
                <li
                  key={token.address}
                  className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700"
                  onClick={() => handleBuyCurrencySelect(token)}
                >
                  <img
                    src={token.logoURI || "/icons/coins/default.png"}
                    alt={token.symbol}
                    className="w-6 h-6"
                  />
                  <span className="text-white font-medium">{token.symbol}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tokens available</p>
          )}
        </Modal>
      )} */}
    </div>
  );
}
