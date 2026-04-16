import React from "react";
import { Users, Clock, Calendar, Trophy, ChevronRight, Activity, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { joinOrLeaveContestApi } from "../../../api/companyUser/contests";
import { useState } from "react";
import { toast } from "react-toastify";

export interface RewardResponseDTO {
  rank: number;
  prize: number;
}

export interface UserContestCardProps {
  _id: string;
  title: string;
  description?: string;
  status: string;
  participants: string[] | [];
  maxParticipants: number;
  startTime: string;
  joined: boolean;
  duration: number; // in minutes
  difficulty: string;
  date: string;
  isGroup?: boolean;
  tags?: { label: string; color: string }[];
  actionLabel?: string;
  reward?: RewardResponseDTO[];
}

const getLevelBadgeStyle = (level: string) => {
  switch (level.toLowerCase()) {
    case "easy":
      return "bg-[#FFF4EC]/60 text-[#D0864B] border-[#FADDB8]";
    case "intermediate":
      return "bg-blue-50 text-blue-600 border-blue-200";
    case "medium":
      return "bg-blue-50 text-blue-600 border-blue-200";
    case "advanced":
      return "bg-purple-50 text-purple-600 border-purple-200";
    case "hard":
      return "bg-rose-50 text-rose-600 border-rose-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
};

const getStatusBadgeStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case "waiting":
      return "bg-amber-100/60 text-amber-700";
    case "upcoming":
      return "bg-sky-100/60 text-sky-700";
    case "active":
      return "bg-[#FFF4EC] text-[#D0864B]";
    default:
      return "bg-gray-100/60 text-gray-700";
  }
};

