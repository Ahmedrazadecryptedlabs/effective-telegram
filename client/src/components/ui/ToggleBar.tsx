import React from "react";
import { AlignHorizontalDistributeCenter, Clock } from "lucide-react";

interface MenuBarProps {
  activeItem: string;
  setActiveItem: (item: string) => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ activeItem, setActiveItem }) => {
  const menuItems = [
    { label: "Swap" },
    { label: "Limit" },
    { label: "DCA" },
    { label: "VA" },
  ];

  return (
    <div className="flex items-center justify-between rounded-full w-full">
      {/* Left Menu Buttons */}
      <div className="flex items-between justify-between bg-[#192230] rounded-full px-2 py-2 w-3/4">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => setActiveItem(item.label)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all 
              ${
                activeItem === item.label
                  ? "bg-primary text-[#131A26]"
                  : "bg-transparent text-white hover:text-cyan-400"
              }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center space-x-1">
        <button className="w-10 h-10 flex items-center justify-center bg-[#303D4F] rounded-full hover:bg-[]">
          <AlignHorizontalDistributeCenter className="text-cyan-400" size={17} />
        </button>
        <button className="w-10 h-10 flex items-center justify-center bg-[#303D4F] rounded-full hover:bg-[]">
          <Clock className="text-white" size={17} />
        </button>
      </div>
    </div>
  );
};

export default MenuBar;
