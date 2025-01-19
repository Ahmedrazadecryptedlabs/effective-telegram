import React, { useState } from "react";

export default function OnrampCard() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative flex flex-col items-center px-4 sm:px-0">
      <p className="py-6 text-center text-md font-bold text-gray-400">
        Onramp to Solana instantly!
      </p>

      <div className="relative w-full max-w-md">
        {/* Skeleton loader */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-700 animate-pulse rounded-lg z-10"></div>
        )}
        {/* Actual iframe */}
        <iframe
          src="https://buy.onramper.com?apiKey=pk_prod_41GGD8ENSBSM0EG0N0RKW2Y9ZZ&amp;themeName=dark&amp;containerColor=304256ff&amp;primaryColor=c7f284ff&amp;secondaryColor=2c4256ff&amp;cardColor=19232dff&amp;primaryTextColor=ffffff&amp;secondaryTextColor=ffffff&amp;borderRadius=1&amp;wgBorderRadius=1&amp;partnerContext=Jupiter&amp;successRedirectUrl=https%3A%2F%2Fjup.ag%2Fbridge%2Fonramp&amp;failureRedirectUrl=https%3A%2F%2Fjup.ag%2Fbridge%2Fonramp&amp;mode=buy&amp;defaultCrypto=sol&amp;onlyCryptoNetworks=solana&amp;networkWallets=&amp;supportOtcTxn=true&amp;excludeFiats=krw"
          title="Onramper Widget"
          height="630px"
          width="100%"
          allow="accelerometer; autoplay; camera; gyroscope; payment; microphone"
          className="rounded-lg"
          onLoad={() => setIsLoading(false)} // Hides skeleton when iframe loads
        ></iframe>
      </div>
    </div>
  );
}
