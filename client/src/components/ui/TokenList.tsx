// "use client";

// import React, { useEffect, useState } from "react";
// import { getPoolsInfo } from "@/utils";
// import { GetPoolsInfoApiResponse } from "../../types/index"
// import SpinnerWithStyles from "./Spinner"; // Optional loading spinner component

// const ALLOWED_POOL_IDS = "7XawhbbxtsRcQA8KTkHT9f9nc6d69UwqCDh6U5EEbEmX,HVNwzt7Pxfu76KHCMQPTLuTCLTm6WnQ1esLv4eizseSv,8vMrQrYEM5H5i6JKwntfSMbhZNtSgu2qBoM9cYqmFGE6,CbnU6a4gPqjrdQ5aNj6kufheDDRmrZ7apW1osaDPHQbY";

// export default function TokenList() {
//   const [tokenData, setTokenData] = useState<GetPoolsInfoApiResponse | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchTokenData = async () => {
//       try {
//         const data = await getPoolsInfo(ALLOWED_POOL_IDS);
//         console.log('data >>>>' , data)
//         if (data.success) {
//           setTokenData(data);
//         } else {
//           setError("Failed to fetch token data");
//         }
//       } catch (err) {
//         console.error("Error fetching token data:", err);
//         setError("An error occurred while fetching token data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTokenData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <SpinnerWithStyles />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p className="text-red-500">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold text-white mb-6">Token List & Prices</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//         {tokenData?.data.map((pool) => (
//           <div
//             key={pool.id}
//             className="bg-gray-800 text-white p-4 rounded-lg shadow-md"
//           >
//             <h2 className="text-lg font-semibold mb-2">
//               {pool.mintA.symbol} / {pool.mintB.symbol}
//             </h2>
//             <p>Price: ${pool.price.toFixed(2)}</p>
//             <p>Pool ID: {pool.id}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
