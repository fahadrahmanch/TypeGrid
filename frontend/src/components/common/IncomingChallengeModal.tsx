// src/components/companyUser/IncomingChallengeModal.tsx
import { useRealtime } from "../../context/RealtimeProvider";
import { socket } from "../../socket";
import { Swords, X } from "lucide-react";
import { challengeAccept } from "../../api/companyUser/challenge";

const IncomingChallengeModal = () => {
  const { incomingChallenge, setIncomingChallenge } = useRealtime();

  if (!incomingChallenge?.open) return null;

  const { challenge } = incomingChallenge;
  const handleAccept = async() => {
   const response = await challengeAccept(challenge?.challenge?.id);
     if (response?.data?.success) {
           socket.emit("challenge-accepted", {
                    challengeId:challenge?.challenge?.id,
                    senderId:challenge?.challenge?.senderId,
                  });
         }
    setIncomingChallenge(null);
    
  };

  const handleReject = () => {
    socket.emit("challenge-response", {
      challengeId: challenge.id,
      status: "rejected",
    });
    setIncomingChallenge(null);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slideIn">
      <div className="bg-[#FAF3E0] rounded-2xl p-5 shadow-2xl border border-indigo-300 border-l-4 border-l-indigo-400 w-80 relative">
        <button
          onClick={() => setIncomingChallenge(null)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2 mb-1">
          <Swords className="w-5 h-5" /> Challenge Received!
        </h3>

        <p className="text-sm text-gray-500 mb-4">
          <span className="font-bold text-gray-700">
            {challenge.opponent?.name}
          </span>{" "}
          challenged you to a typing match.
        </p>

        <div className="flex gap-2">
          <button
            onClick={handleReject}
            className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingChallengeModal;