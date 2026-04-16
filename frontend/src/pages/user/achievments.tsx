import React, { useState, useEffect } from "react";
import {
  Award,
  Trophy,
  Target,
  Zap,
  Users,
  CheckCircle2,
  Lock,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Calendar,
  Flame,
  Search,
} from "lucide-react";
import { getAllAchievements } from "../../api/user/achievments";
import Navbar from "../../components/user/Navbar";
import { useSelector } from "react-redux";

interface Achievement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  minWpm: number;
  minAccuracy: number;
  minGame: number;
  xp: number;
  isUnlocked: boolean;
}

const Achievements: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [activeTab, setActiveTab] = useState<"all" | "unlocked" | "locked">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getRarity = (xp: number): "common" | "rare" | "epic" | "legendary" => {
    if (xp < 100) return "common";
    if (xp < 500) return "rare";
    if (xp < 1000) return "epic";
    return "legendary";
  };

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const response = await getAllAchievements();
        const data = response.data.data || response.data || [];
        setAchievements(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  const filteredAchievements = achievements.filter((ach) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unlocked" && ach.isUnlocked) ||
      (activeTab === "locked" && !ach.isUnlocked);
    const matchesSearch = ach.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const unlockedCount = achievements.filter((ach) => ach.isUnlocked).length;
  const lockedCount = achievements.length - unlockedCount;
  const completionPercentage = achievements.length > 0 ? Math.round((unlockedCount / achievements.length) * 100) : 0;

  const getRarityStyles = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-yellow-100 text-yellow-700";
      case "rare":
        return "bg-orange-100 text-orange-700";
      case "epic":
        return "bg-purple-100 text-purple-700";
      case "legendary":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8EA] pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        {/* Header Profile Section */}
        {/* <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-6 mb-8 border border-white/60 shadow-xl relative overflow-hidden group">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden flex items-center justify-center bg-gray-100">
                                    {user?.imageUrl ? (
                                        <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <Users className="w-12 h-12 text-gray-400" />
                                    )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-[#FFF8EA] shadow-sm">
                                    <Award className="w-4 h-4" />
                                </div>
                            </div>

                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-black text-gray-900 mb-2">{user?.name || "Fahad"}</h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-500 font-medium">
                                <span className="flex items-center gap-1.5 bg-white/50 px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                                    <TrendingUp className="w-4 h-4 text-purple-500" />
                                    Level {user?.level || 12}
                                </span>
                                <span className="flex items-center gap-1.5 bg-white/50 px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                                    <Flame className="w-4 h-4 text-orange-500" />
                                    {user?.streak || 5} day streak
                                </span>
                                <span className="flex items-center gap-1.5 bg-white/50 px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    Joined {user?.joinedAt || "January 2024"}
                                </span>
                            </div>
                        </div>
                        </div>

                        <div className="flex items-center gap-8 w-full md:w-auto">
                            <div className="flex-1 md:flex-none text-center">
                                <span className="text-5xl font-black text-yellow-500 block mb-1">{completionPercentage}%</span>
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Complete</span>
                            </div>
                            <div className="w-px h-16 bg-gray-200 hidden md:block"></div>
                            <div className="flex-1 md:flex-none text-center">
                                <span className="text-3xl font-black text-gray-900 block mb-1">{unlockedCount}/{achievements.length}</span>
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Achievements</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 relative">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Level Progress</span>
                            <span className="text-xs font-bold text-gray-600">2850/3000 XP</span>
                        </div>
                        <div className="h-3 w-full bg-gray-200/50 rounded-full overflow-hidden border border-white/40 shadow-inner">
                            <div
                                className="h-full bg-gradient-to-r from-[#8B7355] to-[#B99F8D] rounded-full shadow-lg transition-all duration-1000"
                                style={{ width: `${completionPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                </div> */}

        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
          <div className="bg-gray-200/40 backdrop-blur-sm p-1.5 rounded-[22px] flex items-center gap-1 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 sm:flex-none px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "all"
                  ? "bg-[#8B7355] text-white shadow-lg shadow-[#8B7355]/20"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Award className="w-4 h-4" />
              All ({achievements.length})
            </button>
            <button
              onClick={() => setActiveTab("unlocked")}
              className={`flex-1 sm:flex-none px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "unlocked"
                  ? "bg-[#8B7355] text-white shadow-lg shadow-[#8B7355]/20"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Unlocked ({unlockedCount})
            </button>
            <button
              onClick={() => setActiveTab("locked")}
              className={`flex-1 sm:flex-none px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "locked"
                  ? "bg-[#8B7355] text-white shadow-lg shadow-[#8B7355]/20"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Lock className="w-4 h-4" />
              Locked ({lockedCount})
            </button>
          </div>

          <div className="relative w-full sm:w-72 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors group-focus-within:text-[#8B7355]" />
            <input
              type="text"
              placeholder="Search achievements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white/60 backdrop-blur-sm border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#8B7355]/5 focus:border-[#8B7355]/30 transition-all font-medium text-sm text-gray-700 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filteredAchievements.map((ach) => (
            <div
              key={ach.id}
              className={`group bg-white/50 backdrop-blur-sm rounded-[32px] p-6 border transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-gray-200/50 flex flex-col border-gray-100 shadow-sm ${!ach.isUnlocked ? "grayscale-[0.8] opacity-80" : ""}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-transform duration-500 group-hover:rotate-3 ${ach.isUnlocked ? "bg-yellow-50" : "bg-gray-100"}`}
                >
                  <img
                    src={ach.imageUrl}
                    alt={ach.title}
                    className={`w-10 h-10 object-contain ${!ach.isUnlocked ? "opacity-40" : ""}`}
                  />
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getRarityStyles(getRarity(ach.xp))}`}
                >
                  {getRarity(ach.xp)}
                </span>
              </div>

              <div className="flex-1">
                <h3 className={"text-lg font-bold mb-2 transition-colors text-gray-900"}>{ach.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 font-medium line-clamp-2">{ach.description}</p>
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-400/10 rounded-full text-xs font-black text-yellow-600">
                    <Zap className="w-3 h-3 fill-yellow-600" />
                    {ach.xp} XP
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-gray-100/50">
                {ach.isUnlocked ? (
                  <div className="w-full bg-green-50 text-green-600 px-4 py-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest border border-green-100 shadow-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Unlocked
                  </div>
                ) : (
                  <div className="w-full bg-gray-50 text-gray-400 px-4 py-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest border border-gray-100/50">
                    <Lock className="w-4 h-4" />
                    Locked
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <div className="text-center py-20 bg-white/30 backdrop-blur-sm rounded-[40px] border border-dashed border-gray-200 mb-12">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No achievements found</h3>
            <p className="text-gray-500 font-medium">Try adjusting your search or filters to see more results.</p>
          </div>
        )}

        {/* Pagination Section */}
        {/* <div className="flex justify-center items-center gap-3">
                    <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-gray-900 transition-all shadow-sm hover:shadow-md">
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 backdrop-blur-sm rounded-[24px] border border-gray-100 shadow-sm">
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#8B7355] text-white text-sm font-black shadow-lg shadow-[#8B7355]/20">1</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white text-sm font-bold text-gray-400 hover:text-gray-900 transition-all">2</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white text-sm font-bold text-gray-400 hover:text-gray-900 transition-all">3</button>
                        <span className="px-2 text-gray-300 font-bold">...</span>
                        <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white text-sm font-bold text-gray-400 hover:text-gray-900 transition-all">10</button>
                    </div>

                    <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-gray-900 transition-all shadow-sm hover:shadow-md">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div> */}
      </div>
    </div>
  );
};

export default Achievements;
