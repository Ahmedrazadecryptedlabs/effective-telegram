"use client";
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const DynamicWormholeConnect = dynamic(() => import('@wormhole-foundation/wormhole-connect'), {
  ssr: false,
});

export default function USDCPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Enable rendering after hydration
  }, []);

  const config = {
    chains: ['Ethereum', 'Solana'],
  };

  return (
    <div className="text-white text-center mt-8">
      <h1 className="text-2xl font-bold">USDC Page</h1>
      {/* {isClient && <DynamicWormholeConnect  />} */}
    </div>
  );
}
