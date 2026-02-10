import React from "react";
import { ArrowLeft, Play, MessageSquare, User } from "lucide-react";
import { Link, useParams } from "react-router-dom";

// Dummy data for participants
const participants = [
    { id: 1, name: "Alex Johnson" },
    { id: 2, name: "Sarah Williams" },
    { id: 3, name: "Michael Chen" },
    { id: 4, name: "Emma Davis" },
];

const CompanyContestLobby: React.FC = () => {
    // In a real app, you would fetch contest details using the ID
    const { contestId } = useParams();

    return (
        <div className="min-h-screen bg-[#FFF8EA] p-8 font-sans">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Back Navigation */}
                <Link
                    to="/company/admin/contest-management"
                    className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Dashboard
                </Link>

                {/* Lobby Header Card */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">
                            Lobby Area
                        </h1>
                        <p className="text-gray-500 font-medium">Speed Typing Challenge</p>
                    </div>
                    <span className="px-4 py-1.5 bg-yellow-100 text-yellow-800 text-xs font-bold uppercase tracking-wider rounded-lg border border-yellow-200">
                        Waiting
                    </span>
                </div>

                {/* Action Buttons Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-4">
                    <button className="flex items-center px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md shadow-green-200 hover:bg-green-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                        <Play className="w-5 h-5 mr-2 fill-current" />
                        Start Contest
                    </button>
                    <button className="flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                        <MessageSquare className="w-5 h-5 mr-2" />
                        Send Announcement
                    </button>
                </div>

                {/* Participants Section */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 min-h-[400px]">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        Participants <span className="ml-2 text-gray-400 font-normal text-lg">( {participants.length})</span>
                    </h2>

                    <div className="space-y-3">
                        {participants.map((participant) => (
                            <div
                                key={participant.id}
                                className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
                            >
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-4 text-gray-500">
                                    <User className="w-5 h-5" />
                                </div>
                                <span className="font-semibold text-gray-800">
                                    {participant.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyContestLobby;
