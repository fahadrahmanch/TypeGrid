import { useRealtime } from "../../context/RealtimeProvider";
import { getAllChallenges } from "../../api/companyUser/challenge";
import { useState, useEffect } from "react";
import { socket } from "../../socket";
import { X } from "lucide-react";
const ChallengeModal = () => {
  const { challengeModal, setChallengeModal } = useRealtime();

  const [challenge, setChallenge] = useState<any>(null);
  const [waiting, setWaiting] = useState(false);
  useEffect(() => {
    async function getChallenge() {
      if (!challengeModal?.challengeId) return;
      try {
        const response = await getAllChallenges();
        if (response.data?.data) {
          const findChallenge = response.data.data.find(
            (c: any) => c._id === challengeModal.challengeId || c.id === challengeModal.challengeId
          );
          setChallenge(findChallenge);
        }
      } catch (error) {
        console.error("Error fetching challenge details:", error);
      }
    }

    if (challengeModal?.open) {
      getChallenge();
    }
  }, [challengeModal]);

  const handleJoinMatch = () => {
    setWaiting(true);
    const roomId = String(challengeModal.challengeId);

    socket.emit("join-match", {
      challengeId: roomId,
      receiverId: challenge.receiverId,
    });
  };
  if (!challengeModal?.open) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:bottom-6 md:right-6 md:left-auto z-[100] animate-slideIn">
      <div
        className={`bg-[#FAF3E0] rounded-[1.5rem] p-4 md:p-5 shadow-2xl border flex flex-col transition-all w-auto md:w-80 
        border-green-300 border-l-4 border-l-green-400 relative backdrop-blur-xl bg-white/90`}
      >
        {/* Close Button */}
        <button
          onClick={() => setChallengeModal(null)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        {!challengeModal.waiting ? (
          <div className="mb-3 md:mb-4 pr-6">
            <h3 className="font-extrabold text-gray-900 text-base md:text-lg leading-tight flex items-center gap-2">
              <span className="text-lg md:text-xl">⚔️</span> Challenge Accepted!
            </h3>
            <p className="text-[11px] md:text-sm font-medium text-gray-500 mt-1">
              Opponent accepted your challenge. Join the match now.
            </p>
          </div>
        ) : (
          <div className="mb-3 md:mb-4 pr-6">
            <h3 className="font-extrabold text-gray-900 text-base md:text-lg leading-tight flex items-center gap-2">
              <span className="text-lg md:text-xl">⚔️</span> Waiting for opponent...
            </h3>
            <p className="text-[11px] md:text-sm font-medium text-gray-500 mt-1">Opponent joined the match</p>
          </div>
        )}

        {/* User Info & Badge */}
        {challenge ? (
          <div className="bg-white/60 rounded-xl p-2.5 md:p-3 mb-4 shadow-sm border border-white/40">
            <div className="flex gap-3 md:gap-4 items-center">
              <img
                src={challenge.opponent?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
                alt={challenge.opponent?.name || "Opponent"}
                className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl object-cover border-2 border-white shadow-sm"
              />
              <div className="overflow-hidden">
                <h3 className="font-bold text-gray-900 leading-tight text-xs md:text-sm truncate">
                  {challenge.opponent?.name || "Opponent"}
                </h3>
                <p className="text-[9px] md:text-xs font-semibold text-indigo-500 truncate">
                  {challenge.opponent?.companyRole || challenge.opponent?.role || "Challenger"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center py-4 md:py-6 mb-2">
            <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-green-500"></div>
          </div>
        )}

        <button
          onClick={() => {
            handleJoinMatch();
          }}
          disabled={!challenge}
          className="w-full py-2.5 md:py-3 bg-[#1DCE6C] hover:bg-[#1ab860] disabled:bg-[#1DCE6C]/50 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm text-xs md:text-sm"
        >
          {waiting ? "Waiting..." : "Join Match"}
        </button>
      </div>
    </div>
  );
};

export default ChallengeModal;
