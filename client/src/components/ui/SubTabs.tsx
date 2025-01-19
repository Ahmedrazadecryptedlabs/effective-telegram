"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Link from 'next/link';

export default function SubTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const activeSubTab = pathname.split("/").pop()?.toLowerCase() || "onramp";

  const handleSubTabClick = async (subTab: string) => {
    const newPath = `/onboard/${subTab.toLowerCase()}`;
    if (pathname !== newPath) {
      setLoading(true);
      try {
        await router.push(newPath);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex items-end justify-center bg-[#192531] h-16 w-full overflow-x-auto">
      <div className="flex space-x-4 md:space-x-8">
        {["Onramp", "USDC", "deBridge", "CEX"].map((subTab) => {
          const isActive = activeSubTab === subTab.toLowerCase();
          return (
            <Link 
            key={subTab}
            href={`/onboard/${subTab.toLowerCase()}`}
            className={`px-3 pb-4 text-sm md:text-base font-bold cursor-pointer whitespace-nowrap ${
              isActive ? "text-cyan-400 border-b-2 border-cyan-400" : "text-gray-400"
            }`}
          >
            {loading && isActive ? "Loading..." : subTab}
          </Link>          
          );
        })}
      </div>
    </div>
  );
}