const UserContestCard: React.FC<UserContestCardProps> = ({
  _id,
  title,
  description,
  status,
  participants,
  maxParticipants,
  duration,
  difficulty,
  startTime,
  date,
  isGroup,
  joined,
  tags,
  reward,
}) => {
  const [isJoined, setIsJoined] = useState(joined);
  // const [participantList, setParticipantList] = useState<User[]>([]);
  // const [isHovered, setIsHovered] = useState(false);
  const [participantsCount, setParticipantsCount] = useState<number>(participants.length);
  const navigate = useNavigate();

  async function handleClick(contestId: string, actionLabel: string) {
    const response = await joinOrLeaveContestApi(contestId, actionLabel);

    if (response) {
      toast.success(`${actionLabel}ed contest successfully`);
    }
    const contest = response.data.data;

    setIsJoined(contest.joined);
    // setParticipantList(contest.participants);
    if (actionLabel === "join") {
      setParticipantsCount(participantsCount + 1);
    } else if (actionLabel === "cancel") {
      setParticipantsCount(participantsCount - 1);
    }
  }

  // Capitalize properly in button later
  const action = isJoined ? "cancel" : "join";
  return (
    <div
      className="group bg-[#fff8ea]/60 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_10px_30px_rgb(236,164,104,0.04)] hover:shadow-[0_20px_50px_rgb(236,164,104,0.08)] border border-[#ECA468]/10 transition-all duration-500 relative w-full transform hover:-translate-y-1.5 overflow-hidden flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top decorative gradient bar */}
      <div
        className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
          difficulty.toLowerCase() === "hard"
            ? "from-rose-400 to-red-500"
            : difficulty.toLowerCase() === "medium"
              ? "from-blue-400 to-indigo-500"
              : "from-amber-400 to-[#ECA468]"
        }`}
      />

      {/* Header Section */}
      <div className="flex justify-between items-start mb-4 gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${getStatusBadgeStyle(status)}`}
            >
              {status}
            </span>
            {isGroup && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 flex items-center gap-1">
                <Users size={10} /> Team
              </span>
            )}
          </div>
          <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-[#ECA468] transition-colors line-clamp-2">
            {title}
          </h3>
        </div>
        {/* Difficulty Badge */}
        <div
          className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-lg border shadow-sm ${getLevelBadgeStyle(difficulty)}`}
        >
          <Zap className="w-3.5 h-3.5 mb-0.5" />
          <span className="text-[11px] font-bold uppercase tracking-wider">{difficulty}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-2 flex-grow leading-relaxed">
        {description ||
          (isGroup
            ? "An exclusive internal team competition to test your skills."
            : "An open competition for everyone to showcase their typing speed.")}
      </p>

      {/* Tags (if any exist beyond default) */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span key={index} className={`text-[10px] font-semibold tracking-wide px-2 py-1 rounded-md ${tag.color}`}>
              {tag.label}
            </span>
          ))}
        </div>
      )}

      {/* Prize Section (Compacted) */}
      {reward && reward.length > 0 && (
        <div className="mb-6 bg-[#fff4ec]/60 rounded-2xl p-4 border border-[#faddb8]/40 flex flex-col gap-3">
          <div className="flex items-center gap-1.5 text-[#D0864B] text-[10px] font-black uppercase tracking-widest mb-1">
            <Trophy className="w-4 h-4 text-[#ECA468]" />
            Prize Pool
          </div>
          <div className="flex flex-wrap gap-2">
            {reward.map((r) => {
              const getRankStr = (rank: number) => {
                if (rank === 1) return "1st";
                if (rank === 2) return "2nd";
                if (rank === 3) return "3rd";
                return `${rank}th`;
              };
              return (
                <div
                  key={r.rank}
                  className="flex items-center bg-white/40 backdrop-blur-sm rounded-xl px-3 py-2 shadow-sm border border-[#f8e8c8]/40"
                >
                  <span className="text-xs font-black text-[#ECA468] mr-2">{getRankStr(r.rank)}</span>
                  <span className="text-sm font-black text-slate-700">₹{r.prize}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-7 pt-5 border-t border-[#f8e8c8]/40">
        <div className="flex items-center gap-2.5 text-sm text-[#7D6B5D] font-bold">
          <div className="p-2 bg-[#fff4ec]/60 rounded-xl text-[#D0864B] border border-[#faddb8]/20">
            <Calendar className="w-4 h-4" />
          </div>
          <span className="truncate">{date.toString().split("T")[0]}</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-[#7D6B5D] font-bold">
          <div className="p-2 bg-[#fff4ec]/60 rounded-xl text-[#D0864B] border border-[#faddb8]/20">
            <Clock className="w-4 h-4" />
          </div>
          <span className="truncate">
            {new Date(startTime).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-[#7D6B5D] font-bold">
          <div className="p-2 bg-[#fff4ec]/60 rounded-xl text-[#D0864B] border border-[#faddb8]/20">
            <Activity className="w-4 h-4" />
          </div>
          <span className="truncate">{duration} mins</span>
        </div>
        <div className="flex items-center gap-2.5 text-sm text-[#7D6B5D] font-bold">
          <div className="p-2 bg-[#fff4ec]/60 rounded-xl text-[#D0864B] border border-[#faddb8]/20">
            <Users className="w-4 h-4" />
          </div>
          <span className="truncate">
            {participantsCount}/{maxParticipants} joined
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto flex gap-3">
        <button
          onClick={() => handleClick(_id, action)}
          className={`flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-sm flex items-center justify-center gap-2 whitespace-nowrap
                    ${
                      action === "join"
                        ? "bg-[#ECA468] text-white hover:bg-[#D0864B] hover:shadow-lg hover:shadow-[#ECA468]/30"
                        : "bg-rose-100 text-rose-600 border border-rose-200 hover:bg-rose-200"
                    }
                  `}
        >
          {action === "join" ? "Join Contest" : "Cancel"}
        </button>

        {isJoined && (
          <button
            onClick={() => navigate(`lobby/${_id}`)}
            className="flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 bg-white shadow-[0_5px_15px_rgba(236,164,104,0.1)] text-[#D0864B] border border-[#FADDB8] hover:bg-[#FFF4EC] flex items-center justify-center gap-1 group/btn whitespace-nowrap"
          >
            Lobby
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
};

export default UserContestCard;
