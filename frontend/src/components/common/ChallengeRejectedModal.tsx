import { useRealtime } from "../../context/RealtimeProvider";
import { UserMinus, X } from "lucide-react";

const ChallengeRejectedModal = () => {
  const { rejectedChallenge, setRejectedChallenge } = useRealtime();

  if (!rejectedChallenge?.open) return null;

  const handleClose = () => {
    setRejectedChallenge(null);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slideIn">
      <div className="bg-[#FAF3E0] rounded-2xl p-5 shadow-2xl border border-red-300 border-l-4 border-l-red-400 w-80 relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2 mb-1">
          <UserMinus className="w-5 h-5 text-red-500" /> Challenge Rejected
        </h3>

        <p className="text-sm text-gray-500 mb-4">
          Your challenge was declined by the opponent.
        </p>

        <div className="flex gap-2">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChallengeRejectedModal;
