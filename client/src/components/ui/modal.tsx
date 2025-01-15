"use client";
import React, { useEffect, useState } from "react";
import { BadgeCheck, Search } from "lucide-react";
import { Token } from "@/types"; // <-- use your real Token interface here

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenList: Token[];
  onTokenSelect?: (selectedToken: Token) => void;
}

/** Hard-coded popular tokens matching your `Token` shape */
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
    symbol: "sd",
    name: "asd",
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

function shortenAddress(address: string): string {
  if (!address) return "";
  // e.g. "So11111111111111111111111111111111111111112" → "So11...11112"
  const start = address.slice(0, 4);
  const end = address.slice(-5);
  return `${start}...${end}`;
}


const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  tokenList,
  onTokenSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTokens, setFilteredTokens] = useState<Token[]>(tokenList);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Search filter
  useEffect(() => {
    if (!searchQuery) {
      setFilteredTokens(tokenList);
    } else {
      const lowerQ = searchQuery.toLowerCase();
      setFilteredTokens(
        tokenList.filter(
          (t) =>
            t.symbol.toLowerCase().includes(lowerQ) ||
            (t.name || "").toLowerCase().includes(lowerQ) ||
            t.address.toLowerCase().includes(lowerQ)
        )
      );
    }
  }, [searchQuery, tokenList]);

  // Overlays should close the modal
  const handleOverlayClick = () => onClose();
  // Prevent closing when clicking inside the content
  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) =>
    e.stopPropagation();

  // Fire onTokenSelect when a token is clicked
  const handleSelect = (token: Token) => {
    onTokenSelect?.(token);
    onClose();
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex justify-center
        bg-black bg-opacity-50
        backdrop-blur-md
      "
      onClick={handleOverlayClick}
    >
      <div
        className="
          relative
          w-full sm:max-w-[450px]
          h-auto max-h-[85%]
          bg-[#304256]
          text-white
          mt-4
          flex flex-col
          rounded-md
          shadow-xl
          overflow-hidden
        "
        onClick={handleContentClick}
      >
        {/* Header: Search & Esc button */}
        <div className="flex items-center justify-between p-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500"
              size={14}
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

        {/* Popular tokens row */}
        <div className="flex items-center gap-3 overflow-x-auto px-4 py-2 rounded-md">
          {popularTokens.map((token, i) => (
            <div
              key={token.symbol}
              style={{ border: "1px solid #4B5C6F" }}
              className={`
                flex items-center
                rounded-full
                ${i < 3 ? "justify-center w-[42px] h-[32px]" : "gap-2 px-3 py-1.5"}
                transition
              `}
            >
              <img
                src={token.imageUrl ?? "/default.png"}
                alt={token.symbol}
                className={`${i < 3 ? "w-6 h-6" : "w-5 h-5"} rounded-xl`}
              />
              {i >= 3 && (
                <span className="text-white text-xxs">{token.name}</span>
              )}
            </div>
          ))}
        </div>

        {/* Scrollable token list */}
        <div className="flex-1 overflow-y-auto  custom-scrollbar">
          {filteredTokens.map((token) => (
            <button
              key={token.address}
              onClick={() => handleSelect(token)}
              className="
                w-full
                flex items-center
                hover:bg-[#435467]
                rounded-lg
                h-16
                py-4
                px-3
                text-left
                transition
              "
            >
              {/* If you have real images, use token.logoURI. */}
              {/* <div className="w-8 h-8 bg-gray-500 rounded-full mr-3 flex-shrink-0" /> */}
              <img  className='w-8 h-8 rounded-2xl mx-2' src={token.logoURI} />
              <div className="flex-1 flex flex-col mx-1">
                <span className="text-sm font-bold flex items-center"><span className="mr-2" >{token.symbol} </span><BadgeCheck className="text-primary w-4 h-4"   /></span>
                <span className="text-xs text-gray-300">{token.name}</span>
                <span className="text-xxs text-gray-500 ">  {shortenAddress(token.address)}</span>
              </div>

              {token.extraBadge && (
                <span
                  className="
                    ml-2
                    text-xs
                    px-2
                    py-1
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
          {filteredTokens.length === 0 && (
            <p className="text-center text-gray-400 mt-4">
              No tokens found for “{searchQuery}”
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
