import React, { useState, useEffect } from "react";
import {
  Award,
  CheckCircle2,
  Lock,
  Zap,
  Search,
} from "lucide-react";
import { getAllAchievements } from "../../api/user/achievments";
import Navbar from "../../components/user/Navbar";




const Achievements: React.FC = () => {

  const [activeTab, setActiveTab] = useState<"all" | "unlocked" | "locked">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [achievements, setAchievements] = useState<any[]>([]);

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getRarity = (xp: number): "common" | "rare" | "epic" | "legendary" => {
    if (xp < 100) return "common";
    if (xp < 500) return "rare";
    if (xp < 1000) return "epic";
    return "legendary";
  };

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await getAllAchievements(debouncedSearch);
        const data = response.data.data || [];
        setAchievements(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAchievements();
  }, [debouncedSearch]);

  const filteredAchievements = achievements.filter((ach) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unlocked" && ach.isUnlocked) ||
      (activeTab === "locked" && !ach.isUnlocked);
    return matchesTab;
  });

  const unlockedCount = achievements.filter((ach) => ach.isUnlocked).length;
  const lockedCount = achievements.length - unlockedCount;


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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32">
        {/* Page Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">My Achievements</h1>
          <p className="text-sm md:text-base text-gray-500 font-medium">Track your progress and showcase your typing milestones.</p>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 mb-10">
          <div className="bg-gray-200/40 backdrop-blur-sm p-1.5 rounded-3xl flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
            <button
              onClick={() => setActiveTab("all")}
              className={`whitespace-nowrap flex-1 lg:flex-none px-6 md:px-8 py-3 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "all"
                  ? "bg-[#8B7355] text-white shadow-lg shadow-[#8B7355]/20"
                  : "text-gray-500 hover:text-gray-700 hover:bg-white/20"
              }`}
            >
              <Award className="w-4 h-4" />
              All ({achievements.length})
            </button>
            <button
              onClick={() => setActiveTab("unlocked")}
              className={`whitespace-nowrap flex-1 lg:flex-none px-6 md:px-8 py-3 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "unlocked"
                  ? "bg-[#8B7355] text-white shadow-lg shadow-[#8B7355]/20"
                  : "text-gray-500 hover:text-gray-700 hover:bg-white/20"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Unlocked ({unlockedCount})
            </button>
            <button
              onClick={() => setActiveTab("locked")}
              className={`whitespace-nowrap flex-1 lg:flex-none px-6 md:px-8 py-3 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
                activeTab === "locked"
                  ? "bg-[#8B7355] text-white shadow-lg shadow-[#8B7355]/20"
                  : "text-gray-500 hover:text-gray-700 hover:bg-white/20"
              }`}
            >
              <Lock className="w-4 h-4" />
              Locked ({lockedCount})
            </button>
          </div>

          <div className="relative group lg:w-80">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors group-focus-within:text-[#8B7355]" />
            <input
              type="text"
              placeholder="Search achievements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white/60 backdrop-blur-sm border border-white rounded-2xl outline-none focus:ring-4 focus:ring-[#8B7355]/5 focus:border-[#8B7355]/30 transition-all font-medium text-sm text-gray-700 placeholder:text-gray-400 shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredAchievements.map((ach) => (
            <div
              key={ach.id}
              className={`group bg-white/50 backdrop-blur-sm rounded-[2.5rem] p-6 md:p-8 border transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#8B7355]/10 flex flex-col border-white shadow-sm ${!ach.isUnlocked ? "grayscale opacity-80" : ""}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-inner transition-transform duration-500 group-hover:rotate-6 ${ach.isUnlocked ? "bg-[#FFF8EA]" : "bg-gray-100"}`}
                >
                  <img
                    src={ach.imageUrl}
                    alt={ach.title}
                    className={`w-10 h-10 md:w-12 md:h-12 object-contain ${!ach.isUnlocked ? "opacity-30" : ""}`}
                  />
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest ${getRarityStyles(getRarity(ach.xp))}`}
                >
                  {getRarity(ach.xp)}
                </span>
              </div>

              <div className="flex-1 space-y-3">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-tight">{ach.title}</h3>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed font-medium line-clamp-3">{ach.description}</p>
                <div className="flex items-center gap-2 pt-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#8B7355]/5 rounded-full text-[10px] md:text-xs font-black text-[#8B7355]">
                    <Zap className="w-3 h-3 fill-[#8B7355]" />
                    {ach.xp} XP
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100/50">
                {ach.isUnlocked ? (
                  <div className="w-full bg-[#8B7355] text-white px-4 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest shadow-lg shadow-[#8B7355]/20">
                    <CheckCircle2 className="w-4 h-4" />
                    Unlocked
                  </div>
                ) : (
                  <div className="w-full bg-white/50 text-gray-400 px-4 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest border border-gray-100">
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
          <div className="text-center py-20 bg-white/30 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-gray-200 mb-12 flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No achievements found</h3>
            <p className="text-gray-500 font-medium max-w-xs mx-auto">Try adjusting your search or filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;
