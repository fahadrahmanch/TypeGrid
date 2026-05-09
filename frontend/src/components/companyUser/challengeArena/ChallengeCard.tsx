import { useState } from "react";
import { CheckCircle2, Clock, Zap, Target, Swords } from "lucide-react";
import { challengeAccept, challengeReject } from "../../../api/companyUser/challenge";
import { socket } from "../../../socket";
import { CompletedChallenge } from "./types";
const ChallengeCard = ({ challenge }: { challenge: any }) => {
  const [hasJoined, setHasJoined] = useState(false);
  const [localAccepted, setLocalAccepted] = useState(false);
  // Determine card styling based on status
  const isCompleted = challenge.status === "completed";
  const isSent = challenge.type === "sent";
  const isReceived = challenge.type === "received";
  const isAccepted = challenge.status === "accepted" || localAccepted;
  const isPending = challenge.status === "pending" && !localAccepted;
  const isWaiting = challenge.status === "waiting" && !localAccepted;
  const isOngoing = challenge.status === "ongoing";

  let statusStyle = "";
  let statusIcon = null;
  let statusText: string = localAccepted ? "accepted" : challenge.status;

  if (isCompleted) {
    statusStyle = "bg-blue-50 text-blue-700 border-blue-200";
    statusIcon = <CheckCircle2 className="w-3.5 h-3.5" />;
    statusText = "Completed";
  } else if (isPending) {
    statusStyle = "bg-yellow-50 text-yellow-700 border-yellow-200";
    statusIcon = <Clock className="w-3.5 h-3.5" />;
    statusText = "Pending";
  } else if (isAccepted) {
    statusStyle = "bg-green-50 text-green-700 border-green-200";
    statusIcon = <CheckCircle2 className="w-3.5 h-3.5" />;
    statusText = "Accepted";
  } else if (isWaiting) {
    statusStyle = "bg-blue-50 text-indigo-600 border-indigo-200";
    statusIcon = <Clock className="w-3.5 h-3.5" />;
    statusText = "Waiting to Join";
  }
  async function handleAccept(challengeId: string, senderId: string) {
    try {
      const response = await challengeAccept(challengeId);

      if (response?.data?.success) {
        setHasJoined(false);
        setLocalAccepted(true);

        socket.emit("challenge-accepted", {
          challengeId,
          senderId,
        });
      }
    } catch (error) {
      console.error("Error accepting challenge:", error);
    }
  }
  async function handleJoinmatch(challengeId: string) {
    try {
      setHasJoined(true);

      socket.emit("join-match", {
        challengeId: String(challengeId),
      });
    } catch (error) {
      console.error("Error joining match:", error);
    }
  }

  async function handleReject(challengeId: string) {
    try {
      const response = await challengeReject(challengeId);

      if (response?.data?.success) {
        setHasJoined(false);
        setLocalAccepted(false);
      }
    } catch (error) {
      console.error("Error rejecting challenge:", error);
    }
  }
  if (isOngoing) return null;

  return (
    <div
      className={`bg-[#FAF3E0] rounded-xl md:rounded-2xl p-2 md:p-6 shadow-sm border flex flex-col transition-all hover:shadow-md ${isAccepted ? "border-green-300 border-l-2 md:border-l-4 border-l-green-400" : isWaiting ? "border-indigo-200 border-l-2 md:border-l-4 border-l-indigo-400" : isPending && isSent ? "border-[#EBE3D5] border-l-2 md:border-l-4 border-l-yellow-400" : "border-[#EBE3D5]"}`}
    >
      {/* Header: User Info & Badge */}
      <div className="flex flex-col justify-between items-center mb-3 md:mb-6 gap-2">
        <div className="flex flex-col items-center gap-1 md:gap-4 md:flex-row md:items-center w-full">
          <img
            src={challenge.opponent.avatar}
            alt={challenge.opponent.name}
            className="w-8 h-8 md:w-14 md:h-14 rounded-lg md:rounded-xl object-cover border border-white shadow-sm"
          />
          <div className="min-w-0 text-center md:text-left">
            <h3 className="font-bold text-gray-900 leading-tight text-[10px] md:text-base truncate">{challenge.opponent.name}</h3>
            <p className="text-[8px] md:text-xs font-medium text-indigo-500 truncate">{challenge.opponent.role}</p>
          </div>
        </div>
        <div className={`px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-full text-[6px] md:text-xs font-bold border flex items-center gap-0.5 md:gap-1.5 ${statusStyle}`}>
          {statusIcon} <span className="capitalize">{statusText.length > 8 ? statusText.slice(0, 8) + "..." : statusText}</span>
        </div>
      </div>

      {/* Middle: Details Row */}
      <div className="grid grid-cols-3 gap-1 md:gap-3 mb-3 md:mb-6">
        <div className="bg-white/60 rounded-lg md:rounded-xl py-1 md:py-3 px-0.5 md:px-2 flex flex-col items-center justify-center text-center">
          <Zap className="w-2.5 md:w-4 h-2.5 md:h-4 text-indigo-500 mb-0.5" />
          <span className="text-[6px] md:text-[11px] font-bold text-gray-400 mb-0.5 uppercase tracking-tighter">Diff</span>
          <span className="text-[8px] md:text-sm font-bold text-indigo-600 capitalize truncate">{challenge.difficulty}</span>
        </div>
        <div className="bg-white/60 rounded-lg md:rounded-xl py-1 md:py-3 px-0.5 md:px-2 flex flex-col items-center justify-center text-center">
          <Clock className="w-2.5 md:w-4 h-2.5 md:h-4 text-purple-500 mb-0.5" />
          <span className="text-[6px] md:text-[11px] font-bold text-gray-400 mb-0.5 uppercase tracking-tighter">Time</span>
          <span className="text-[8px] md:text-sm font-black text-purple-600 leading-none">
            {challenge.durationSeconds / 60}<span className="text-[6px]">m</span>
          </span>
        </div>
        <div className="bg-white/60 rounded-lg md:rounded-xl py-1 md:py-3 px-0.5 md:px-2 flex flex-col items-center justify-center text-center">
          <Target className="w-2.5 md:w-4 h-2.5 md:h-4 text-pink-500 mb-0.5" />
          <span className="text-[6px] md:text-[11px] font-bold text-gray-400 mb-0.5 uppercase tracking-tighter">Type</span>
          <span className="text-[8px] md:text-sm font-bold text-pink-600 capitalize truncate">{challenge.type}</span>
        </div>
      </div>

      {/* Bottom: Result / Actions */}
      {isCompleted ? (
        <div className="mt-auto">
          <div className="bg-[#E5DFD3]/50 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="font-bold text-gray-600">Result</span>
              <span
                className={`font-black ${(challenge as CompletedChallenge).result === "won" ? "text-green-600" : "text-red-500"}`}
              >
                🏆 You {(challenge as CompletedChallenge).result === "won" ? "Won!" : "Lost"}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium">Your WPM:</span>{" "}
                <span className="text-gray-900">{(challenge as CompletedChallenge).yourWpm}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium">Their WPM:</span>{" "}
                <span className="text-gray-900">{(challenge as CompletedChallenge).theirWpm}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 py-2.5 bg-[#1DCE6C] hover:bg-[#1ab860] text-white rounded-xl font-bold text-sm transition-colors shadow-sm">
              Rematch
            </button>
            <button className="flex-1 py-2.5 bg-[#E5DFD3] hover:bg-[#d8d2c6] text-gray-700 rounded-xl font-bold text-sm transition-colors">
              View Details
            </button>
          </div>
        </div>
      ) : isAccepted ? (
        <div className="mt-auto">
          {hasJoined ? (
            <div className="text-center text-sm font-bold text-indigo-600/80 mb-4 bg-indigo-50 py-2 rounded-lg">
              Waiting for opponent to join...
            </div>
          ) : (
            <button
              onClick={() => handleJoinmatch(challenge.id)}
              className="w-full py-3 bg-[#1DCE6C] hover:bg-[#1ab860] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Swords className="w-4 h-4" /> Join Match
            </button>
          )}
        </div>
      ) : isPending && isReceived ? (
        <div className="mt-auto flex flex-col gap-1.5 md:gap-3">
          <button
            onClick={() => handleReject(challenge.id)}
            className="w-full py-1.5 md:py-3 bg-white border border-[#EBE3D5] text-gray-600 hover:bg-gray-50 rounded-lg md:rounded-xl font-bold text-[9px] md:text-sm transition-colors"
          >
            Decline
          </button>
          <button
            onClick={() => handleAccept(challenge.id, challenge.senderId)}
            className="w-full py-1.5 md:py-3 bg-[#1DCE6C] hover:bg-[#1ab860] text-white rounded-lg md:rounded-xl font-bold text-[9px] md:text-sm transition-colors shadow-sm"
          >
            Accept
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default ChallengeCard;
