import React, { useEffect, useState } from "react";
import CompanyUserNavbar from "../../components/companyUser/layout/companyUserNavbar";
import { getLeaderboard } from "../../api/companyUser/leaderboard";
import { Trophy, Medal, Star, Zap, ArrowLeft, Loader2, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
  const navigate = useNavigate();

  useEffect(() => {
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
                <h1 className="text-3xl font-black text-[#111827] tracking-tight">
                  Company Leaderboard
                </h1>
              </div>
              <p className="text-gray-500 font-medium">
                The absolute fastest typists in your organization.
              </p>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-[#FDE6C6] shadow-sm flex items-center gap-1">
            {(['weekly', 'monthly', 'all'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  filter === f 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                {f === 'all' ? 'All Time' : f === 'weekly' ? 'This Week' : 'This Month'}
              </button>
            ))}
          </div>
        </div>

        {/* Podium / Top 3 Display */}
        {!isLoading && sortedRankings.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mt-4 mb-2">
            {/* 2nd Place */}
            <PodiumCard user={sortedRankings[1]} rank={2} color="slate" delay="delay-100" score={getScore(sortedRankings[1])} />
            {/* 1st Place */}
            <PodiumCard user={sortedRankings[0]} rank={1} color="orange" delay="delay-0" isLarge score={getScore(sortedRankings[0])} />
            {/* 3rd Place */}
            <PodiumCard user={sortedRankings[2]} rank={3} color="amber" delay="delay-200" score={getScore(sortedRankings[2])} />
          </div>
        )}

        {/* Full List */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-orange-900/5 border border-[#FDE6C6] overflow-hidden">
          {isLoading ? (
            <div className="py-32 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 text-orange-400 animate-spin" />
              <p className="text-gray-400 font-bold animate-pulse">Calculating rankings...</p>
            </div>
          ) : sortedRankings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-orange-50/50 border-b border-[#FDE6C6]">
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Rank</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Typist</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Stats</th>
                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-50">
                  {sortedRankings.map((user, index) => (
                    <tr 
                      key={user.userId || Math.random().toString()} 
                      className={`group hover:bg-orange-50/30 transition-colors duration-200 ${index < 3 ? 'bg-orange-100/10' : ''}`}
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <span className={`
                            w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm
                            ${index === 0 ? 'bg-orange-100 text-orange-600 border border-orange-200 shadow-sm' : 
                              index === 1 ? 'bg-slate-100 text-slate-600 border border-slate-200' :
                              index === 2 ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                              'text-gray-400'}
                          `}>
                            {index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img 
                              src={user.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
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
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Active Typist</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
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
                      </td>
                      <td className="px-8 py-5 text-right">
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
                              style={{ width: `${Math.min((getScore(user) / 500) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-24 text-center">
              <Trophy className="w-16 h-16 text-gray-100 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No rankings yet!</h3>
              <p className="text-gray-400 max-w-xs mx-auto">Complete your first lesson or contest to appear on the leaderboard.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const PodiumCard: React.FC<{ user: LeaderboardEntry; rank: number; color: string; delay: string; isLarge?: boolean; score: number }> = ({ 
  user, rank, color, delay, isLarge, score 
}) => {
  const colorMap: Record<string, any> = {
    orange: { bg: 'bg-orange-500', text: 'text-orange-600', ring: 'ring-orange-200', light: 'bg-orange-50', icon: Trophy },
    slate: { bg: 'bg-slate-400', text: 'text-slate-600', ring: 'ring-slate-200', light: 'bg-slate-50', icon: Medal },
    amber: { bg: 'bg-amber-600', text: 'text-amber-700', ring: 'ring-amber-200', light: 'bg-amber-50', icon: Medal }
  };

  const style = colorMap[color];
  const Icon = style.icon;

  return (
    <div className={`
      flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both ${delay}
      ${isLarge ? 'order-1 md:order-2 mb-8' : rank === 2 ? 'order-2 md:order-1' : 'order-3'}
    `}>
      <div className="relative">
        <div className={`
          ${isLarge ? 'w-32 h-32' : 'w-24 h-24'} 
          rounded-3xl border-4 border-white shadow-2xl relative overflow-hidden group
        `}>
          <img 
            src={user.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
            alt={user.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 bg-gray-100" 
          />
          <div className={`absolute bottom-0 left-0 w-full ${style.bg} h-1.5 opacity-80`} />
        </div>
        <div className={`
          absolute -bottom-3 -right-3 w-10 h-10 ${style.bg} text-white rounded-xl shadow-lg
          flex items-center justify-center font-black border-2 border-white
        `}>
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
          <span className="flex items-center gap-0.5"><Zap className="w-3 h-3 text-orange-400" /> {user.wpm}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <span className="flex items-center gap-0.5"><Target className="w-3 h-3 text-blue-400" /> {user.accuracy}%</span>
        </div>
      </div>
    </div>
  );
};

export default CompanyLeaderBoard;