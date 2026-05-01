import React, { useEffect, useState } from "react";
import CompanyUserNavbar from "../../components/companyUser/layout/companyUserNavbar";
import { getLeaderboard } from "../../api/companyUser/leaderboard";
import {
  Trophy,
  Medal,
  Star,
  Zap,
  ArrowLeft,
  Target,
  Info,
  Sparkles,
  BookOpen,
  UserCheck,
  Flame,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReusableTable from "../../components/common/ReusableTable";

interface LeaderboardEntry {
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
  const navigate = useNavigate();

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

      <main className="pt-24 px-4 md:px-8 pb-12 max-w-5xl mx-auto flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-start gap-4">
            <button
              onClick={() => navigate(-1)}
              className="mt-1 p-2 bg-white rounded-xl border border-[#FDE6C6] hover:bg-orange-50 transition-colors shadow-sm group"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-6 h-6 text-orange-500 fill-orange-500/20" />
                <h1 className="text-3xl font-black text-[#111827] tracking-tight">Company Leaderboard</h1>
              </div>
              <p className="text-gray-500 font-medium">The absolute fastest typists in your organization.</p>

              {/* Added Top Summary */}
              <div
                className="flex items-center gap-3 mt-3 px-3 py-1.5 bg-orange-50 rounded-lg border border-orange-100 w-fit group cursor-help transition-all hover:bg-orange-100/50"
                title="WPM × Accuracy × Multipliers = Score"
              >
                <div className="flex -space-x-1">
                  <Zap className="w-3.5 h-3.5 text-orange-400 fill-current" />
                  <Target className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <p className="text-[11px] font-bold text-orange-800/80 uppercase tracking-wider flex items-center gap-1.5">
                  Calculation: <span className="text-gray-400 font-black">WPM × ACC × Multipliers</span>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="ml-1 text-orange-500 hover:text-orange-600 underline underline-offset-2 decoration-orange-300 transition-colors"
                  >
                    How it works?
                  </button>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-[#FDE6C6] shadow-sm flex items-center gap-1">
            {(["weekly", "monthly", "all"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  filter === f
                    ? "bg-orange-500 text-white shadow-md"
                    : "text-gray-500 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                {f === "all" ? "All Time" : f === "weekly" ? "This Week" : "This Month"}
              </button>
            ))}
          </div>
        </div>

        {/* Podium / Top 3 Display */}
        {!isLoading && sortedRankings.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mt-4 mb-2">
            {/* 2nd Place */}
            <PodiumCard
              user={sortedRankings[1]}
              rank={2}
              color="slate"
              delay="delay-100"
              score={getScore(sortedRankings[1])}
            />
            {/* 1st Place */}
            <PodiumCard
              user={sortedRankings[0]}
              rank={1}
              color="orange"
              delay="delay-0"
              isLarge
              score={getScore(sortedRankings[0])}
            />
            {/* 3rd Place */}
            <PodiumCard
              user={sortedRankings[2]}
              rank={3}
              color="amber"
              delay="delay-200"
              score={getScore(sortedRankings[2])}
            />
          </div>
        )}

        {/* Full List */}
          <ReusableTable
            columns={[
              {
                header: "Rank",
                key: "rank",
                className: "px-8 py-5",
                render: (_, index) => (
                  <div className="flex items-center gap-3">
                    <span
                      className={`
                      w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm
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
                className: "px-8 py-5",
                render: (user, index) => (
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={
                          user.imageUrl ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
                        }
                        alt={user.name}
                        className="w-12 h-12 rounded-xl border-2 border-white shadow-sm object-cover bg-gray-100"
                      />
                      {index === 0 && (
                        <div className="absolute -top-1.5 -right-1.5 bg-orange-500 rounded-full p-1 border-2 border-white">
                          <Star className="w-2 h-2 text-white fill-current" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                        Active Typist
                      </p>
                    </div>
                  </div>
                ),
              },
              {
                header: "Stats",
                key: "stats",
                headerClassName: "text-center",
                className: "px-8 py-5 text-center",
                render: (user) => (
                  <div className="flex flex-col items-center justify-center gap-1">
                    <span className="px-3 py-1 bg-gray-50 rounded-full text-[10px] font-bold text-gray-600 flex items-center gap-1 border border-gray-100">
                      <Zap className="w-3 h-3 text-orange-400 fill-current" />
                      {user.wpm} WPM
                    </span>
                    <span className="px-3 py-1 bg-gray-50 rounded-full text-[10px] font-bold text-gray-500 flex items-center gap-1 border border-gray-100">
                      <Target className="w-3 h-3 text-blue-400" />
                      {user.accuracy}% ACC
                    </span>
                  </div>
                ),
              },
              {
                header: "Score",
                key: "score",
                headerClassName: "text-right",
                className: "px-8 py-5 text-right",
                render: (user) => (
                  <div className="flex flex-col items-end">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-gray-900 group-hover:text-orange-500 transition-colors tracking-tight">
                        {getScore(user)}
                      </span>
                      <span className="text-[10px] font-black text-gray-400 uppercase">PTS</span>
                    </div>
                    <div className="h-1 w-24 bg-gray-100 rounded-full mt-2 overflow-hidden">
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
            emptyMessage="No rankings yet! Complete your first lesson or contest to appear on the leaderboard."
            rowClassName={(user, index) =>
              `group hover:bg-orange-50/30 transition-colors duration-200 ${index < 3 ? "bg-orange-100/10" : ""}`
            }
            columnHeaderClassName="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]"
            headerClassName="bg-orange-50/50 border-b border-[#FDE6C6] text-left"
          />

        {/* Modal for Scoring Explanation */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-md animate-in fade-in duration-300"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 border border-[#FDE6C6]">
              {/* Header */}
              <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-6 flex items-center justify-between border-b border-orange-50 z-10">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-100 rounded-2xl">
                    <Info className="w-6 h-6 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-black text-[#111827]">Leaderboard Scoring</h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-8 md:p-12 overflow-y-auto max-h-[calc(90vh-80px)]">
                <div className="flex flex-col md:flex-row gap-12">
                  <div className="flex-1">
                    <div className="space-y-6">
                      <p className="text-gray-600 leading-relaxed font-medium text-lg">
                        Your rank is determined by a comprehensive scoring system that rewards both speed and accuracy.
                      </p>

                      {/* Formula Card */}
                      <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-8 rounded-[2rem] text-white shadow-lg shadow-orange-500/20 relative overflow-hidden group">
                        <Sparkles className="absolute top-4 right-4 w-12 h-12 text-white/10 group-hover:rotate-12 transition-transform duration-500" />
                        <p className="text-orange-100 text-xs font-black uppercase tracking-widest mb-2">
                          The Calculation
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xl md:text-3xl font-black tracking-tight">
                          <span>WPM</span>
                          <span className="text-orange-300">×</span>
                          <span>Accuracy%</span>
                          <span className="text-orange-300">×</span>
                          <span>Multipliers</span>
                          <span className="text-orange-300">=</span>
                          <span className="bg-white text-orange-600 px-4 py-1 rounded-xl shadow-sm">Score</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-5 bg-orange-50/50 rounded-2xl border border-orange-100">
                          <h4 className="font-bold text-orange-800 mb-1 flex items-center gap-2">
                            <Zap className="w-4 h-4" /> Speed (WPM)
                          </h4>
                          <p className="text-sm text-orange-700/70 font-medium leading-normal">
                            Your raw typing speed in Words Per Minute.
                          </p>
                        </div>
                        <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                          <h4 className="font-bold text-blue-800 mb-1 flex items-center gap-2">
                            <Target className="w-4 h-4" /> Accuracy
                          </h4>
                          <p className="text-sm text-blue-700/70 font-medium leading-normal">
                            Precision matters. Higher accuracy yields a higher final score multiplier.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-6">
                    <h3 className="text-sm font-black text-gray-400 flex items-center gap-2 uppercase tracking-[0.2em] mb-2">
                      Active Multipliers
                    </h3>

                    <div className="grid gap-4">
                      {/* Activity Multipliers */}
                      <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-1.5 leading-none">
                          <Trophy className="w-3 h-3" /> Activity Type
                        </p>
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
                      <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-1.5 leading-none">
                          <Flame className="w-3 h-3" /> Lesson Difficulty
                        </p>
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
              <div className="bg-orange-50/50 p-6 flex items-center justify-center border-t border-orange-50">
                <p className="text-xs font-bold text-orange-600/60 uppercase tracking-widest text-center">
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
      flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both ${delay}
      ${isLarge ? "order-1 md:order-2 mb-8" : rank === 2 ? "order-2 md:order-1" : "order-3"}
    `}
    >
      <div className="relative">
        <div
          className={`
          ${isLarge ? "w-32 h-32" : "w-24 h-24"} 
          rounded-3xl border-4 border-white shadow-2xl relative overflow-hidden group
        `}
        >
          <img
            src={user.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
            alt={user.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 bg-gray-100"
          />
          <div className={`absolute bottom-0 left-0 w-full ${style.bg} h-1.5 opacity-80`} />
        </div>
        <div
          className={`
          absolute -bottom-3 -right-3 w-10 h-10 ${style.bg} text-white rounded-xl shadow-lg
          flex items-center justify-center font-black border-2 border-white
        `}
        >
          {rank}
        </div>
      </div>

      <div className="text-center">
        <h3 className="font-black text-gray-900 text-lg leading-none mb-2">{user.name}</h3>
        <div className={`flex items-center justify-center gap-1.5 ${style.text} font-black italic`}>
          <Icon className="w-4 h-4" />
          <span className="text-2xl tracking-tight">{score}</span>
          <span className="text-xs uppercase ml-0.5 opacity-80">PTS</span>
        </div>
        <div className="flex items-center justify-center gap-2 mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
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
