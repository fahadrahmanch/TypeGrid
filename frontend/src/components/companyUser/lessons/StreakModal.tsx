import React from "react";
import { X, Flame, CheckCircle2 } from "lucide-react";

interface StreakModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const StreakModal: React.FC<StreakModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    // Calendar Data Generation (Mock for January 2024)
    // Starting on Monday (Jan 1, 2024 was a Monday)
    const daysInMonth = 31;
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Mock intensity for the heatmap (0-4 scale)
    const getIntensity = (day: number) => {
        // Random visual pattern matching the screenshot roughly
        if ([4, 9, 10, 12, 13, 16, 17, 19, 22, 26, 31].includes(day)) return 4; // Darkest green
        if ([3, 14, 23, 25, 29].includes(day)) return 3;
        if ([2, 5, 8, 11, 21, 24, 27, 30].includes(day)) return 2;
        if ([1, 6, 7, 15, 18, 20, 28].includes(day)) return 1; // Lightest
        return 0;
    };

    const getBgColor = (intensity: number) => {
        switch (intensity) {
            case 4: return "bg-emerald-600";
            case 3: return "bg-emerald-500";
            case 2: return "bg-emerald-300";
            case 1: return "bg-emerald-100";
            default: return "bg-gray-100"; // Day not played or skipped
        }
    };

    // In the screenshot, day 1 is Tue, so pad with empty cells if needed.
    // Actually Jan 1 2024 was Monday. The screenshot shows 1 under 'Tue'.
    const startOffset = 1;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="bg-[#FFF8EA] w-full max-w-lg rounded-3xl shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200 border-4 border-[#FFF8EA]">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Your Typing Streak</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-black/5 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    {/* Current Streak */}
                    <div className="bg-[#FFF8EE] rounded-2xl p-6 flex flex-col items-center justify-center border border-orange-50">
                        <Flame className="w-8 h-8 text-orange-500 mb-3 stroke-[1.5]" />
                        <span className="text-4xl font-bold text-orange-500 mb-1">7</span>
                        <span className="text-sm text-gray-500 font-medium">Current Streak</span>
                    </div>

                    {/* Longest Streak */}
                    <div className="bg-[#F0F7FF] rounded-2xl p-6 flex flex-col items-center justify-center border border-blue-50">
                        <div className="w-8 h-8 rounded-full border-2 border-blue-500 flex items-center justify-center mb-3">
                            <CheckCircle2 className="w-5 h-5 text-blue-500 stroke-[2.5]" />
                        </div>
                        <span className="text-4xl font-bold text-blue-600 mb-1">14</span>
                        <span className="text-sm text-gray-500 font-medium">Longest Streak</span>
                    </div>
                </div>

                {/* Calendar Section */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">January 2024</h3>

                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 gap-3 mb-3 text-center">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
                            <span key={day} className="text-xs text-gray-500 font-medium">{day}</span>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-3">
                        {Array.from({ length: startOffset }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square"></div>
                        ))}

                        {days.map((day) => {
                            const intensity = getIntensity(day);
                            return (
                                <div
                                    key={day}
                                    className={`
                                        aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-transform hover:scale-105 cursor-pointer
                                        ${getBgColor(intensity)}
                                        ${intensity > 2 ? "text-white" : "text-gray-600"}
                                    `}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <span className="text-xs text-gray-400">Less</span>
                    <div className="flex gap-2">
                        <div className="w-4 h-4 rounded bg-emerald-100"></div>
                        <div className="w-4 h-4 rounded bg-emerald-300"></div>
                        <div className="w-4 h-4 rounded bg-emerald-500"></div>
                        <div className="w-4 h-4 rounded bg-emerald-600"></div>
                    </div>
                    <span className="text-xs text-gray-400">More</span>
                </div>

                {/* Footer Message */}
                <div className="bg-[#F8F7FF] rounded-xl p-6 text-center">
                    <h4 className="text-sm font-bold text-gray-900 mb-1">Keep it up!</h4>
                    <p className="text-xs text-gray-500">Practice daily to maintain your streak and improve your typing skills</p>
                </div>

            </div>
        </div>
    );
};

export default StreakModal;
