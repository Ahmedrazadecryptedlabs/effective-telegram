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

      <Card className="w-full sm:w-[440px] space-y-4 p-4 pb-7 bg-[#304256] text-white rounded-2xl shadow-md border-none">
        <div className="flex justify-between  items-center">
          <img
            src="https://cdn.onramper.com/premium/custom_logos/pk_prod_41GGD8ENSBSM0EG0N0RKW2Y9ZZ/rounded-dark.svg"
            className="w-9 h-9"
            alt=""
          />
          <h2 className="text-md font-bold">Buy crypto</h2>
          <Menu size={25} className="text-gray-500" />
        </div>

        {/* You Spend Section */}
        <div className="space-y-3">
          <div className="flex  input-background  rounded-2xl px-4 py-2 ">
            <div className="flex flex-col">
              <div>
                <label className="block text-md text-white my-2 font-medium">
                  You spend
                </label>
              </div>
              <div className="flex justify-between w-full py-1">
                <input
                  type="number"
                  placeholder="0.00"
                  value={spendValue !== undefined ? spendValue : ""}
                  onChange={handleSpendChange}
                  className="w-full bg-transparent text-white text-2xl font-medium focus:outline-none"
                />
                <button
                  onClick={() => {
                    setModalType("sell");
                    setCurrencyModalOpen(true);
                  }}
                  className="flex items-center bg-gray-700  hover:bg-gray-600 text-white px-3 h-10 rounded-xl ml-auto"
                >
                  {tokenListLoading ? (
                    <Skeleton circle height={20} width={20} />
                  ) : (
                    <>
                      <img
                        src={
                          sellCurrency?.logoURI || "/icons/coins/default.png"
                        }
                        alt={sellCurrency?.symbol || "Select Token"}
                        className="w-5 h-5 rounded-full"
                      />
                      <span className="text-sm font-semibold px-2 ">
                        {sellCurrency?.symbol || "Select Token"}
                      </span>
                      <ChevronDown size={35} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* You Get Section */}
          <div  className=" bg-[#19232D] rounded-2xl"    >
            <div className="flex w-full items-end input-background rounded-t-2xl px-4 py-3 justify-between">
              <div className="flex flex-col justify-start#">
                <div>
                  <label className="block text-md text-white  font-medium">
                    You get
                  </label>
                </div>
                <div className="flex items-center justify-between w-full my-4">
                  <input
                    type="text"
                    placeholder="0.00"
                    value={getValue.toFixed(6)}
                    readOnly
                    className="w-full bg-transparent text-white text-2xl font-medium focus:outline-none mb-4"
                  />
                  <div className="flex flex-col items-end">
                    <button
                      onClick={() => {
                        setModalType("buy");
                        setCoinModalOpen(true);
                      }}
                      className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-2 h-10 rounded-xl"
                    >
                      {tokenListLoading ? (
                        <Skeleton circle height={20} width={20} />
                      ) : (
                        <>
                          <img
                            src={
                              buyCurrency?.logoURI || "/icons/coins/default.png"
                            }
                            alt={buyCurrency?.symbol || "Select Token"}
                            className="w-5 h-5 rounded-full"
                          />
                          <span className="text-sm font-semibold px-2">
                            {buyCurrency?.symbol || "Select Token"}
                          </span>
                          <ChevronDown size={35} />
                        </>
                      )}
                    </button>
                    <div className="text-right text-xs mt-1 flex items-center justify-end">
                      <img
                        className="w-3 h-3 mx-1 rounded-full"
                        src={buyCurrency?.logoURI || "/icons/coins/default.png"}
                        alt=""
                      />
                      <span className="text-xxs">{buyCurrency?.symbol}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 py-2 text-sm rounded-b-xl text-white border-bottom-sm flex bg-[#19232D] justify-between">
              <span>1 {buyCurrency?.symbol || "Token"} ≈ 195.52 USD</span>
              <span className="flex items-center">
                By{" "}
                <img
                  src="/images/banza.png"
                  alt="Stripe"
                  className="inline h-4 mx-2 "
                />{" "}
                Banxa
                <ChevronDown size={"15px"} className="ml-1" />
              </span>
            </div>
          </div>
        </div>

        {/* Pay Using Section */}
        <div className="mb-6 pb-16">
          <label className="block text-sm text-white mb-2">Pay using</label>
          <div className="flex items-center border border-[#767676] rounded-2xl px-4 py-1 w-full max-w-full h-12">
            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center mr-3">
              <img
                src={selectedPayment.icon}
                alt={selectedPayment.name}
                className="w-4 h-4"
              />
            </div>
            <div className="flex-1 relative">
              <select
                className="text-xs bg-transparent text-white w-full pr-6 rounded-lg focus:outline-none appearance-none"
                onChange={(e) =>
                  setSelectedPayment(
                    paymentMethods.find(
                      (method) => method.name === e.target.value
                    ) ?? paymentMethods[0]
                  )
                }
              >
                {paymentMethods.map((method) => (
                  <option
                    key={method.name}
                    value={method.name}
                    className="bg-gray-700 text-white"
                  >
                    {method.name}
                  </option>
                ))}
              </select>

              <ChevronDown className="text-white w-6 h-6 font-extrabold absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Buy Button */}
        {connected ? (
          <Button
            className="w-full bg-cyan-400 py-3 rounded-xl mt-24 text-black font-bold hover:bg-cyan-400"
            disabled={
              quoteLoading || spendValue === undefined || spendValue <= 0
            }
            onClick={() => alert("Buy functionality to be implemented.")}
          >
            {spendValue === 0
              ? "Enter an Amount"
              : quoteLoading
              ? "Loading..."
              : "Buy"}
          </Button>
        ) : (
          <Button
            className="w-full bg-cyan-400 py-3  rounded-xl !mt-26 text-black font-bold hover:bg-cyan-400"
            onClick={() =>
              alert("Connect Wallet functionality to be implemented.")
            }
          >
            Connect Wallet
          </Button>
        )}
      </Card>

      {/* Sell Currency Modal */}
      {currencyModalOpen && (
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
      )}

      {/* Buy Currency Modal */}
      {coinModalOpen && (
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
      )}
    </div>
  );
}
