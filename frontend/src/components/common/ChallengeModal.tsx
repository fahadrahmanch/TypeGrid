import { useRealtime } from "../../context/RealtimeProvider";
import { useNavigate } from "react-router-dom";
import { getAllChallenges } from "../../api/companyUser/challenge";
import { useState, useEffect } from "react";
import { Swords, X, Zap, Clock, Target } from "lucide-react";
import { socket } from "../../socket";
const ChallengeModal = () => {
    const { challengeModal, setChallengeModal } = useRealtime();
    const navigate = useNavigate();

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
            const roomId = String(challengeModal.challengeId)

        socket.emit("join-match", { challengeId: roomId });
    };


    if (!challengeModal?.open) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-slideIn">
            <div className={`bg-[#FAF3E0] rounded-2xl p-5 shadow-2xl border flex flex-col transition-all w-80 
        border-green-300 border-l-4 border-l-green-400 relative`}>

                {/* Close Button */}
                <button
                    onClick={() => setChallengeModal(null)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-4 pr-6">
                    <h3 className="font-extrabold text-gray-900 text-lg leading-tight flex items-center gap-2">
                        <span className="text-xl">⚔️</span> Challenge Accepted!
                    </h3>
                    <p className="text-sm font-medium text-gray-500 mt-1">
                        Opponent is ready. Join the match now.
                    </p>
                </div>

                {/* User Info & Badge */}
                {challenge ? (
                    <div className="bg-white/60 rounded-xl p-3 mb-4 shadow-sm border border-white/40">
                        <div className="flex gap-4 items-center mb-3">
                            <img
                                src={challenge.opponent?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
                                alt={challenge.opponent?.name || "Opponent"}
                                className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-sm"
                            />
                            <div>
                                <h3 className="font-bold text-gray-900 leading-tight">
                                    {challenge.opponent?.name || "Opponent"}
                                </h3>
                                <p className="text-xs font-semibold text-indigo-500 line-clamp-1">
                                    {challenge.opponent?.companyRole || challenge.opponent?.role || "Challenger"}
                                </p>
                            </div>
                        </div>

                        {/* Details Row */}
                        <div className="flex justify-between items-center bg-white/80 rounded-lg p-2.5">
                            <div className="flex flex-col items-center flex-1 border-r border-gray-200 last:border-0 text-center px-1">
                                <Zap className="w-3.5 h-3.5 text-indigo-500 mb-0.5" />
                                <span className="text-[10px] font-bold text-indigo-600 capitalize">
                                    {challenge.difficulty || "Medium"}
                                </span>
                            </div>
                            <div className="flex flex-col items-center flex-1 border-r border-gray-200 last:border-0 text-center px-1">
                                <Clock className="w-3.5 h-3.5 text-purple-500 mb-0.5" />
                                <span className="text-[10px] font-bold text-purple-600 uppercase">
                                    {(challenge.durationSeconds ? challenge.durationSeconds / 60 : 1)}m
                                </span>
                            </div>
                            <div className="flex flex-col items-center flex-1 border-r border-gray-200 last:border-0 text-center px-1">
                                <Target className="w-3.5 h-3.5 text-pink-500 mb-0.5" />
                                <span className="text-[10px] font-bold text-pink-600 capitalize">
                                    {challenge.type || "Challenge"}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center items-center py-6 mb-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                    </div>
                )}

                <button
                    
onClick={() => {
   handleJoinMatch();
}}
                    disabled={!challenge}
                    className="w-full py-3 bg-[#1DCE6C] hover:bg-[#1ab860] disabled:bg-[#1DCE6C]/50 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                   {waiting ? "Waiting for opponent..." : "Join Match"}
                </button>

            </div>
        </div>
    );
};

export default ChallengeModal;