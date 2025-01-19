import React, { useState } from "react";

interface ReusableButtonProps {
  text: string;
  onClick: () => void;
  marginTop?: string; // Optional marginTop prop
}

export const ReusableButton: React.FC<ReusableButtonProps> = ({ text, onClick, marginTop }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-5 text-primary rounded-xl font-bold text-md bg-primary/10 border-cyan-400 border border-transparent hover:border-cyan-400 ${marginTop}`}
    >
      {text}
    </button>
  );
};

