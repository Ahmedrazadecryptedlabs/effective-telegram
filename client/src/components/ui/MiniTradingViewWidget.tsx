import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const MiniTradingViewWidget: React.FC = () => {
  // Data for the charts
  const usdcData = {
    labels: Array(30).fill(""),
    datasets: [
      {
        data: Array.from({ length: 30 }, () =>  0.4 + 215.5), // Even smaller fluctuation for SOL
        borderColor: "#F3BA2F", // Yellow Line
        borderWidth: 1.2,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const solData = {
    labels: Array(30).fill(""),
    datasets: [
      {
        data: Array.from({ length: 30 }, () => 112 * 0.000005 + 0.99998), // Extremely small fluctuation for USDC

        borderColor: "#1E90FF", // Blue Line
        borderWidth: 1.2,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: 0.4, // Smooth line
      },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="bg-[#1B202D] p-3 flex justify-between flex-col rounded-xl ">
      {/* USDC Section */}
      <div className="flex items-center justify-between  rounded-lg">
        <div className="flex items-center space-x-3">
          <img
            src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
            alt="USDC"
            className="w-6 h-6 rounded-full"
          />
          <div>
            <p className="text-white font-semibold text-sm">USDC</p>
            <p className="text-gray-400 text-xs">EPJF...TDt1v</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 w-2/4 h-12">
          <div className="w-4/5 h-12">
            <div className="flex items-center space-x-1w-full justify-between">
              <p className="text-white text-sm font-bold">0.999955</p>
              <p className="text-green-400 text-xs font-medium">+0.007%</p>
            </div>
            <Line data={usdcData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* SOL Section */}
      <div className="flex items-center justify-between   rounded-lg">
        <div className="flex items-center space-x-3">
          <img
            src="https://cryptologos.cc/logos/solana-sol-logo.png"
            alt="SOL"
            className="w-6 h-6 rounded-full"
          />
          <div>
            <p className="text-white font-semibold text-sm">SOL</p>
            <p className="text-gray-400 text-xs">So111...11112</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 w-2/4 h-12">
          <div className="w-4/5 h-12">
            <div className="flex items-center space-x-1 w-full justify-between">
              <p className="text-white text-sm font-bold">216.08</p>
              <p className="text-green-400 text-xs font-medium">+7.3%</p>
            </div>
            <Line data={solData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniTradingViewWidget;
