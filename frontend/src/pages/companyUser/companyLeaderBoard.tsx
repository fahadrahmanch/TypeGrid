import React, { useEffect, useState } from "react";
import CompanyUserNavbar from "../../components/companyUser/layout/companyUserNavbar";
import { getLeaderboard } from "../../api/companyUser/leaderboard";
import {
  Trophy,
  Medal,
  Star,
  Zap,
  Target,
  Info,
  Sparkles,
  BookOpen,
  UserCheck,
  Flame,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import ReusableTable from "../../components/common/ReusableTable";

interface LeaderboardEntry {
  _id?: string;
  id?: string;
  userId: string;
  name: string;
  imageUrl: string;
  wpm: number;
  accuracy: number;
  totalScore: number;
  weeklyScore: number;
  monthlyScore: number;
}

type FilterType = "all" | "weekly" | "monthly";

const CompanyLeaderBoard: React.FC = () => {
  const [rankings, setRankings] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("weekly");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // - [x] Add Leaderboard Scoring Description to `companyLeaderBoard.tsx`
    // - [x] Create UI component for 'How it Works' section
    // - [x] Refine positioning (Add Top Summary)
    // - [x] Move to Modal (User Request)
    // - [ ] Test UI responsiveness and visual appeal
    // - [ ] Create Walkthrough artifact
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const response = await getLeaderboard(50);
        if (response.data.success) {
          const data = response.data.data.map((item: any) => ({
            ...item,
            userId: item.userId || item._id, // fallback just in case
          }));
          setRankings(data);
        }
      } catch (error) {
        toast.error("Failed to load leaderboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [filter]);

  const sortedRankings = [...rankings].sort((a, b) => {
    if (filter === "all") return (b.totalScore || 0) - (a.totalScore || 0);
    if (filter === "weekly") return (b.weeklyScore || 0) - (a.weeklyScore || 0);
    if (filter === "monthly") return (b.monthlyScore || 0) - (a.monthlyScore || 0);
    return 0;
  });

  const getScore = (user: LeaderboardEntry) => {
    if (filter === "all") return user.totalScore || 0;
    if (filter === "weekly") return user.weeklyScore || 0;
    if (filter === "monthly") return user.monthlyScore || 0;
    return 0;
  };

  return (
    <div className="min-h-screen bg-[#FFF8EA] font-sans text-gray-800">
      <CompanyUserNavbar />

      <main className="pt-20 md:pt-24 px-4 md:px-8 pb-12 max-w-5xl mx-auto flex flex-col gap-6 md:gap-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-start gap-4">
          
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                <Trophy className="w-6 h-6 text-orange-500 fill-orange-500/20" />
                <h1 className="text-2xl md:text-3xl font-black text-[#111827] tracking-tight">Leaderboard</h1>
              </div>
              <p className="text-xs md:text-sm text-gray-500 font-medium text-center md:text-left">The fastest typists in your organization.</p>

              {/* Added Top Summary */}
              <div
                className="flex items-center gap-3 mt-4 px-3 py-1.5 bg-orange-50 rounded-lg border border-orange-100 w-fit mx-auto md:mx-0 group cursor-help transition-all hover:bg-orange-100/50"
                title="WPM × Accuracy × Multipliers = Score"
              >
                <div className="flex -space-x-1">
                  <Zap className="w-3.5 h-3.5 text-orange-400 fill-current" />
                  <Target className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <p className="text-[10px] font-bold text-orange-800/80 uppercase tracking-wider flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                  Formula: <span className="text-gray-400 font-black">WPM × ACC × Multipliers</span>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-orange-500 hover:text-orange-600 underline underline-offset-2 decoration-orange-300 transition-colors"
                  >
                    How it works?
                  </button>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md p-1 rounded-2xl border border-[#FDE6C6] shadow-sm flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full">
            {(["weekly", "monthly", "all"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap shrink-0 ${
                  filter === f
                    ? "bg-orange-500 text-white shadow-md"
                    : "text-gray-500 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                {f === "all" ? "All Time" : f === "weekly" ? "Weekly" : "Monthly"}
              </button>
            ))}
          </div>
        </div>

        {/* Podium / Top 3 Display */}
        {!isLoading && sortedRankings.length >= 3 && (
          <div className="flex flex-row items-end justify-center gap-2 sm:gap-6 mt-4 mb-2 overflow-x-auto no-scrollbar pb-4 px-2">
            {/* 2nd Place */}
            <div className="order-1 flex-1 min-w-[100px] sm:min-w-0">
              <PodiumCard
                user={sortedRankings[1]}
                rank={2}
                color="slate"
                delay="delay-100"
                score={getScore(sortedRankings[1])}
              />
            </div>
            {/* 1st Place */}
            <div className="order-2 flex-1 min-w-[110px] sm:min-w-0 transform -translate-y-4 sm:-translate-y-6 scale-105 sm:scale-125 z-10">
              <PodiumCard
                user={sortedRankings[0]}
                rank={1}
                color="orange"
                delay="delay-0"
                isLarge
                score={getScore(sortedRankings[0])}
              />
            </div>
            {/* 3rd Place */}
            <div className="order-3 flex-1 min-w-[100px] sm:min-w-0">
              <PodiumCard
                user={sortedRankings[2]}
                rank={3}
                color="amber"
                delay="delay-200"
                score={getScore(sortedRankings[2])}
              />
            </div>
          </div>
        )}

        {/* Full List */}
        <div className="bg-white rounded-[2rem] border border-[#FDE6C6] shadow-xl overflow-hidden mt-4 md:mt-8">
          <ReusableTable
            columns={[
              {
                header: "Rank",
                key: "rank",
                className: "px-4 md:px-8 py-5",
                render: (_, index) => (
                  <div className="flex items-center gap-3">
                    <span
                      className={`
                      w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center font-black text-xs md:text-sm
                      ${
                        index === 0
                          ? "bg-orange-100 text-orange-600 border border-orange-200 shadow-sm"
                          : index === 1
                            ? "bg-slate-100 text-slate-600 border border-slate-200"
                            : index === 2
                              ? "bg-amber-50 text-amber-600 border border-amber-100"
                              : "text-gray-400"
                      }
                    `}
                    >
                      {index + 1}
                    </span>
                  </div>
                ),
              },
              {
                header: "Typist",
                key: "name",
                className: "px-4 md:px-8 py-5",
                render: (user, index) => (
                  <div className="flex items-center gap-3 md:gap-4 max-w-[120px] md:max-w-none">
                    <div className="relative shrink-0">
                      <img
                        src={
                          user.imageUrl ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
                        }
                        alt={user.name}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-xl border-2 border-white shadow-sm object-cover bg-gray-100"
                      />
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 bg-orange-500 rounded-full p-0.5 border-2 border-white">
                          <Star className="w-2 h-2 text-white fill-current" />
                        </div>
                      )}
                    </div>
                    <div className="truncate">
                      <p className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors truncate text-sm md:text-base">
                        {user.name}
                      </p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 hidden sm:block">
                        Active Typist
                      </p>
                    </div>
                  </div>
                ),
              },
              {
                header: "Stats",
                key: "stats",
                headerClassName: "text-center hidden sm:table-cell",
                className: "px-4 md:px-8 py-5 text-center hidden sm:table-cell",
                render: (user) => (
                  <div className="flex flex-col items-center justify-center gap-1">
                    <span className="px-2 md:px-3 py-1 bg-gray-50 rounded-full text-[9px] md:text-[10px] font-black text-gray-600 flex items-center gap-1 border border-gray-100 uppercase tracking-widest">
                      <Zap className="w-2.5 h-2.5 text-orange-400 fill-current" />
                      {user.wpm} WPM
                    </span>
                    <span className="px-2 md:px-3 py-1 bg-gray-50 rounded-full text-[9px] md:text-[10px] font-black text-gray-500 flex items-center gap-1 border border-gray-100 uppercase tracking-widest">
                      <Target className="w-2.5 h-2.5 text-blue-400" />
                      {user.accuracy}%
                    </span>
                  </div>
                ),
              },
              {
                header: "Score",
                key: "score",
                headerClassName: "text-right",
                className: "px-4 md:px-8 py-5 text-right",
                render: (user) => (
                  <div className="flex flex-col items-end">
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg md:text-2xl font-black text-gray-900 group-hover:text-orange-500 transition-colors tracking-tight">
                        {getScore(user)}
                      </span>
                      <span className="text-[9px] font-black text-gray-400 uppercase">PTS</span>
                    </div>
                    <div className="h-1 w-16 md:w-24 bg-gray-100 rounded-full mt-2 overflow-hidden hidden sm:block">
                      <div
                        className="h-full bg-orange-400 rounded-full transition-all duration-1000"
                        style={{
                          width: `${Math.min((getScore(user) / 500) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ),
              },
            ]}
            data={sortedRankings}
            isLoading={isLoading}
            emptyMessage="No rankings yet!"
            rowClassName={(_user, index) =>
              `group hover:bg-orange-50/30 transition-colors duration-200 border-b border-orange-50/50 ${index < 3 ? "bg-orange-100/10" : ""}`
            }
            columnHeaderClassName="px-4 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]"
            headerClassName="bg-orange-50/50 border-b border-[#FDE6C6] text-left"
          />
        </div>

        {/* Modal for Scoring Explanation */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Modal Content */}
            <div className="relative bg-[#FFFDF9] rounded-[2rem] md:rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 border border-[#FDE6C6] flex flex-col">
              {/* Header */}
              <div className="sticky top-0 bg-white/80 backdrop-blur-md px-6 md:px-8 py-5 md:py-6 flex items-center justify-between border-b border-orange-100 z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-orange-100 rounded-xl">
                    <Info className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-[#111827]">Scoring System</h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 md:p-10 overflow-y-auto">
                <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
                  <div className="flex-1">
                    <div className="space-y-6">
                      <p className="text-gray-600 leading-relaxed font-medium text-base md:text-lg">
                        The scoring system rewards both speed and accuracy. The formula is:
                      </p>

                      {/* Formula Card */}
                      <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] text-white shadow-lg shadow-orange-500/20 relative overflow-hidden group text-center md:text-left">
                        <Sparkles className="absolute top-4 right-4 w-10 h-10 md:w-12 md:h-12 text-white/10 group-hover:rotate-12 transition-transform duration-500" />
                        <p className="text-orange-100 text-[10px] font-black uppercase tracking-widest mb-4">Calculation</p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-lg md:text-2xl font-black tracking-tight">
                          <span className="bg-white/10 px-3 py-1 rounded-lg">WPM</span>
                          <span className="text-orange-300 text-xl">×</span>
                          <span className="bg-white/10 px-3 py-1 rounded-lg">ACC%</span>
                          <span className="text-orange-300 text-xl">×</span>
                          <span className="bg-white/10 px-3 py-1 rounded-lg">Multipliers</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-5 bg-white rounded-2xl border border-orange-100 shadow-sm">
                          <h4 className="font-black text-orange-800 mb-2 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                            <Zap className="w-3 h-3" /> Speed (WPM)
                          </h4>
                          <p className="text-xs text-orange-700/70 font-medium leading-relaxed">
                            Your raw typing speed in Words Per Minute.
                          </p>
                        </div>
                        <div className="p-5 bg-white rounded-2xl border border-blue-100 shadow-sm">
                          <h4 className="font-black text-blue-800 mb-2 flex items-center gap-2 uppercase tracking-widest text-[10px]">
                            <Target className="w-3 h-3" /> Accuracy
                          </h4>
                          <p className="text-xs text-blue-700/70 font-medium leading-relaxed">
                            Higher accuracy yields a higher final score multiplier.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-6">
                    <h3 className="text-[10px] font-black text-gray-400 flex items-center gap-2 uppercase tracking-[0.2em] mb-2">
                      Active Multipliers
                    </h3>

                    <div className="grid gap-3 md:gap-4">
                      {/* Activity Multipliers */}
                      <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm">
                        <div className="space-y-4">
                          <MultiplierItem icon={<BookOpen className="w-4 h-4" />} label="Lessons" multiplier="1.0x" />
                          <MultiplierItem
                            icon={<UserCheck className="w-4 h-4" />}
                            label="1v1 Challenges"
                            multiplier="1.2x"
                            color="text-blue-600"
                          />
                          <MultiplierItem
                            icon={<Trophy className="w-4 h-4" />}
                            label="Contests"
                            multiplier="1.5x"
                            color="text-orange-600"
                          />
                        </div>
                      </div>

                      {/* Difficulty Multipliers */}
                      <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm">
                        <div className="space-y-4">
                          <MultiplierItem
                            icon={<Flame className="w-4 h-4 text-green-500" />}
                            label="Easy"
                            multiplier="1.0x"
                          />
                          <MultiplierItem
                            icon={<Flame className="w-4 h-4 text-orange-500" />}
                            label="Medium"
                            multiplier="1.5x"
                          />
                          <MultiplierItem
                            icon={<Flame className="w-4 h-4 text-red-500" />}
                            label="Hard"
                            multiplier="2.0x"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-orange-50/30 p-6 flex items-center justify-center border-t border-orange-100">
                <p className="text-[10px] font-black text-orange-600/40 uppercase tracking-widest text-center">
                  Scores update in real-time as you complete activities.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const MultiplierItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  multiplier: string;
  color?: string;
}> = ({ icon, label, multiplier, color = "text-gray-600" }) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className={`font-bold ${color}`}>{label}</span>
    </div>
    <span className="bg-white px-3 py-1 rounded-full text-xs font-black text-gray-400 border border-gray-100 shadow-sm">
      {multiplier}
    </span>
  </div>
);

const PodiumCard: React.FC<{
  user: LeaderboardEntry;
  rank: number;
  color: string;
  delay: string;
  isLarge?: boolean;
  score: number;
}> = ({ user, rank, color, delay, isLarge, score }) => {
  const colorMap: Record<string, any> = {
    orange: {
      bg: "bg-orange-500",
      text: "text-orange-600",
      ring: "ring-orange-200",
      light: "bg-orange-50",
      icon: Trophy,
    },
    slate: {
      bg: "bg-slate-400",
      text: "text-slate-600",
      ring: "ring-slate-200",
      light: "bg-slate-50",
      icon: Medal,
    },
    amber: {
      bg: "bg-amber-600",
      text: "text-amber-700",
      ring: "ring-amber-200",
      light: "bg-amber-50",
      icon: Medal,
    },
  };

  const style = colorMap[color];
  const Icon = style.icon;

  return (
    <div
      className={`
      flex flex-col items-center gap-2 sm:gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both ${delay}
      ${isLarge ? "mb-2 sm:mb-8" : ""}
    `}
    >
      <div className="relative">
        <div
          className={`
          ${isLarge ? "w-24 h-24 sm:w-32 sm:h-32" : "w-16 h-16 sm:w-24 sm:h-24"} 
          rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-white shadow-xl sm:shadow-2xl relative overflow-hidden group
        `}
        >
          <img
            src={user.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
            alt={user.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 bg-gray-100"
          />
          <div className={`absolute bottom-0 left-0 w-full ${style.bg} h-1 md:h-1.5 opacity-80`} />
        </div>
        <div
          className={`
          absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 w-7 h-7 sm:w-10 sm:h-10 ${style.bg} text-white rounded-lg sm:rounded-xl shadow-lg
          flex items-center justify-center font-black border-2 border-white text-[10px] sm:text-base
        `}
        >
          {rank}
        </div>
      </div>

      <div className="text-center px-1">
        <h3 className="font-black text-gray-900 text-xs sm:text-lg leading-none mb-1 sm:mb-2 truncate max-w-[80px] sm:max-w-none">{user.name}</h3>
        <div className={`flex items-center justify-center gap-1 ${style.text} font-black italic`}>
          <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-sm sm:text-2xl tracking-tight">{score}</span>
          <span className="text-[8px] sm:text-xs uppercase ml-0.5 opacity-80">PTS</span>
        </div>
        <div className="hidden sm:flex items-center justify-center gap-2 mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          <span className="flex items-center gap-0.5">
            <Zap className="w-3 h-3 text-orange-400" /> {user.wpm}
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <span className="flex items-center gap-0.5">
            <Target className="w-3 h-3 text-blue-400" /> {user.accuracy}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default CompanyLeaderBoard;
