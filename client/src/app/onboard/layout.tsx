"use client";

import TopNavigation from "@/components/ui/TopNavigation";
import SubTabs from "@/components/ui/SubTabs";

export default function OnboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-800 min-h-screen flex flex-col">
      <TopNavigation />
      <SubTabs />
      <div className="flex-grow p-4">{children}</div>
    </div>
  );
}