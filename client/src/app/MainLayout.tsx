"use client";

import React from "react";
import TopNavigation from "@/components/ui/TopNavigation";
import SpotPage from "../components/ui/SpotPage";
// import TokenList from "@/components/ui/TokenList";

const MainLayout: React.FC = () => {
  return (
    <div className="w-full text-white">
      {/* Top Navigation */}
      <div className="w-full">
        <TopNavigation />
      </div>
      <SpotPage />
    </div>
  );
};

export default MainLayout;
