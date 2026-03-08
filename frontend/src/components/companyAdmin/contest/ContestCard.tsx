import React from "react";
import { Users, Clock, Calendar } from "lucide-react";
import { updateContestStatus } from "../../../api/companyAdmin/companyContextAPI";
import { useState } from "react";
export type ContestStatus = "waiting" | "ongoing" | "upcoming" | "completed";
export type ContestLevel = "easy" | "medium" | "hard"; // Added Hard
import { socket } from "../../../socket";
import ContestDetailsModal from "./ContestDetailsModal";
import ContestLobbyModal from "./ContestLobbyModal";
import LiveMonitorModal from "./LiveMonitorModal";
// Helper to determine status style
const getStatusStyle = (status: ContestStatus) => {
  switch (status) {
    case "waiting":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "ongoing":
      return "bg-green-100 text-green-800 border-green-200 animate-pulse"; // Added subtle pulse for active
    case "upcoming":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "completed":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Helper for difficulty level badges/icons or text
const getLevelBadge = (level: ContestLevel) => {
  switch (level) {
    case "easy":
      return (
        <span className="text-xs px-2 py-0.5 rounded bg-green-50 text-green-600 border border-green-100">
          Easy
        </span>
      );
    case "medium":
      return (
        <span className="text-xs px-2 py-0.5 rounded bg-yellow-50 text-yellow-600 border border-yellow-100">
          Intermediate
        </span>
      );
    case "hard":
      return (
        <span className="text-xs px-2 py-0.5 rounded bg-orange-50 text-orange-600 border border-orange-100">
          Advanced
        </span>
      );
  }
};

export interface ContestProps {
  id: string;
  title: string;
  status: ContestStatus;
  participants: number[];
  maxParticipants: number;
  duration: number; // in minutes
  level: ContestLevel;
  targetWpm: number;
  prize?: string;
  rewards?: { rank: number; prize: string | number }[];
  startTime?: string; // Optional for active contests
  type?: "open" | "group"; // Just to show badges
  setContests: React.Dispatch<React.SetStateAction<ContestProps[]>>;
}

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
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
      {/* Contest Status Line - Top */}
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${getStatusStyle(
            contestStatus,
          )}`}
        >
          {contestStatus}
        </span>
        <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-md font-medium border border-blue-100">
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
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                View Lobby
              </button>
              <button
                onClick={() => changeStatus(id, "ongoing")}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm hover:shadow shadow-green-200"
              >
                Start Contest
              </button>
            </>
          )}

          {contestStatus === "ongoing" && (
            <>
              <button
                onClick={() => setIsLiveMonitorOpen(true)}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm hover:shadow shadow-indigo-200"
              >
                Live Monitor
              </button>
              <button
                onClick={() => changeStatus(id, "upcoming")}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow shadow-blue-200"
              >
                End Contest
              </button>
            </>
          )}

          {(contestStatus === "upcoming" || contestStatus === "completed") && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              Details
            </button>
          )}
          {contestStatus === "upcoming" && (
            <button
              onClick={() => changeStatus(id, "waiting")}
              className="px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 transition-colors shadow-sm"
            >
              Move to Waiting
            </button>
          )}
          {contestStatus === "completed" && (
            <button className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors shadow-sm flex items-center gap-1">
              View Results
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
    </div>
  );
};

export default ContestCard;
