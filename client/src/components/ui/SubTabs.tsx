"use client";

import { usePathname, useRouter } from "next/navigation";

export default function SubTabs({ onSubTabChange }: { onSubTabChange: (subTab: string) => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const activeSubTab = pathname.split("/").pop() || "onramp";

  const handleSubTabClick = (subTab: string) => {
    onSubTabChange(subTab);
    router.push(`/onboard/${subTab.toLowerCase()}`);
  };

  return (
    <div className="flex items-end justify-center bg-[#192531] h-16 w-full overflow-x-auto">
      <div className="flex space-x-4 md:space-x-8">
        {["Onramp", "USDC", "deBridge", "CEX"].map((subTab) => (
          <div
            key={subTab}
            className={`px-3 pb-4 text-sm md:text-base font-bold cursor-pointer whitespace-nowrap ${
              activeSubTab.toLowerCase() === subTab.toLowerCase()
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-gray-400"
            }`}
            onClick={() => handleSubTabClick(subTab)}
          >
            {subTab}
          </div>
        ))}
      </div>
    </div>
  );
}