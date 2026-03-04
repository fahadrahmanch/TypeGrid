import React from "react";
import { Users, Clock, Calendar, Trophy, ChevronRight, Activity, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { joinOrLeaveContestApi } from "../../../api/companyUser/contests";
import { useState } from "react";
import { toast } from "react-toastify";

type User = {
    _id: string;
}

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
        case "easy": return "bg-emerald-50 text-emerald-600 border-emerald-200";
        case "intermediate": return "bg-blue-50 text-blue-600 border-blue-200";
        case "medium": return "bg-blue-50 text-blue-600 border-blue-200";
        case "advanced": return "bg-purple-50 text-purple-600 border-purple-200";
        case "hard": return "bg-rose-50 text-rose-600 border-rose-200";
        default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
};

const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
        case "waiting": return "bg-amber-100 text-amber-700";
        case "upcoming": return "bg-sky-100 text-sky-700";
        case "active": return "bg-emerald-100 text-emerald-700";
        default: return "bg-gray-100 text-gray-700";
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
    reward
}) => {

    const [isJoined, setIsJoined] = useState(joined);
    const [participantList, setParticipantList] = useState<User[]>([]);
    const [isHovered, setIsHovered] = useState(false);
    const [participantsCount, setParticipantsCount] = useState<number>(participants.length);
    const navigate = useNavigate();

    async function handleClick(contestId: string, actionLabel: string) {
        const response = await joinOrLeaveContestApi(contestId, actionLabel);

        if (response) {
            toast.success(`${actionLabel}ed contest successfully`);
        }
        const contest = response.data.data;

        setIsJoined(contest.joined);
        setParticipantList(contest.participants);
            if(actionLabel === "join") {
                setParticipantsCount(participantsCount + 1);
            }else if(actionLabel === "cancel") {
                setParticipantsCount(participantsCount - 1);
            }
       
    }

    // Capitalize properly in button later
    const action = isJoined ? "cancel" : "join";
    return (
        <div
            className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 relative w-full transform hover:-translate-y-1 overflow-hidden flex flex-col h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Top decorative gradient bar */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${difficulty.toLowerCase() === "hard" ? "from-rose-400 to-red-500" :
                    difficulty.toLowerCase() === "medium" ? "from-blue-400 to-indigo-500" :
                        "from-emerald-400 to-green-500"
                }`} />

            {/* Header Section */}
            <div className="flex justify-between items-start mb-4 gap-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${getStatusBadgeStyle(status)}`}>
                            {status}
                        </span>
                        {isGroup && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 flex items-center gap-1">
                                <Users size={10} /> Team
                            </span>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                        {title}
                    </h3>
                </div>
                {/* Difficulty Badge */}
                <div className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-lg border shadow-sm ${getLevelBadgeStyle(difficulty)}`}>
                    <Zap className="w-3.5 h-3.5 mb-0.5" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">{difficulty}</span>
                </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-500 mb-5 line-clamp-2 flex-grow">
                {description || (isGroup ? "An exclusive internal team competition to test your skills." : "An open competition for everyone to showcase their typing speed.")}
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
                <div className="mb-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-100 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold uppercase tracking-wider mb-1">
                        <Trophy className="w-3.5 h-3.5 text-amber-600" />
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
                                <div key={r.rank} className="flex items-center bg-white rounded-lg px-2.5 py-1.5 shadow-sm border border-amber-100/50">
                                    <span className="text-xs font-bold text-amber-600 mr-1.5">{getRankStr(r.rank)}</span>
                                    <span className="text-sm font-bold text-gray-800">₹{r.prize}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="p-1.5 bg-gray-50 rounded-md text-gray-400">
                        <Calendar className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{date.toString().split("T")[0]}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="p-1.5 bg-gray-50 rounded-md text-gray-400">
                        <Clock className="w-4 h-4" />
                    </div>
                    <span className="font-medium">
                        {new Date(startTime).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                        })}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="p-1.5 bg-gray-50 rounded-md text-gray-400">
                        <Activity className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{duration} mins</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="p-1.5 bg-gray-50 rounded-md text-gray-400">
                        <Users className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{participantsCount}/{maxParticipants} joined</span>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-auto flex gap-2.5">
                <button
                    onClick={() => handleClick(_id, action)}
                    className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm flex items-center justify-center gap-2 whitespace-nowrap
                    ${action === "join"
                            ? "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-md"
                            : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                        }
                  `}
                >
                    {action === "join" ? "Join Contest" : "Cancel"}
                </button>

                {isJoined && (
                    <button
                        onClick={() => navigate(`lobby/${_id}`)}
                        className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md flex items-center justify-center gap-1 group/btn whitespace-nowrap"
                    >
                        View Lobby
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default UserContestCard;
