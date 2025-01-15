"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/modal";
import {
  AlignHorizontalDistributeCenter,
  ArrowDownUp,
  ChevronDown,
  Clock,
} from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { usePoolContext } from "@/context/PoolContext";
import {
  DEFAULT_SELL_ADDRESS,
  DEFAULT_BUY_ADDRESS,
  FEE_CONFIG,
  APP_CONNECTION,
} from "@/constants";
import { Token } from "@/types";
import {
  createJupiterApiClient,
  QuoteResponse,
  SwapResponse,
} from "@jup-ag/api";
import "react-loading-skeleton/dist/skeleton.css";
import { Connection, PublicKey, VersionedTransaction } from "@solana/web3.js";
import showToast from "@/lib/showToast";
import SwapComponent from "@/components/ui/SwapComponent";
import LimitComponent from "./LimitComponent";
import ConnectWalletSection from "./ConnectWalletSection";
import DCAComponent from "./dcaComponent";
import VAComponent from "./VAComponent";
const jupiterQuoteApi = createJupiterApiClient();
const tabs = ["Swap", "Limit", "DCA", "VA"];

export default function SpotTradeSection() {
  const {
    connected,
    publicKey: connectedWalletPK,
    sendTransaction,
    signTransaction,
  } = useWallet();
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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"sell" | "buy">("sell");
  const [sellAmount, setSellAmount] = useState<number | undefined>(undefined);
  const [debouncedSellAmount, setDebouncedSellAmount] = useState<
    number | undefined
  >(undefined);
  const [buyAmount, setBuyAmount] = useState<number>(0);
  const [quoteLoading, setQuoteLoading] = useState<boolean>(false);
  const [loadingSwap, setLoadingSwap] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [filteredTokenList, setFilteredTokenList] = useState<Token[]>([]); // Filtered tokens for display
  const [searching, setSearching] = useState(false);
  const [activeTab, setActiveTab] = useState("Swap");
  const [showChart, setShowChart] = useState(true);
  const [showConnectWallet, setShowConnectWallet] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getJupiterQuote = async (
    fromToken: Token,
    toToken: Token,
    _sellAmount?: number
  ): Promise<QuoteResponse | null> => {
    if (!_sellAmount || _sellAmount <= 0) {
      showToast({ message: "Please enter a valid amount", type: "error" });
      setBuyAmount(0);
      return null;
    }

    if (fromToken.address === toToken.address) {
      showToast({
        message: "Input and output tokens cannot be the same.",
        type: "error",
      });
      setBuyAmount(0);
      return null;
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
        setBuyAmount(_buyAmount);
        return data;
      } else {
        setBuyAmount(0);
        return null;
      }
    } catch (error) {
      showToast({
        message: "Error fetching quote, please try again.",
        type: "error",
      });
      console.error("Error fetching Jupiter quote:", error);
      return null;
    } finally {
      setQuoteLoading(false);
    }
  };

  const executeJupiterSwap = async () => {
    if (!connectedWalletPK || !signTransaction || !sendTransaction) {
      showToast({ message: "Please connect your wallet.", type: "error" });
      return;
    }

    try {
      setLoadingSwap(true);

      const quoteResponse = await getJupiterQuote(
        sellCurrency!,
        buyCurrency!,
        sellAmount
      );
      if (!quoteResponse) throw new Error("Could not get quote from Jupiter");

      const blockhash = await APP_CONNECTION.getLatestBlockhash("confirmed");
      const referralAccountPubkey = new PublicKey(
        FEE_CONFIG.feeAccountReferralPublicKey
      );
      const mint = new PublicKey(buyCurrency!.address);
      const [feeAccount] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("referral_ata"),
          referralAccountPubkey.toBuffer(),
          mint.toBuffer(),
        ],
        new PublicKey(FEE_CONFIG.jupiterReferralProgram)
      );

      const swapObj: SwapResponse = await jupiterQuoteApi.swapPost({
        swapRequest: {
          quoteResponse,
          userPublicKey: connectedWalletPK.toBase58(),
          wrapAndUnwrapSol: true,
          dynamicComputeUnitLimit: true,
          prioritizationFeeLamports: "auto",
          feeAccount: feeAccount.toBase58(),
        },
      });

      const transactionFromSwap = VersionedTransaction.deserialize(
        Buffer.from(swapObj.swapTransaction, "base64")
      );
      transactionFromSwap.message.recentBlockhash = blockhash.blockhash;

      const signedTransaction = await signTransaction(transactionFromSwap);
      const RAW_TX = signedTransaction.serialize();

      const signature = await APP_CONNECTION.sendRawTransaction(RAW_TX);
      showToast({
        message: `Swap Transaction Sent. Please wait for confirmation.`,
        type: "info",
      });
      console.log(`Transaction sent: https://solana.fm/tx/${signature}`);

      await APP_CONNECTION.confirmTransaction(signature, "confirmed");
      showToast({
        message: `Swap successful! Transaction: ${signature}`,
        type: "success",
      });
    } catch (error: any) {
      handleJupiterSwapError(error);
    } finally {
      setLoadingSwap(false);
    }
  };

  const handleJupiterSwapError = (error: any) => {
    if (error.message?.includes("User rejected the request")) {
      showToast({
        message: "Transaction rejected by user. Please try again.",
        type: "error",
      });
    } else if (error.message?.includes("Attempt to debit an account")) {
      showToast({
        message:
          "Simulation failed: Attempt to debit an account but found no record of a prior credit. Please check your wallet balance or retry.",
        type: "error",
      });
    } else if (error.logs) {
      const logs = error.logs.join("\n");
      showToast({
        message: `Simulation failed with logs: ${logs}`,
        type: "error",
      });
    } else {
      showToast({
        message: `An unexpected error occurred: ${error.message}`,
        type: "error",
      });
    }
    console.error("Error executing Jupiter swap:", error);
  };
  const isValidSolanaAddress = (address: any) => {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  };

  useEffect(() => {
    if (!tokenListLoading && tokenList.length > 0) {
      setSellCurrency(initialSellCurrency ?? null);
      setBuyCurrency(initialBuyCurrency ?? null);
    }
  }, [tokenList, tokenListLoading]);

  const fetchTokenFromAPI = async (query: any) => {
    try {
      const response = await fetch(`https://tokens.jup.ag/token/${query}`);
      if (!response.ok) throw new Error(`API error: ${response.statusText}`);

      const tokenData = await response.json();
      if (tokenData && tokenData.address) {
        const simplifiedTokenData = {
          address: tokenData.address,
          decimals: tokenData.decimals,
          logoURI: tokenData.logoURI,
          symbol: tokenData.symbol,
          isExternal: true,
        };

        const berfore_storedTokens = JSON.parse(
          localStorage.getItem("externalTokens") || "[]"
        );

        if (
          !berfore_storedTokens.some(
            (token: any) => token.address === simplifiedTokenData.address
          )
        ) {
          berfore_storedTokens.push(simplifiedTokenData);
          localStorage.setItem(
            "externalTokens",
            JSON.stringify(berfore_storedTokens)
          );
        }
      } else {
        showToast({
          message: "Token not found on external API.",
          type: "error",
        });
      }

      const localTokens = JSON.parse(
        localStorage.getItem("externalTokens") || "[]"
      );
      const combinedTokenList = [...localTokens, ...tokenList];
      console.log(
        "🚀 ~ fetchTokenFromAPI ~ combinedTokenList:",
        combinedTokenList
      );

      const filteredTokens = combinedTokenList.filter(
        (token) =>
          token.address
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          token.symbol
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase())
      );

      setFilteredTokenList(filteredTokens);
    } catch (error) {
      console.error("Error fetching token from external API:", error);
      showToast({ message: `Failed to fetch token: ${error}`, type: "error" });
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (sellAmount !== undefined && sellAmount > 0) {
        setDebouncedSellAmount(sellAmount);
      } else {
        setDebouncedSellAmount(undefined);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [sellAmount]);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setSearching(false);
    }, 500);

    setSearching(true); // Show searching state immediately
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (!sellCurrency || !buyCurrency || debouncedSellAmount === undefined) {
      return;
    }
    getJupiterQuote(sellCurrency, buyCurrency, debouncedSellAmount);
  }, [sellCurrency, buyCurrency, debouncedSellAmount]);

  // Debounce the search query with 0.5s delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Filtered token list based on the debounced search query
  useEffect(() => {
    const localTokens = JSON.parse(
      localStorage.getItem("externalTokens") || "[]"
    );
    const combinedTokenList = [...localTokens, ...tokenList];

    const filteredTokens = combinedTokenList.filter(
      (token) =>
        token.address
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase()) ||
        token.symbol.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );

    setFilteredTokenList(filteredTokens);

    // Fetch from external API if no match is found
    if (filteredTokens.length === 0 && debouncedSearchQuery) {
      if (isValidSolanaAddress(debouncedSearchQuery)) {
        fetchTokenFromAPI(debouncedSearchQuery);
      } else {
        showToast({
          message: "Invalid token address. Please check your input.",
          type: "error",
        });
      }
    }
  }, [debouncedSearchQuery, tokenList]);

  const handleTokenSelection = (token: Token) => {
    if (modalType === "sell") {
      setSellCurrency(token);
    } else if (modalType === "buy") {
      setBuyCurrency(token);
    }
    setModalOpen(false);
    setSearchQuery(""); // Reset search query
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Swap":
        return (
          <SwapComponent
            tokenListLoading={tokenListLoading}
            sellCurrency={sellCurrency}
            setSellCurrency={setSellCurrency}
            buyCurrency={buyCurrency}
            setBuyCurrency={setBuyCurrency}
            sellAmount={sellAmount}
            setSellAmount={setSellAmount}
            buyAmount={buyAmount}
            quoteLoading={quoteLoading}
            modalType={modalType}
            setModalType={setModalType}
            setModalOpen={setModalOpen}
            connected={connected}
            executeJupiterSwap={() => {}}
            loadingSwap={loadingSwap}
          />
        );
      case "Limit":
        return (
          <LimitComponent
            tokenListLoading={tokenListLoading}
            sellCurrency={sellCurrency}
            setSellCurrency={setSellCurrency}
            buyCurrency={buyCurrency}
            setBuyCurrency={setBuyCurrency}
            sellAmount={sellAmount}
            setSellAmount={setSellAmount}
            buyAmount={buyAmount}
            quoteLoading={quoteLoading}
            modalType={modalType}
            setModalType={setModalType}
            setModalOpen={setModalOpen}
            connected={connected}
            executeJupiterSwap={executeJupiterSwap}
            loadingSwap={loadingSwap}
          />
        );
      case "DCA":
        return (
          <DCAComponent
            tokenListLoading={tokenListLoading}
            sellCurrency={sellCurrency}
            setSellCurrency={setSellCurrency}
            buyCurrency={buyCurrency}
            setBuyCurrency={setBuyCurrency}
            sellAmount={sellAmount}
            setSellAmount={setSellAmount}
            buyAmount={buyAmount}
            quoteLoading={quoteLoading}
            modalType={modalType}
            setModalType={setModalType}
            setModalOpen={setModalOpen}
            connected={connected}
            executeJupiterSwap={executeJupiterSwap}
            loadingSwap={loadingSwap}
          />
        );
      case "VA":
        return (
          <VAComponent
            tokenListLoading={tokenListLoading}
            sellCurrency={sellCurrency}
            setSellCurrency={setSellCurrency}
            buyCurrency={buyCurrency}
            setBuyCurrency={setBuyCurrency}
            sellAmount={sellAmount}
            setSellAmount={setSellAmount}
            buyAmount={buyAmount}
            quoteLoading={quoteLoading}
            modalType={modalType}
            setModalType={setModalType}
            setModalOpen={setModalOpen}
            connected={connected}
            executeJupiterSwap={executeJupiterSwap}
            loadingSwap={loadingSwap}
          />
        );
      default:
        return null;
    }
  };

  const tabStates = {
    Swap: { showCancelAll: false, additionalProp: "swap-specific-data" },
    Limit: {
      showCancelAll: true,
      additionalProp: "limit-specific-data",
      tabs: [
        { id: "openOrders", label: "Open Orders" },
        { id: "Open Orders", label: "openOrders" },
      ],
      headerTop: true,
    },
    DCA: {
      showCancelAll: false,
      additionalProp: "dca-specific-data",
      tabs: [
        { id: "Active DCAs", label: "Past DCAs" },
        { id: "Past DCAs", label: "Active DCAs" },
      ],
      headerTop: true,
    },
    VA: {
      showCancelAll: true,
      additionalProp: "va-specific-data",
      tabs: [
        { id: "Active VAs", label: "Past VAs" },
        { id: "Past VAs", label: "Active VAs" },
      ],
      headerTop: true,
    },
  };
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="mt-12 p-0 sm:p-4">
      <div className="flex flex-wrap justify-center lg:flex-nowrap w-full lg:w-4/5 gap-4 p-4 m-auto">
        {/* Chart Section with Animation */}

        {showChart ? (
          <div
            className={`chart-section 
    transition-all 
    duration-500 
    ${
      showChart
        ? "opacity-100 pointer-events-auto"
        : "opacity-0 pointer-events-none"
    } 
    w-[55%]`} // Keep a fixed width so tabs don't move
          >
            <div className="bg-gray-900 rounded-2xl overflow-hidden">
              {/* <TradingViewChartCard
        baseToken={sellCurrency}
        quoteToken={buyCurrency}
      /> */}

              <iframe
                src="https://www.tradingview.com/widgetembed/?theme=dark"
                frameBorder="0"
                className="h-[400px] sm:h-[450px] lg:h-[500px] rounded-2xl w-full"
              ></iframe>
            </div>
            {showConnectWallet && (
              <div
                className={`transition-opacity duration-500 ${
                  showConnectWallet
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <ConnectWalletSection
                  tabs={[activeTab]} // Pass the current tab as a prop
                  {...tabStates[activeTab]} // Spread unique states for the active tab
                />
              </div>
            )}
          </div>
        ) : null}

        {/* Tabs Section */}
        <div style={{ width: "28%" }} className="w-full space-y-3 tabs-section">
          <div className="flex flex-col md:flex-row items-center justify-between rounded-full w-full">
            <div className="flex items-center px-1  space-x-1 justify-evenly bg-[#192230] rounded-full  py-1 w-full">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full   px-5 py-3 rounded-full text-sm font-bold transition-all ${
                    activeTab === tab
                      ? "bg-primary/20 text-primary"
                      : "bg-transparent text-white hover:bg-primary/10 hover:text-gray-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Right-Side Icons */}
            {activeTab === "Swap" && (
              <div className="flex items-center space-x-1 mt-3 md:mt-0 ml-2">
                {/* px-6 py-2 text-primary bg-primary/10 text-black rounded-lg font-bold shadow-md  transition-all duration-300  hover:border-cyan-400 border border-transparent hover:border-cyan-400 */}

                <button
                  onClick={() => setShowChart(!showChart)}
                  className={`w-11 h-11 flex items-center justify-center rounded-full transition ${
                    showChart
                      ? " bg-primary/10 text-cyan-400"
                      : " bg-primary-transparent text-white"
                  }`}
                >
                  <AlignHorizontalDistributeCenter size={17} />
                </button>
                <button
                  onClick={() => setShowConnectWallet(!showConnectWallet)}
                  className={`w-11 h-11 flex items-center justify-center rounded-full transition ${
                    showConnectWallet
                      ? " bg-primary/10 text-cyan-400"
                      : " bg-primary-transparent text-white"
                  }`}
                >
                  <Clock size={19} />
                </button>
              </div>
            )}
          </div>

          {/* Dynamic Tab Content */}
          {renderTabContent()}
        </div>
      </div>

      {/* <button
        onClick={openModal}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Open Token Select Modal
      </button>

      {/* TokenSelectModal usage */}
      {/* <TokenSelectModal isOpen={isModalOpen} onClose={closeModal} /> */}

      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          tokenList={tokenList}
          onTokenSelect={handleTokenSelection} // <--- capture the selected token
        />
      )}
    </div>
  );
}
