import React, { useState } from "react";

interface DatePickerComponentProps {
  label: string;
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({ label }) => {
  const [isStartNow, setIsStartNow] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleStartNowClick = () => {
    setIsStartNow(false);
  };

  const handleReset = () => {
    setSelectedDate(null);
    setIsStartNow(true);
  };

  return (
    <div className="relative bg-[#131B24] text-white p-4 rounded-lg h-20  shadow-md w-full">
      {/* Label and Reset */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-400">{label}</span>
        {!isStartNow && (
          <button
            className="text-xs text-gray-400 underline hover:text-white"
            onClick={handleReset}
          >
            Reset
          </button>
        )}
      </div>

      {/* Main Content */}
      {isStartNow ? (
        <div className="flex justify-between items-stretch">
          <span className="text-sm font-bold">Start Now</span>
          <button
            className="text-xs text-gray-400 underline hover:text-white"
            onClick={handleStartNowClick}
          >
            Start Date
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
        <input
        type="date"
        value={selectedDate || ""}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="bg-transparent text-sm font-bold text-white focus:outline-none w-full"
      />
         
        </div>
      )}
    </div>
  );
};

export default DatePickerComponent;
