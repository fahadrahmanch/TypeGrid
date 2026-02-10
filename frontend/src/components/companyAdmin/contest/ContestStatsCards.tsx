import React from "react";
import { Trophy, Play, Pause, Users } from "lucide-react";

interface StatProps {
    label: string;
    value: string | number;
    icon: React.ElementType;
    iconColor: string; // Tailwind text color class, e.g., "text-purple-600"
}

const StatCard: React.FC<StatProps> = ({
    label,
    value,
    icon: Icon,
    iconColor,
}) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow duration-200">
        <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-500">{label}</span>
            <span className="text-3xl font-bold text-gray-900 font-sans">{value}</span>
        </div>
        <div className={`p-3 rounded-xl bg-opacity-10 ${iconColor.replace('text-', 'bg-')}`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
    </div>
);

const ContestStatsCards: React.FC = () => {
    // Dummy data
    const stats = [
        { label: "Total Contests", value: "2", icon: Trophy, iconColor: "text-blue-600" },
        { label: "Active", value: "1", icon: Play, iconColor: "text-green-500" },
        { label: "Waiting", value: "1", icon: Pause, iconColor: "text-yellow-500" }, // Using Pause as generic waiting/hold icon equivalent
        {
            label: "Total Participants",
            value: "20",
            icon: Users,
            iconColor: "text-purple-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
};

export default ContestStatsCards;
