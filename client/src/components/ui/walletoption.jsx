export const WalletOption = ({ icon, name, onClick }) => (
    <button
      className="flex items-center justify-start w-full p-4 mb-2 bg-[#1C2A3A] hover:bg-[#2C3A4A] rounded-lg text-white transition-colors"
      onClick={onClick}
    >
      <img src={icon} alt={name} className="w-6 h-6 mr-3" />
      <span className="font-medium">{name}</span>
    </button>
  );