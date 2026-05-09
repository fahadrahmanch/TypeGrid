import React from "react";
import { useEffect } from "react";
import { Users, Clock, Calendar } from "lucide-react";
import { updateContestStatus } from "../../../api/companyAdmin/companyContextAPI";
import { useState } from "react";
import { ContestStatus, ContestLevel, ContestProps } from "../../../types/contest";
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
  fetchContests
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
    <div className="bg-[#fff8ea]/60 backdrop-blur-xl rounded-3xl md:rounded-[2rem] p-5 md:p-8 shadow-[0_10px_30px_rgb(236,164,104,0.04)] border border-[#ECA468]/10 hover:shadow-[0_20px_50px_rgb(236,164,104,0.08)] transition-all duration-500 relative overflow-hidden group">
      {/* Contest Status Line - Top */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <h3 className="text-base md:text-xl font-black text-slate-800 group-hover:text-[#ECA468] transition-colors leading-tight">
            {title}
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest px-2 md:px-2.5 py-1 md:py-1.5 rounded-lg md:rounded-xl border ${getStatusStyle(
                contestStatus
              )}`}
            >
              {contestStatus}
            </span>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest px-2 md:px-2.5 py-1 md:py-1.5 bg-amber-50 text-amber-600 rounded-lg md:rounded-xl border border-amber-100">
              {type === "open" ? "Open" : "Group"}
            </span>
          </div>
        </div>

        {startTime && (
          <div className="flex items-center text-gray-400 text-[10px] md:text-xs md:ml-auto bg-white/40 px-2 py-1 rounded-lg border border-white/50 w-fit">
            <Calendar className="w-3 h-3 mr-1.5 text-[#ECA468]" />
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
      <div className="flex flex-wrap items-center gap-y-3 gap-x-4 md:gap-x-8 text-xs md:text-sm text-gray-600 mb-6 md:mb-8">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 rounded-lg">
            <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500" />
          </div>
          <span className="text-[11px] md:text-sm">
            <span className="font-bold text-gray-900">{participantsCount}</span>
            <span className="text-gray-400">/{maxParticipants}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-50 rounded-lg">
            <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-500" />
          </div>
          <span className="text-[11px] md:text-sm font-medium">{Math.floor(duration / 60)} min</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">Level:</span>
          {getLevelBadge(level)}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-5 md:pt-6 border-t border-gray-100/50">
        <div className="flex flex-wrap gap-2 md:gap-3">
          {contestStatus === "waiting" && (
            <>
              <button
                onClick={() => setIsLobbyModalOpen(true)}
                className="flex-1 md:flex-none px-4 md:px-6 py-2.5 bg-slate-100 text-slate-700 text-[10px] md:text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-colors"
              >
                Lobby
              </button>
              <button
                onClick={() => changeStatus(id, "ongoing")}
                className="flex-1 md:flex-none px-4 md:px-6 py-2.5 bg-[#ECA468] text-white text-[10px] md:text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#D0864B] transition-colors shadow-lg shadow-[#ECA468]/20"
              >
                Start
              </button>
            </>
          )}

          {(contestStatus === "ongoing" || contestStatus === "active") && (
            <>
              <button
                onClick={() => setIsLiveMonitorOpen(true)}
                className="flex-1 md:flex-none px-4 md:px-6 py-2.5 bg-[#7D6B5D] text-white text-[10px] md:text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#635449] transition-colors shadow-sm"
              >
                Live
              </button>
              <button
                onClick={handleEndContest}
                className="flex-1 md:flex-none px-4 md:px-6 py-2.5 bg-[#ECA468] text-white text-[10px] md:text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#D0864B] transition-colors shadow-lg shadow-[#ECA468]/20"
              >
                End
              </button>
            </>
          )}

          {(contestStatus === "upcoming" || contestStatus === "completed") && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 md:flex-none px-4 md:px-6 py-2.5 bg-slate-100 text-slate-700 text-[10px] md:text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-colors"
            >
              Details
            </button>
          )}
          {contestStatus === "upcoming" && (
            <button
              onClick={() => changeStatus(id, "waiting")}
              className="flex-1 md:flex-none px-4 md:px-6 py-2.5 bg-amber-500 text-white text-[10px] md:text-xs font-black uppercase tracking-widest rounded-xl hover:bg-amber-600 transition-colors shadow-sm"
            >
              Wait
            </button>
          )}
          {contestStatus === "completed" && (
            <button
              onClick={() => setIsResultsModalOpen(true)}
              className="flex-1 md:flex-none px-4 md:px-6 py-2.5 bg-[#7D6B5D] text-white text-[10px] md:text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#635449] transition-colors shadow-sm"
            >
              Results
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          {rewards && rewards.length > 0 ? (
            rewards.map((reward, index) => (
              <div
                key={index}
                className="flex items-center font-bold text-gray-900 bg-yellow-50/80 px-2.5 py-1.5 rounded-lg border border-yellow-200/60 shadow-sm text-[10px] md:text-xs"
              >
                <span className="mr-1.5 text-sm">
                  {reward.rank === 1 ? "🥇" : reward.rank === 2 ? "🥈" : reward.rank === 3 ? "🥉" : "💰"}
                </span>
                <span className="text-yellow-800/70 mr-1.5 text-[8px] md:text-[9px] uppercase font-black tracking-widest">
                  {reward.rank === 1 ? "1st" : reward.rank === 2 ? "2nd" : reward.rank === 3 ? "3rd" : `${reward.rank}th`}
                </span>
                <span className="text-yellow-950 font-black">{reward.prize}</span>
              </div>
            ))
          ) : prize ? (
            <div className="flex items-center font-bold text-gray-900 bg-yellow-50/80 px-3 py-1.5 rounded-lg border border-yellow-200/60 shadow-sm text-[10px] md:text-xs">
              <span className="mr-1.5 text-yellow-600">💰</span>
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
          date: startTime ? new Date(startTime).toLocaleDateString() : undefined,
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
        fetchContests={fetchContests}
      />

      <ContestLobbyModal
        isOpen={isLobbyModalOpen}
        onClose={() => setIsLobbyModalOpen(false)}
        contestId={id}
        contestTitle={title}
        onStartContest={() => {
          setContestStatus("ongoing");
        }}
        fetchContests={fetchContests}
        
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
