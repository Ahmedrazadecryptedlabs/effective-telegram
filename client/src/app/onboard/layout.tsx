"use client";

import TopNavigation from "@/components/ui/TopNavigation";
import SubTabs from "@/components/ui/SubTabs";
import { useRouter } from "next/navigation";

export default function OnboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleSubTabChange = (subTab: string) => {
    // Dynamically navigate to the selected sub-tab
    router.push(`/onboard/${subTab.toLowerCase()}`);
  };

  return (
    <div className="bg-gray-800 min-h-screen flex flex-col">
      <TopNavigation />
      <SubTabs onSubTabChange={handleSubTabChange} />
      <div className="flex-grow p-4">{children}</div>
    </div>
  );
}
