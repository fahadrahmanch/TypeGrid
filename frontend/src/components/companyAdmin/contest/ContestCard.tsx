import React from "react";
import { useEffect } from "react";
import { Users, Clock, Calendar } from "lucide-react";
import { updateContestStatus } from "../../../api/companyAdmin/companyContextAPI";
import { useState } from "react";
import {
  ContestStatus,
  ContestLevel,
  ContestProps,
} from "../../../types/contest";
import { socket } from "../../../socket";
import ContestDetailsModal from "./ContestDetailsModal";
import ContestLobbyModal from "./ContestLobbyModal";
import LiveMonitorModal from "./LiveMonitorModal";
import ContestResultsModal from "./ContestResultsModal";
// Helper to determine status style
const getStatusStyle = (status: ContestStatus) => {
  switch (status) {
    case "waiting":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "ongoing":
    case "active":
      return "bg-[#FFF4EC] text-[#D0864B] border-[#FADDB8] animate-pulse";
    case "upcoming":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "completed":
      return "bg-slate-100 text-slate-800 border-slate-200";
    default:
      return "bg-slate-50 text-slate-800";
  }
};

const getLevelBadge = (level: ContestLevel) => {
  switch (level) {
    case "easy":
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-50 text-[#D0864B] border border-orange-100">
          Easy
        </span>
      );
    case "medium":
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-50 text-[#D0864B] border border-orange-100">
          Intermediate
        </span>
      );
    case "hard":
      return (
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-50 text-[#D0864B] border border-orange-100">
          Advanced
        </span>
      );
  }
};

const ContestCard: React.FC<ContestProps> = ({
  title,
  status,
  participants,
  maxParticipants,
  duration,
  level,
  id,
  prize,
  rewards,
  startTime,
  type,
  setContests,
}) => {
  const participantsCount = participants?.length || 0;
  const [contestStatus, setContestStatus] = useState<ContestStatus>(status);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLobbyModalOpen, setIsLobbyModalOpen] = useState(false);
  const [isLiveMonitorOpen, setIsLiveMonitorOpen] = useState(false);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);

  useEffect(() => {
    setContestStatus(status);
  }, [status]);
  async function handleEndContest() {
    socket.emit("end-contest", {
      contestId: id,
      status: "completed",
    });
  }

  const changeStatus = async (id: string, status: ContestStatus) => {
    try {
      const response = await updateContestStatus(id, status);
      const data = response.data;
      if (data.success) {
        setContestStatus(data.status);
        socket.emit("contest-status-updated", {
          contestId: id,
          status: data.status,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#fff8ea]/60 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_10px_30px_rgb(236,164,104,0.04)] border border-[#ECA468]/10 hover:shadow-[0_20px_50px_rgb(236,164,104,0.08)] transition-all duration-500 relative overflow-hidden group">
      {/* Contest Status Line - Top */}
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-lg font-black text-slate-800 group-hover:text-[#ECA468] transition-colors">
          {title}
        </h3>

        <span
          className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-xl border ${getStatusStyle(
            contestStatus,
          )}`}
        >
          {contestStatus}
        </span>
        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
          {type === "open" ? "Open" : "Group"}
        </span>

        {startTime && (
          <div className="flex items-center text-gray-400 text-xs ml-auto">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(startTime).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-gray-600 mb-6">
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-gray-400" />
          <span>
            <span className="font-semibold text-gray-900">
              {participantsCount}
            </span>
            <span className="text-gray-400">
              /{maxParticipants} participants
            </span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{Math.floor(duration / 60)} minutes</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400">Level:</span>
          {getLevelBadge(level)}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
        <div className="flex gap-3">
          {contestStatus === "waiting" && (
            <>
              <button
                onClick={() => setIsLobbyModalOpen(true)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-colors"
              >
                Lobby
              </button>
              <button
                onClick={() => changeStatus(id, "ongoing")}
                className="px-4 py-2 bg-[#ECA468] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#D0864B] transition-colors shadow-sm shadow-[#ECA468]/20"
              >
                Start Contest
              </button>
            </>
          )}

          {(contestStatus === "ongoing" || contestStatus === "active") && (
            <>
              <button
                onClick={() => setIsLiveMonitorOpen(true)}
                className="px-4 py-2 bg-[#7D6B5D] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#635449] transition-colors shadow-sm"
              >
                Live Monitor
              </button>
              <button
                onClick={handleEndContest}
                className="px-4 py-2 bg-[#ECA468] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#D0864B] transition-colors shadow-sm shadow-[#ECA468]/20"
              >
                End Contest
              </button>
            </>
          )}

          {(contestStatus === "upcoming" || contestStatus === "completed") && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-colors"
            >
              Details
            </button>
          )}
          {contestStatus === "upcoming" && (
            <button
              onClick={() => changeStatus(id, "waiting")}
              className="px-4 py-2 bg-amber-500 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-amber-600 transition-colors shadow-sm"
            >
              Wait Mode
            </button>
          )}
          {contestStatus === "completed" && (
            <button
              onClick={() => setIsResultsModalOpen(true)}
              className="px-4 py-2 bg-[#7D6B5D] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#635449] transition-colors shadow-sm flex items-center gap-1"
            >
              Results
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 max-w-[50%]">
          {rewards && rewards.length > 0 ? (
            rewards.map((reward, index) => (
              <div
                key={index}
                className="flex items-center font-bold text-gray-900 bg-yellow-50/80 px-2.5 py-1 rounded-lg border border-yellow-200/60 shadow-sm text-xs"
              >
                <span
                  className={
                    reward.rank === 1
                      ? "mr-1 text-sm"
                      : reward.rank === 2
                        ? "mr-1 text-sm"
                        : "mr-1 text-sm"
                  }
                >
                  {reward.rank === 1
                    ? "🥇"
                    : reward.rank === 2
                      ? "🥈"
                      : reward.rank === 3
                        ? "🥉"
                        : "💰"}
                </span>
                <span className="text-yellow-800/70 mr-1 text-[10px] uppercase font-bold tracking-wider">
                  {reward.rank === 1
                    ? "1st"
                    : reward.rank === 2
                      ? "2nd"
                      : reward.rank === 3
                        ? "3rd"
                        : `${reward.rank}th`}
                </span>
                <span className="text-yellow-900">{reward.prize}</span>
              </div>
            ))
          ) : prize ? (
            <div className="flex items-center font-bold text-gray-900 bg-yellow-50/80 px-3 py-1.5 rounded-lg border border-yellow-200/60 shadow-sm">
              <span className="mr-1 text-yellow-600">💰</span>
              {prize}
            </div>
          ) : null}
        </div>
      </div>

      <ContestDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contestData={{
          id: id,
          title,
          mode: type === "open" ? "Open" : "Group",
          difficulty: level,
          date: startTime
            ? new Date(startTime).toLocaleDateString()
            : undefined,
          time: startTime
            ? new Date(startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : undefined,
          duration,
          participantsCount: participantsCount,
          maxParticipants,
          reward:
            prize ||
            (rewards && rewards.length > 0
              ? `$${rewards.reduce((acc, curr) => acc + Number(curr.prize), 0)} Total`
              : "No Reward"),
          status: contestStatus,
        }}
        setContests={setContests}
      />

      <ContestLobbyModal
        isOpen={isLobbyModalOpen}
        onClose={() => setIsLobbyModalOpen(false)}
        contestId={id}
        contestTitle={title}
        onStartContest={() => {
          setContestStatus("ongoing");
        }}
      />
      {isLiveMonitorOpen && (
        <LiveMonitorModal
          isOpen={isLiveMonitorOpen}
          onClose={() => setIsLiveMonitorOpen(false)}
          contestId={id}
          contestTitle={title}
          duration={duration}
          // onEndContest={() => {
          //     setContestStatus("completed");
          // }}
        />
      )}

      {isResultsModalOpen && (
        <ContestResultsModal
          isOpen={isResultsModalOpen}
          onClose={() => setIsResultsModalOpen(false)}
          contestId={id}
          rewards={rewards || []}
        />
      )}
    </div>
  );
};

export default ContestCard;
