"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export default function SubTabs({ onSubTabChange }: { onSubTabChange: (subTab: string) => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Add loading state

  // Get the active tab from the pathname
  const activeSubTab = pathname.split("/").pop()?.toLowerCase() || "onramp";

  // Handle sub-tab click
  const handleSubTabClick = useCallback(
    async (subTab: string) => {
      const newPath = `/onboard/${subTab.toLowerCase()}`;
      if (pathname !== newPath) {
        setLoading(true); // Start loading
        try {
          onSubTabChange(subTab); // Update parent component
          await router.replace(newPath); // Navigate efficiently
        } finally {
          setLoading(false); // Stop loading
        }
      }
    },
    [onSubTabChange, pathname, router]
  );

  return (
    <div className="flex items-end justify-center bg-[#192531] h-16 w-full overflow-x-auto">
      <div className="flex space-x-4 md:space-x-8">
        {["Onramp", "USDC", "deBridge", "CEX"].map((subTab) => {
          const isActive = activeSubTab === subTab.toLowerCase();
          return (
            <div
              key={subTab}
              className={`px-3 pb-4 text-sm md:text-base font-bold cursor-pointer whitespace-nowrap ${
                isActive ? "text-cyan-400 border-b-2 border-cyan-400" : "text-gray-400"
              }`}
              onClick={() => handleSubTabClick(subTab)}
            >
              {loading && isActive ? "Loading..." : subTab} {/* Show loading */}
            </div>
          );
        })}
      </div>
    </div>
  );
}
