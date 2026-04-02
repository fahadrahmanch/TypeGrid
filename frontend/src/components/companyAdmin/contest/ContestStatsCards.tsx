import React from "react";
import { Trophy, Play, Pause, Users } from "lucide-react";
import StatCard from "../../common/StatCard";

const ContestStatsCards: React.FC = () => {
  // Dummy data
  const stats = [
    {
      label: "Total Contests",
      value: "2",
      icon: Trophy,
      iconColor: "text-blue-600",
    },
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
        <StatCard
          key={index}
          label={stat.label}
          value={stat.value}
          icon={<stat.icon className={`w-6 h-6 ${stat.iconColor}`} />}
          color="bg-white"
        />
      ))}
    </div>
  );
};

export default ContestStatsCards;
