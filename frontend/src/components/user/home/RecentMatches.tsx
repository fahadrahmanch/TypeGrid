import React from "react";

const RecentMatches: React.FC = () => {
    // Mock data
    const matches = [
        { rank: 1, user: "Fahad", time: "Just now", wpm: 24.26 },
        { rank: 2, user: "Shakebu", time: "Just now", wpm: 24.76 },
        { rank: 3, user: "raid", time: "Just now", wpm: 10.61 },
        { rank: 4, user: "Master", time: "Just now", wpm: 83.89 },
        { rank: 5, user: "Navigator", time: "Just now", wpm: 31.01 },
        { rank: 6, user: "ujonta", time: "Just now", wpm: 70.29 },
    ];

    return (
        <div className="bg-[#FFF5E0] p-6 rounded-3xl h-full shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-gray-900 font-serif">Recent Matches</h2>
            <div className="space-y-4">
                {matches.map((match, index) => (
                    <div key={index} className="flex items-center justify-between border-b border-orange-200 pb-3 last:border-0 last:pb-0">
                        <div className="flex items-center gap-4">
                            <span className="text-lg font-normal text-gray-600 w-4">{match.rank}.</span>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">{match.user}</p>
                                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{match.time}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-medium text-gray-500">{match.wpm} WPM</p>
                        </div>
                    </div>
                ))}
            </div>
            {/* Pagination dots */}
            <div className="flex justify-start gap-2 mt-8">
                <span className="w-8 h-1 bg-gray-800 rounded-full"></span>
                <span className="w-8 h-1 bg-gray-300 rounded-full"></span>
            </div>
        </div>
    );
};

export default RecentMatches;
