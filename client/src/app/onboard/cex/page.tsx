// "use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";
// import image1 from '../../../public/images/banaza.png'
export default function CEXPage() {
  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-8">
      {/* Header Text */}
      <h1   className="text-center text-xss md:text-md font-semibold mb-6 text-gray-400">
        Transfer assets to your Solana wallet from a Centralized Exchange (CEX) <br />
        such as Binance, Coinbase, ByBit, or OKX.
      </h1>

      {/* Guides Buttons */}
      <div className="grid  sm:grid-cols-4 gap-1 mb-6 justify-center">
        {[
          {
            name: "BINANCE",
            url: "/images/binance_cex.svg",
            link : "https://www.binance.com/en/support/faq/how-to-withdraw-crypto-from-binance-115003670492"
          },
          {
            name: "coinbase",
            url: "/images/coinbase_cex.svg",
            link : "https://help.coinbase.com/en-gb/coinbase/trading-and-funding/buying-selling-or-converting-crypto/how-do-i-sell-or-cash-out-my-digital-currency"
          },
          {
            name: "BYBIT",
            url: "/images/bybit.svg",
            link : "https://www.bybit.com/en/help-center/article/How-to-submit-on-chain-withdrawal-request"
          },
          {
            name: "OKX",
            url: "/images/okx.svg",
            link : "https://www.okx.com/help/how-do-i-make-a-withdrawal-app#on-chain-withdrawal"
          },
        ].map((item) => (
          <a
            key={item.name}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center px-[28px] py-3  bg-v2-background-dark text-white text-md font-medium rounded-lg shadow-md transition"
          >
            <img  className="w-18 h-18" src={item.url} alt="" />
          
            <div className="text-gray-400 flex items-center text-sm mt-4">
              <span className="text-xs" >Read Guide</span> <ExternalLink  className="ml-1" size={"12px"} />
            </div>
          </a>
        ))}
      </div>

      {/* Steps Box */}
      <div className="  bg-v2-background-dark rounded-2xl shadow-2xl p-6 w-full max-w-[600px]">
        <h2 className="text-lg text-white font-semibold mb-4">
          How to bridge assets into Solana from a CEX
        </h2>

        <ul className="space-y-4">
          {[
            {
              step: 1,
              title: "Login to your CEX account",
              description: "Login and ensure you have the asset you want to transfer.",
            },
            {
              step: 2,
              title: "Select 'Withdraw'",
              description: "Click on the 'Withdraw' button next to your chosen asset.",
            },
            {
              step: 3,
              title: "Enter your Solana wallet address",
              description:
                "Ensure that you have already installed a Solana wallet. Paste your unique Solana wallet address in the 'Recipient's SOL Address' field.",
            },
            {
              step: 4,
              title: "Choose the Network",
              description: "Select the Solana network (SOL) for the transfer.",
            },
            {
              step: 5,
              title: "Enter the amount",
              description:
                "Input the amount of the cryptocurrency you wish to transfer. There is usually a minimum transfer amount and a withdrawal fee.",
            },
            {
              step: 6,
              title: "Verify details",
              description:
                "Ensure all details are correct. Verify your wallet address and that you're using the Solana network. If the wrong address is used, you won't be able to recover your assets.",
            },
            {
              step: 7,
              title: "Confirm the withdrawal",
              description: "Click on 'Withdraw' to initiate the transfer.",
            },
            {
              step: 8,
              title: "Await confirmation",
              description:
                "Wait for the CEX to process the transaction, which might take a few minutes.",
            },
            {
              step: 9,
              title: "Check that assets arrived",
              description: "Open your Solana wallet and check that your assets have arrived.",
            },
          ].map((item) => (
            <li key={item.step} className="flex gap-4 items-start">
              <div className="flex items-center justify-center w-5 h-5 text-xs font-bold text-cyan-400 bg-[#1A2B3E] rounded-full border border-cyan-400">
                {item.step}
              </div>
              <div className="flex-1">
                <h3 className="text-white leading-5 text-sm">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
