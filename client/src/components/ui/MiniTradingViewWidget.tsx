import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { ExternalLink } from "lucide-react";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const MiniTradingViewWidget: React.FC = () => {
  // Data for the charts
  const usdcData = {
    labels: Array(30).fill(""),
    datasets: [
      {
        data: Array.from({ length: 30 }, () => 1 + Math.random() * 0.001 - 0.0005),
        borderColor: "#1E90FF", // Blue Line
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
        data: Array.from({ length: 30 }, () => 1 + Math.random()   * 0.001 - 0.0005),
        borderColor: "#F3BA2F", // Yellow Line
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
    <div className="bg-[#1B202D] px-4 py-3 flex flex-col gap-2 rounded-xl">
      {/* USDC Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
            alt="USDC"
            className="w-6 h-w-6 rounded-full"
          />
          <div >
            <p className="text-white font-semibold text-sm">USDC</p>
            <p className="text-white text-xxs bg-[#000000] flex items-center px-1 py-[2px] rounded-sm">EPJF...TDt1v <ExternalLink className="mx-1 w-[9px] h-[9px]" /></p>
          </div>
        </div>
        <div className="flex flex-col  w-2/4">
          <div  className="flex  w-9/12 justify-between" >
          <p className="text-white text-sm font-bold">1.00</p>
          <p className="text-green-400 text-xs font-medium">+0.008%</p>
          </div>
          <div className="h-2 w-full">
            <Line data={usdcData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* SOL Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src="https://wsrv.nl/?w=48&h=48&url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.pn6"
            alt="SOL"
            className="w-6 h-6 rounded-full"
          />
          <div>
            <p className="text-white font-semibold text-sm">SOL</p>
            <p className="text-white text-xxs bg-[#000000] flex items-center px-1 py-[2px] rounded-sm">So111...11112 <ExternalLink className="mx-1 w-[9px] h-[9px]" /> </p>
          </div>
        </div>
        <div   className="flex flex-col  w-2/4">
        <div   className="flex  w-9/12 justify-between" >
        <p className="text-white text-sm font-bold">272.64</p>
        <p className="text-green-400 text-xs font-medium">+8.3%</p>
        </div>
          <div className="h-2 w-full">
            <Line data={solData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniTradingViewWidget;
