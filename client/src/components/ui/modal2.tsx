import React, { useEffect } from "react";
import { X, Search } from "lucide-react";

/**
 * Sample props for controlling the modal’s visibility,
 * plus any callbacks you need for token selection, etc.
 */
interface TokenSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * A list of “popular tokens” for the horizontal scroll row
 * (under the search bar). This is just sample data.
 */
const popularTokens = [
  {
    symbol: "SOL",
    name: "Solana",
    imageUrl:
      "https://wsrv.nl/?w=48&h=48&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.png",
  },
  {
    symbol: "SPL",
    name: "SPL Token",
    imageUrl:
      "https://wsrv.nl/?w=48&h=48&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FEPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v%2Flogo.png",
  },
  {
    symbol: "JLP",
    name: "Jupiter Perps",
    imageUrl:
      "https://wsrv.nl/?w=48&h=48&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FEs9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB%2Flogo.svg",
  },
  {
    symbol: "JitoSOL",
    name: "Jito ",
    imageUrl:
      "https://wsrv.nl/?w=48&h=48&url=https%3A%2F%2Fstorage.googleapis.com%2Ftoken-metadata%2FJitoSOL-256.png",
  },
  {
    symbol: "JLP",
    name: "JLP",
    imageUrl:
      "https://wsrv.nl/?w=48&h=48&url=https%3A%2F%2Fstatic.jup.ag%2Fjlp%2Ficon.png",
  },
  {
    symbol: "Fartcoin",
    name: "Fartcoin",
    imageUrl:
      "https://wsrv.nl/?w=48&h=48&url=https%3A%2F%2Fipfs.io%2Fipfs%2FQmQr3Fz4h1etNsF7oLGMRHiCzhB5y9a7GjyodnF7zLHK1g",
  },
];

/**
 * Main token list data—purely for the example.
 * In your real app, you’d fetch or pass real tokens.
 */
const tokenList = [
  {
    symbol: "SOL",
    name: "Solana",
    address: "So111...11112",
    verified: true,
    extraBadge: "",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "EPjFW...TDt1v",
    verified: true,
    extraBadge: "",
  },
  {
    symbol: "USDT",
    name: "USDT",
    address: "Es9vM...nwNYB",
    verified: true,
    extraBadge: "",
  },
  {
    symbol: "JLP",
    name: "Jupiter Perps",
    address: "27G8M...JidD4",
    verified: true,
    extraBadge: "",
  },
  {
    symbol: "JitoSOL",
    name: "Jito Staked SOL",
    address: "Jitos...kGCPn",
    verified: true,
    extraBadge: "8.51% LST",
  },
  {
    symbol: "Fartcoin",
    name: "Fartcoin",
    address: "9BBEn...gpump",
    verified: true,
    extraBadge: "",
  },
  {
    symbol: "POPcat",
    name: "Popcat",
    address: "7Gcih...mW2hr",
    verified: true,
    extraBadge: "",
  },
  {
    symbol: "ETH",
    name: "Ether (Portal)",
    address: "7vfCX...3vxos",
    verified: true,
    extraBadge: "",
  },
  {
    symbol: "GOAT",
    name: "Goatseus Maximus",
    address: "CzLSu...ypump",
    verified: true,
    extraBadge: "",
  },
  {
    symbol: "CHILLGUY",
    name: "Just a chill guy",
    address: "Df6yf...jpump",
    verified: true,
    extraBadge: "",
  },
];

const TokenSelectModal: React.FC<TokenSelectModalProps> = ({
  isOpen,
  onClose,
}) => {
  /**
   * Close on ESC key
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-50 
        flex justify-center m-auto
        bg-black bg-opacity-50
        backdrop-blur-md
      "
      onClick={onClose}
    >
      {/** Right-side panel */}
      <div
        className="
          relative
        w-full sm:max-w-[450px]
        h-auto max-h-[80%]
        bg-[#304256]
        text-white
        sm:px-0
        px-6
        mt-4
        flex flex-col
        rounded-md
        shadow-xl
        overflow-hidden
        "
        onClick={(e) => e.stopPropagation()} // don’t close when clicking panel
      >
        {/** Header: Search & ESC button */}
        <div className="flex items-center  justify-between p-2 ">
          <div className="relative flex-1">
            <Search
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 "
              size={14}
            />
            <input
              type="text"
              placeholder="Search by token or paste address"
              className="
                w-full
                bg-[#304256]
                border border-gray-700
                rounded-lg
                py-2 pl-8 pr-3
                text-xs
                text-gray-200
                focus:outline-none
                focus:ring-2
                focus:ring-cyan-400
                transition
              "
            />
          </div>

          <button
            className="
              ml-4
              text-gray-400
              hover:text-gray-200
              text-xs
              px-[7px]
              py-[6px]
              rounded
              transition
              bg-[#1A2530]
            "
            onClick={onClose}
          >
            Esc
          </button>
        </div>

        {/** Popular tokens row (scrollable horizontally) */}
        <div className="flex items-center gap-3 overflow-x-auto  px-4 py-2 rounded-md">
          {popularTokens.map((token, index) => (
            <div
              key={token.symbol}
              style={{ border: "1px solid #4B5C6F" }}
              className={`
        flex items-center
        rounded-full 
        ${index < 3 ? "justify-center w-[42px] h-[32px]" : "gap-2 px-3 py-1.5"}
        transition
      `}
            >
              {/* Token Image */}
              <img
                src={token.imageUrl}
                alt={token.symbol}
                className={`${
                  index < 3 ? "w-6 h-6 rounded-xl" : "w-5 h-5 rounded-xl"
                }`}
              />
              {/* Token Name (only for tokens 4, 5, 6) */}
              {index >= 3 && (
                <span className="text-white text-xxs">{token.name}</span>
              )}
            </div>
          ))}
        </div>

        {/** Scrollable token list */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
          {tokenList.map((token) => (
            <button
              key={token.symbol}
              className="
                w-full
                flex items-center
                bg-[#354552]/40
                hover:bg-[#354552]/80
                rounded-lg
                p-3
                text-left
                mb-2
                transition
              "
            >
              {/** Token Logo Placeholder */}
              <div className="w-8 h-8 bg-gray-500 rounded-full mr-3 flex-shrink-0" />

              {/** Symbol + name + address */}
              <div className="flex-1 flex flex-col">
                <span className="text-sm font-bold">{token.symbol}</span>
                <span className="text-xs text-gray-300">{token.name}</span>
                <span className="text-xs text-gray-500">{token.address}</span>
              </div>

              {/** Optional badge on the right */}
              {token.extraBadge && (
                <span
                  className="
                    ml-2
                    text-xs
                    px-2 py-1
                    bg-[#1A2530]
                    rounded
                    text-cyan-400
                    border border-cyan-400
                  "
                >
                  {token.extraBadge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokenSelectModal;
