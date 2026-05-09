import React, { useEffect, useState } from "react";
import Navbar from "../../components/user/Navbar";
import { useSelector } from "react-redux";
import { getGlobalLeaderboard } from "../../api/user/leaderboard";
import {
  Trophy,
  Medal,
  Zap,
  ArrowLeft,
  Loader2,
  // TrendingUp,

  Star,
  Target,
  Info,
  Sparkles,
  X,
  BookOpen,
  UserCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  totalCompetitions?: number;
  // Visual placeholders
  streak?: number;
  trend?: number;
  badge?: string;
}

type FilterType = "all" | "weekly" | "monthly";

const LeaderBoard: React.FC = () => {
  const [rankings, setRankings] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("weekly");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const currentUser = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const response = await getGlobalLeaderboard(filter, 100);
        if (response.data.success) {
          const data = response.data.data.map((item: any, index: number) => ({
            ...item,
            userId: item.userId || item._id,
            // Use real backend field if present, otherwise fallback to mock for design
            streak: item.streak || Math.floor((item.wpm || 0) / 12) + 2,
            trend: item.trend || Math.floor(Math.random() * 10) + 1,
            badge: getBadge(index, item.wpm, item.accuracy),
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
  }, []);

  const getBadge = (index: number, wpm: number, acc: number) => {
    if (index === 0) return "Global Legend";
    if (acc > 98) return "Accuracy King";
    if (wpm > 100) return "Speed Demon";
    if (index < 5) return "Rising Titan";
    return "Consistent Pro";
  };

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

  const topThree = sortedRankings.slice(0, 3);

  return (
    <div className="min-h-screen  font-sans text-[#1A1A1A]">
      <Navbar />

      <main className="pt-24 px-4 md:px-8 pb-20 max-w-6xl mx-auto flex flex-col items-center">
        {/* Header Section */}
        <div className="w-full mb-10 md:mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8 md:gap-12">
          <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6 w-full">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 bg-white rounded-xl border border-[#FDE6C6] hover:bg-orange-50 transition-colors shadow-sm group shrink-0 hidden md:block"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div className="flex-1 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-5 h-5 md:w-6 md:h-6 text-[#ECA468]" />
                  <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none">Leaderboard</h1>
                </div>
                <p className="text-sm md:text-base text-[#6B7280] font-medium max-w-md">
                  The hall of fame for the world's most elite typists. Find your status.
                </p>
              </div>

              {/* Calculation Summary */}
              <div
                className="flex items-center gap-3 px-3 py-2 bg-orange-50 rounded-xl border border-orange-100 w-full md:w-fit group cursor-help transition-all hover:bg-orange-100/50"
                title="WPM × Accuracy × Multipliers = Score"
              >
                <div className="flex -space-x-1 shrink-0">
                  <Zap className="w-3.5 h-3.5 text-orange-400 fill-current" />
                  <Target className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] md:text-[11px] font-bold text-orange-800/80 uppercase tracking-wider">
                  <span>Score Calculation</span>
                  <span className="text-orange-200 hidden xs:inline">•</span>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-orange-500 hover:text-orange-600 underline underline-offset-2 decoration-orange-300 transition-colors"
                  >
                    How it works?
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Filter Tabs */}
          <div className="flex items-center gap-6 md:gap-8 border-b border-gray-100 pb-1 overflow-x-auto no-scrollbar w-full lg:w-auto">
            {(["all", "weekly", "monthly"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`pb-3 px-1 text-[11px] md:text-sm font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${
                  filter === f ? "text-slate-900" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {f}
                {filter === f && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-[#ECA468] rounded-full animate-in slide-in-from-left duration-300" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 Podium Cards */}
        <div className="w-full flex flex-row items-end justify-center gap-2 sm:gap-8 mb-12 sm:mb-16 max-w-5xl px-2">
          {isLoading ? (
            <div className="py-20 flex justify-center w-full">
              <Loader2 className="w-10 h-10 animate-spin text-[#ECA468]" />
            </div>
          ) : (
            <>
              {/* Desktop Order: 2, 1, 3 | Mobile Order: 2, 1, 3 */}
              {topThree[1] && (
                <div className="order-1 flex-1 transform hover:-translate-y-2 transition-transform duration-500 min-w-[100px]">
                  <PodiumCard user={topThree[1]} rank={2} badge="Speed Demon" score={getScore(topThree[1])} />
                </div>
              )}
              {topThree[0] && (
                <div className="order-2 flex-1 transform hover:-translate-y-2 transition-transform duration-500 min-w-[110px] z-10">
                  <PodiumCard
                    user={topThree[0]}
                    rank={1}
                    isPrimary
                    badge="Global Legend"
                    score={getScore(topThree[0])}
                  />
                </div>
              )}
              {topThree[2] && (
                <div className="order-3 flex-1 transform hover:-translate-y-2 transition-transform duration-500 min-w-[100px]">
                  <PodiumCard user={topThree[2]} rank={3} badge="Accuracy King" score={getScore(topThree[2])} />
                </div>
              )}
            </>
          )}
        </div>

        {/* Complete Rankings Section */}
          <ReusableTable
            columns={[
              {
                header: "Rank",
                key: "rank",
                className: "py-4 md:py-6 pl-2 md:pl-4 w-12 md:w-20",
                render: (_, index) => (
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black text-xs ${
                      index < 3 ? "bg-[#1A1A1A] text-white" : "bg-[#F3F4F6] text-[#4B5563]"
                    }`}
                  >
                    {index + 1}
                  </div>
                ),
              },
              {
                header: "Player",
                key: "name",
                className: "py-4 md:py-6 pl-2 md:pl-4",
                render: (user, index) => (
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="relative shrink-0">
                      <img
                        src={
                          user.imageUrl ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
                        }
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white shadow-sm object-cover"
                        alt=""
                      />
                      {index === 0 && (
                        <div className="absolute -top-1.5 -right-1.5 bg-[#FFBB00] rounded-full p-0.5 md:p-1 border-2 border-white shadow-sm">
                          <Star className="w-2 md:w-2.5 h-2 md:h-2.5 text-white fill-current" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 flex items-center gap-2 truncate">
                        <span className="truncate">{user.name}</span>
                        {user.userId === currentUser?._id && (
                          <span className="shrink-0 px-1.5 py-0.5 bg-orange-100 text-[#D0864B] rounded text-[8px] md:text-[10px] font-black uppercase tracking-tight">
                            You
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-0.5">
                        <div className="text-[9px] md:text-[11px] font-medium text-slate-400 truncate">{user.badge}</div>
                        {/* Mobile Stats Display */}
                        <div className="sm:hidden flex items-center gap-2">
                           <span className="text-[9px] font-black text-[#D0864B] flex items-center gap-0.5">
                             <Zap className="w-2.5 h-2.5 fill-current" /> {user.wpm}
                           </span>
                           <span className="text-[9px] font-black text-blue-500/70 flex items-center gap-0.5">
                             <Target className="w-2.5 h-2.5" /> {user.accuracy}%
                           </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                header: "Stats",
                key: "stats",
                headerClassName: "hidden sm:table-cell text-center",
                className: "hidden sm:table-cell py-6 text-center",
                render: (user) => (
                  <div className="flex flex-col items-center justify-center gap-1">
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <span className="px-2.5 py-1 bg-[#F3F4F6] rounded-full text-[10px] font-black text-[#D0864B] flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-current" />
                        {user.wpm} WPM
                      </span>
                      <span className="px-2.5 py-1 bg-[#F3F4F6] rounded-full text-[10px] font-black text-blue-500/70 flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {user.accuracy}%
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-gray-400 uppercase tracking-tighter opacity-60">
                      <span>{user.totalCompetitions || 0} Tests</span>
                    </div>
                  </div>
                ),
              },
              {
                header: "Score",
                key: "score",
                headerClassName: "text-right pr-4",
                className: "py-4 md:py-6 text-right pr-4",
                render: (user) => (
                  <div className="flex flex-col items-end">
                    <div className="flex items-baseline gap-1">
                      <span className="text-base md:text-xl font-black text-slate-900 group-hover:text-[#ECA468] transition-colors">
                        {getScore(user)}
                      </span>
                      <span className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase">PTS</span>
                    </div>
                    <div className="hidden md:block h-1 w-20 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-[#ECA468] rounded-full transition-all duration-1000"
                        style={{
                          width: `${Math.min((getScore(user) / 1000) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ),
              },
            ]}
            data={sortedRankings}
            isLoading={isLoading}
            rowClassName={(user, index) =>
              `group hover:bg-[#FDF9F2]/50 transition-colors duration-200 ${user.userId === currentUser?._id ? "bg-orange-50/50" : index < 3 ? "bg-orange-50/10" : ""}`
            }
            columnHeaderClassName="pb-4 md:pb-6 text-[#9CA3AF] text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em]"
            headerClassName="text-left"
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
                  <h2 className="text-2xl font-black text-[#111827]">How Scoring Works</h2>
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
                        Climbing the Hall of Fame requires a combination of raw speed (WPM) and surgical accuracy.
                      </p>

                      {/* Formula Card */}
                      <div className="bg-gradient-to-br from-orange-400 to-[#ECA468] p-8 rounded-[2rem] text-white shadow-lg relative overflow-hidden group">
                        <Sparkles className="absolute top-4 right-4 w-12 h-12 text-white/10 group-hover:rotate-12 transition-transform duration-500" />
                        <p className="text-orange-100 text-[10px] font-black uppercase tracking-widest mb-2">
                          The Core Formula
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xl md:text-3xl font-black tracking-tight">
                          <span>WPM</span>
                          <span className="text-orange-200">×</span>
                          <span>ACC%</span>
                          <span className="text-orange-200">×</span>
                          <span>Modifiers</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/20">
                          <span className="text-sm opacity-90 font-bold">
                            Accuracy 90 marks zero points multipliers.
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-5 bg-orange-50 rounded-2xl border border-orange-100">
                          <h4 className="font-bold text-orange-800 mb-1 flex items-center gap-2">
                            <Zap className="w-4 h-4" /> Velocity
                          </h4>
                          <p className="text-xs text-orange-700 font-medium">
                            Your speed in Words Per Minute (WPM) is the base for every calculation.
                          </p>
                        </div>
                        <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
                          <h4 className="font-bold text-blue-800 mb-1 flex items-center gap-2">
                            <Target className="w-4 h-4" /> Accuracy
                          </h4>
                          <p className="text-xs text-blue-700 font-medium">
                            Precision is non-negotiable. Mistakes drastically reduce your point generation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-6">
                    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 shadow-sm">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-1.5 leading-none">
                        <Trophy className="w-3 h-3" /> Activity Multipliers
                      </p>
                      <div className="space-y-4">
                        <MultiplierItem
                          icon={<BookOpen className="w-4 h-4" />}
                          label="Solo Practice"
                          multiplier="1.0x"
                        />
                        <MultiplierItem
                          icon={<UserCheck className="w-4 h-4 text-blue-500" />}
                          label="Quick Play"
                          multiplier="1.2x"
                        />
                        <MultiplierItem
                          icon={<Trophy className="w-4 h-4 text-[#FFBB00]" />}
                          label="Group Play"
                          multiplier="1.5x"
                        />
                      </div>
                    </div>

                    <div className="bg-orange-50/30 rounded-3xl p-6 border border-orange-100/50">
                      <h4 className="text-xs font-black uppercase tracking-widest text-[#D0864B] mb-2">Pro Tip</h4>
                      <p className="text-xs text-gray-600 leading-relaxed font-medium font-sans">
                        Group play sessions yield the highest point density. Mastering hard lessons in group play is the
                        fastest way to hit the top spot.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-orange-50/50 p-6 flex items-center justify-center border-t border-orange-50">
                <p className="text-xs font-bold text-[#D0864B]/60 uppercase tracking-widest text-center">
                  Live scores update upon session completion.
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
}> = ({ icon, label, multiplier }) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100 transition-transform group-hover:rotate-6">
        {icon}
      </div>
      <span className="font-bold text-gray-700 text-sm tracking-tight">{label}</span>
    </div>
    <span className="bg-white px-3 py-1 rounded-full text-[10px] font-black text-gray-400 border border-gray-100 shadow-sm">
      {multiplier}
    </span>
  </div>
);

const PodiumCard: React.FC<{
  user: LeaderboardEntry;
  rank: number;
  isPrimary?: boolean;
  badge: string;
  score: number;
}> = ({ user, rank, isPrimary, badge, score }) => {
  const Icon = rank === 1 ? Star : rank === 2 ? Trophy : Medal;
  const rankColors = rank === 1 ? "bg-[#FFBB00]" : rank === 2 ? "bg-[#ECA468]" : "bg-[#D0864B]";

  return (
    <div
      className={`bg-white rounded-[1.5rem] sm:rounded-[2.5rem] p-3 sm:p-8 flex flex-col items-center shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-[#FDE6C6] relative w-full ${isPrimary ? "scale-105 sm:scale-100 sm:-mt-12 sm:pb-12 border-2 border-[#FADDB8] bg-white ring-0 sm:ring-8 sm:ring-[#FDF9F2] -translate-y-4 sm:translate-y-0" : ""}`}
    >
      {/* Top Icon Badge */}
      <div
        className={`absolute -top-4 sm:-top-6 left-1/2 -translate-x-1/2 w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl flex items-center justify-center text-white shadow-lg ${rankColors}`}
      >
        <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
      </div>

      {/* Avatar Container */}
      <div className="relative mb-2 sm:mb-6 mt-1 sm:mt-2">
        <div
          className={`p-0.5 sm:p-1.5 rounded-full ${rank === 1 ? "bg-gradient-to-tr from-[#ECA468] to-[#FFD700]" : "bg-gray-100"}`}
        >
          <div className="bg-white p-0.5 sm:p-1 rounded-full">
            <img
              src={
                user.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
              }
              className={`${isPrimary ? "w-14 h-14 sm:w-24 sm:h-24" : "w-10 h-10 sm:w-16 sm:h-16"} rounded-full object-cover shadow-inner bg-gray-50`}
              alt={user.name}
            />
          </div>
        </div>
        <div
          className={`absolute -bottom-1.5 sm:-bottom-2 left-1/2 -translate-x-1/2 px-2 sm:px-4 py-0.5 rounded-full text-white font-black text-[8px] sm:text-xs shadow-md ${rankColors}`}
        >
          {rank}
        </div>
      </div>

      <h3 className="text-xs sm:text-xl font-black text-slate-800 mb-0.5 sm:mb-1 truncate max-w-full text-center px-1">
        {user.name}
      </h3>
      <div className={`font-black text-slate-900 mb-2 sm:mb-4 transition-all ${isPrimary ? "text-sm sm:text-3xl" : "text-xs sm:text-2xl"}`}>
        {score} <span className="text-[7px] sm:text-[10px] text-gray-400 font-bold uppercase ml-0.5 sm:ml-1 opacity-70">PTS</span>
      </div>

      <div className="grid grid-cols-2 gap-1 sm:gap-4 w-full mb-3 sm:mb-6 border-y border-gray-50 py-2 sm:py-3">
        <div className="flex flex-col items-center">
          <span className="text-[10px] sm:text-sm font-black text-slate-700">{user.wpm}</span>
          <span className="text-[6px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-tighter">WPM</span>
        </div>
        <div className="flex flex-col items-center border-l border-gray-50">
          <span className="text-[10px] sm:text-sm font-black text-slate-700">{user.accuracy}%</span>
          <span className="text-[6px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Acc</span>
        </div>
      </div>

      <div
        className={`px-2 sm:px-5 py-1 sm:py-2 ${rank === 1 ? "bg-orange-50 text-[#D0864B]" : "bg-[#F3F4F6] text-[#4B5563]"} rounded-full text-[6px] sm:text-[10px] font-black uppercase tracking-widest text-center truncate max-w-full`}
      >
        {badge}
      </div>
    </div>
  );
};

export default LeaderBoard;
