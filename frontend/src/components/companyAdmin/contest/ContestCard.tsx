import React from "react";
import { Users, Clock, Target, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export type ContestStatus = "Waiting" | "Active" | "Upcoming" | "Completed";
export type ContestLevel = "Easy" | "Intermediate" | "Advanced" | "Hard"; // Added Hard

// Helper to determine status style
const getStatusStyle = (status: ContestStatus) => {
    switch (status) {
        case "Waiting":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "Active":
            return "bg-green-100 text-green-800 border-green-200 animate-pulse"; // Added subtle pulse for active
        case "Upcoming":
            return "bg-blue-100 text-blue-800 border-blue-200";
        case "Completed":
            return "bg-gray-100 text-gray-800 border-gray-200";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

// Helper for difficulty level badges/icons or text
const getLevelBadge = (level: ContestLevel) => {
    switch (level) {
        case "Easy": return <span className="text-xs px-2 py-0.5 rounded bg-green-50 text-green-600 border border-green-100">Easy</span>
        case "Intermediate": return <span className="text-xs px-2 py-0.5 rounded bg-yellow-50 text-yellow-600 border border-yellow-100">Intermediate</span>
        case "Advanced": return <span className="text-xs px-2 py-0.5 rounded bg-orange-50 text-orange-600 border border-orange-100">Advanced</span>
        case "Hard": return <span className="text-xs px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-100">Hard</span>
    }
}


export interface ContestProps {
    id: string;
    title: string;
    status: ContestStatus;
    participants: number;
    maxParticipants: number;
    duration: number; // in minutes
    level: ContestLevel;
    targetWpm: number;
    prize: string;
    date?: string; // Optional for active contests
    type?: "Public" | "Private" | "Group"; // Just to show badges
}

const ContestCard: React.FC<ContestProps> = ({
    title,
    status,
    participants,
    maxParticipants,
    duration,
    level,
    targetWpm,
    prize,
    date,
    type
}) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            {/* Contest Status Line - Top */}
            <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{title}</h3>

                <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${getStatusStyle(
                        status
                    )}`}
                >
                    {status}
                </span>
                <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-md font-medium border border-blue-100">
                    Open
                </span>

                {date && (
                    <div className="flex items-center text-gray-400 text-xs ml-auto">
                        <Calendar className="w-3 h-3 mr-1" />
                        {date}
                    </div>
                )}
                {type === 'Group' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border bg-purple-100 text-purple-700 border-purple-200 ml-auto">
                        Group
                    </span>
                )}
            </div>

            {/* Details Grid */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>
                        <span className="font-semibold text-gray-900">{participants}</span>
                        <span className="text-gray-400">/{maxParticipants} participants</span>
                    </span>
                </div>

                <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{duration} minutes</span>
                </div>

                <div className="flex items-center gap-1.5">
                    <span className="text-gray-400">Level:</span>
                    {getLevelBadge(level)}

                </div>

                <div className="flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-gray-400" />
                    <span>Target: {targetWpm} WPM</span>
                </div>
            </div>

            {/* Action Footer */}
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                <div className="flex gap-3">
                    {status === "Waiting" && (
                        <>
                            <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                                View Lobby
                            </button>
                            <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm hover:shadow shadow-green-200">
                                Start Contest
                            </button>
                        </>
                    )}

                    {status === "Active" && (
                        <>
                            <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm hover:shadow shadow-indigo-200">
                                Live Monitor
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow shadow-blue-200">
                                End Contest
                            </button>
                        </>
                    )}

                    {(status === "Upcoming" || status === "Completed") && (
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                            Details
                        </button>
                    )}
                    {status === "Upcoming" && (
                        <button className="px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 transition-colors shadow-sm">
                            Move to Waiting
                        </button>
                    )}
                    {status === "Completed" && (
                        <button className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors shadow-sm flex items-center gap-1">
                            View Results
                        </button>
                    )}
                </div>

                <div className="flex items-center font-bold text-gray-900">
                    <span className="mr-1 text-yellow-600">💰</span>
                    {prize}
                </div>
            </div>
        </div>
    );
};

export default ContestCard;
