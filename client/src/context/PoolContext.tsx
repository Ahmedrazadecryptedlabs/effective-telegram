"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getPoolsInfo } from "@/utils";
import { Token } from "@/types";

const ALLOWED_POOL_IDS = "7XawhbbxtsRcQA8KTkHT9f9nc6d69UwqCDh6U5EEbEmX,HVNwzt7Pxfu76KHCMQPTLuTCLTm6WnQ1esLv4eizseSv,8vMrQrYEM5H5i6JKwntfSMbhZNtSgu2qBoM9cYqmFGE6,CbnU6a4gPqjrdQ5aNj6kufheDDRmrZ7apW1osaDPHQbY";

interface PoolContextType {
  tokenList: Token[];
  tokenListLoading: boolean;
}

const PoolContext = createContext<PoolContextType | undefined>(undefined);

export const PoolProvider = ({ children }: { children: ReactNode }) => {
    const [tokenList, setTokenList] = useState<Token[]>([]);
    const [tokenListLoading, setTokenListLoading] = useState(true);
    
  useEffect(() => {
    const fetchPoolData = async () => {
      try {
        setTokenListLoading(true);
        const data = await getPoolsInfo(ALLOWED_POOL_IDS);
        setTokenList(data); // Set tokenList to the returned data
      } catch (err) {
        console.error(err);
        setTokenList([]); // Fallback to empty array on error
      } finally {
        setTokenListLoading(false);
      }
    };

    fetchPoolData();
  }, []);


  return (
    <PoolContext.Provider value={{ tokenList, tokenListLoading }}>
      {children}
    </PoolContext.Provider>
  );
};

export const usePoolContext = (): PoolContextType => {
  const context = useContext(PoolContext);
  if (!context) {
    throw new Error("usePoolContext must be used within a PoolProvider");
  }
  return context;
};
