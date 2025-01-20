"use client";
import { wormholeConnectHosted } from "@wormhole-foundation/wormhole-connect";

export default function DynamicConnectWalletComponent() {
  useEffect(() => {
    const container = document.getElementById("wormhole-connect");
    if (!container) {
      console.error("Container element not found");
      return;
    }

    wormholeConnectHosted(container, {
      config: {
        network: "Testnet", // Choose "Mainnet", "Testnet", or "Devnet"
        chains: ["Ethereum", "Solana"], // Specify chains to include
        rpcs: {
          Solana: "https://api.devnet.solana.com",
          Ethereum: "https://rpc.ankr.com/eth",
        },
      },
      theme: {
        background: {
          default: "#212b4a", // Custom background color
        },
      },
    });
  }, []); // Ensure this runs once when the component mounts
  return (
    <div>
      <h1>My Wormhole Connect App</h1>
      <div id="wormhole-connect"></div> {/* Mount point for WormholeConnect */}
    </div>
  );
}
