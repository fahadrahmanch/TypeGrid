import React, { useEffect } from "react";
import { TodayChallenge } from "../../../api/user/dailyChallenge";
import Navbar from "../../../components/user/Navbar";
import { useNavigate } from "react-router-dom";
import { Flame, Trophy, Target, ChevronLeft, ChevronRight, Clock, Zap, Star } from "lucide-react";
import { ChallengeStatistics } from "../../../api/user/dailyChallenge";

interface IDailyChallenge {
  _id: string;
  challengeId: {
    _id: string;
    title: string;
    description: string;
    duration: number;
    lesson: string;
    difficulty: string;
  };
  date: string;
  goal: {
    _id: string;
    title: string;
    wpm: number;
    accuracy: number;
    description: string;
  };
  reward: {
    _id: string;
    xp: number;
    description: string;
  };
}

interface IChallengeStats {
  calendarData: Record<string, "completed" | "missed">;
  streakTracker: {
    currentStreak: number;
    nextMilestone: number;
  };
  weeklyGoal: {
    completedSessions: number;
    targetSessions: number;
  };
  statistics: {
    longestStreak: number;
    totalCompleted: number;
    monthCompleted: number;
    monthTarget: number;
  };
}

const DailyChallenge: React.FC = () => {
  const [challenge, setChallenge] = React.useState<IDailyChallenge | null>(null);
  const [stats, setStats] = React.useState<IChallengeStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  // Current Date logic
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const monthName = now.toLocaleString("default", { month: "long" });

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  useEffect(() => {
    const fetchTodayChallenge = async () => {
      try {
        const response = await TodayChallenge();
        setChallenge(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTodayChallenge();
  }, []);

  useEffect(() => {
    const fetchChallengeStatistics = async () => {
      try {
        const response = await ChallengeStatistics();
        setStats(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchChallengeStatistics();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF8EA] text-gray-900 font-sans pb-12">
      <Navbar />

      <div className="max-w-7xl mx-auto px-8 pt-10">
        <h1 className="text-4xl font-black text-gray-900 mb-10 tracking-tight">Daily Challenge</h1>

        {/* Top Section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Main Challenge Card */}
          <div className="flex-grow lg:flex-[2.5] bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-orange-100/50 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[360px]">
            {!challenge && !loading ? (
              <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                <Trophy className="w-16 h-16 text-orange-200 mb-6" />
                <h2 className="text-2xl font-black text-gray-800 mb-2">no have challenge</h2>
                <p className="text-gray-500 font-medium">Check back later for today's typing challenge!</p>
              </div>
            ) : (
              <>
                <div className="md:w-1/2 p-2 hidden md:block">
                  <div className="w-full h-full bg-[#FAECE1] rounded-[2rem] flex items-center justify-center overflow-hidden relative">
                    {/* Visual Artwork Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80">
                      <div className="w-40 h-54 bg-white shadow-xl rotate-[-2deg] flex items-center justify-center border-l border-t border-gray-100">
                        <span className="text-8xl font-black text-gray-200">
                          {challenge?.challengeId.difficulty === "hard"
                            ? "H"
                            : challenge?.challengeId.difficulty === "medium"
                              ? "M"
                              : "E"}
                        </span>
                        <div className="absolute bottom-8 w-24 h-16 bg-[#ECA468]/10 rounded-lg flex flex-wrap gap-1 p-2">
                          {Array.from({ length: 12 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-1 rounded-full ${i < (challenge?.reward.xp ? Math.min(i + 1, 12) : 0) ? "bg-[#ECA468]/50" : "bg-[#ECA468]/10"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-10 flex flex-col justify-center">
                  {loading ? (
                    <div className="space-y-4 animate-pulse">
                      <div className="h-4 w-20 bg-gray-200 rounded" />
                      <div className="h-8 w-64 bg-gray-200 rounded" />
                      <div className="h-4 w-48 bg-gray-200 rounded" />
                      <div className="h-10 w-32 bg-gray-200 rounded" />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            challenge?.challengeId.difficulty === "hard"
                              ? "bg-red-100 text-red-600"
                              : challenge?.challengeId.difficulty === "medium"
                                ? "bg-orange-100 text-orange-600"
                                : "bg-emerald-100 text-emerald-600"
                          }`}
                        >
                          {challenge?.challengeId.difficulty || "Normal"}
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <Clock className="w-3.5 h-3.5" />
                          {challenge?.challengeId.duration
                            ? `${Math.floor(challenge.challengeId.duration / 60)}m`
                            : "2m"}
                        </span>
                      </div>

                      <h2 className="text-2xl font-black text-gray-800 mb-4 tracking-tight leading-tight">
                        {challenge?.challengeId.title || "Daily Typing Challenge"}
                      </h2>
                      <p className="text-gray-500 font-medium mb-8 leading-relaxed max-w-sm">
                        {challenge?.challengeId.description ||
                          "Today's challenge awaits! Test your speed and accuracy."}
                      </p>

                      <div className="flex items-center gap-8 mb-10">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                            Target Goals
                          </span>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-xl border border-orange-50/50">
                              <Zap className="w-3.5 h-3.5 text-orange-400" />
                              <span className="text-sm font-black text-gray-700">
                                {challenge?.goal.wpm || 0} <span className="text-[10px] text-gray-400">WPM</span>
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-xl border border-blue-50/50">
                              <Target className="w-3.5 h-3.5 text-blue-400" />
                              <span className="text-sm font-black text-gray-700">
                                {challenge?.goal.accuracy || 0}
                                <span className="text-[10px] text-gray-400">%</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col border-l border-gray-100 pl-8">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                            Rewards
                          </span>
                          <div className="flex items-center gap-2 bg-yellow-50/50 px-3 py-1.5 rounded-xl border border-yellow-100/50">
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-black text-yellow-700">
                              +{challenge?.reward.xp || 0} <span className="text-[10px]">XP</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/daily-challenge/${challenge?._id}`)}
                        className="w-fit px-10 py-4 bg-[#ECA468] hover:bg-[#D0864B] text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-[#ECA468]/20 transition-all hover:scale-105 active:scale-95"
                      >
                        Start Challenge
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Calendar Card */}
          <div className="lg:flex-1 bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-orange-100/50 p-8 shadow-sm min-w-[320px]">
            <div className="flex items-center justify-between mb-8">
              <button className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-black text-gray-800 uppercase tracking-widest">
                {monthName} {currentYear}
              </span>
              <button className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4 text-center">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <span key={d} className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  {d}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {monthDays.map((d) => {
                const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, "0")}-${d.toString().padStart(2, "0")}`;
                const status = stats?.calendarData[dateStr];
                const isSuccess = status === "completed";
                const isFail = status === "missed";
                return (
                  <div
                    key={d}
                    className={`aspect-square flex items-center justify-center text-xs font-black rounded-lg transition-all
                    ${
                      isSuccess
                        ? "bg-emerald-500 text-white shadow-sm"
                        : isFail
                          ? "bg-red-500 text-white shadow-sm"
                          : "text-gray-600 hover:bg-white/60"
                    }`}
                  >
                    {d}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
          {/* Streak Tracker */}
          <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-orange-100/50 p-8 shadow-sm flex flex-col items-center">
            <div className="flex items-center gap-2 mb-8 w-full border-b border-orange-100/30 pb-4">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Streak Tracker</span>
            </div>

            <div className="relative mb-8">
              <div className="w-32 h-32 rounded-full border-8 border-orange-50 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <Flame className="w-10 h-10 text-orange-500 fill-orange-500 mb-1" />
                  <span className="text-3xl font-black text-gray-800">
                    {stats?.streakTracker.currentStreak || 0} Days
                  </span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Current Streak</span>
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-gray-600 border-4 border-[#FFF8EA] rounded-full flex items-center justify-center text-[10px] font-black text-white">
                {stats?.streakTracker.currentStreak || 0}
              </div>
            </div>

            <div className="w-full space-y-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-gray-400">Next milestone</span>
                  <span className="text-orange-500">
                    {stats?.streakTracker.currentStreak || 0}/{stats?.streakTracker.nextMilestone || 5} days
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-800 rounded-full"
                    style={{
                      width: `${((stats?.streakTracker.currentStreak || 0) / (stats?.streakTracker.nextMilestone || 5)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-[#FAFAFB] rounded-2xl p-4 flex flex-col items-center gap-2 border border-gray-100/50">
                  <Trophy className="w-4 h-4 text-blue-400" />
                  <span className="text-lg font-black text-gray-800">{stats?.statistics.longestStreak || 0}</span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Best Streak</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column (Goals & Progress) */}
          <div className="flex flex-col gap-8 h-full">
            {/* Weekly Goal */}
            <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-orange-100/50 p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-8 border-b border-orange-100/30 pb-4">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Weekly Goal</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider">
                    Sessions this week
                  </span>
                  <span className="text-[10px] font-black text-gray-400">
                    {stats?.weeklyGoal.completedSessions || 0}/{stats?.weeklyGoal.targetSessions || 7}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-100/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-900 rounded-full"
                    style={{
                      width: `${((stats?.weeklyGoal.completedSessions || 0) / (stats?.weeklyGoal.targetSessions || 7)) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-[10px] font-bold text-gray-400 mt-2">
                  {(stats?.weeklyGoal.targetSessions || 7) - (stats?.weeklyGoal.completedSessions || 0)} sessions
                  remaining
                </p>
              </div>
            </div>

            {/* Total Progress */}
            {/* <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-orange-100/50 p-8 shadow-sm flex-1">
                <div className="flex items-center gap-2 mb-8 border-b border-orange-100/30 pb-4">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80">Total Progress</span>
                </div>
                <div className="space-y-2">
                    <span className="text-2xl font-black text-gray-800">12,450</span>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Words typed</p>
                    <p className="text-[10px] text-emerald-500 font-bold mt-2">+245 this week</p>
                </div>
            </div> */}
          </div>

          {/* Achievements Grid */}
          {/* <div className="md:col-span-2 bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-orange-100/50 p-8 shadow-sm h-full group">
            <div className="flex items-center justify-between mb-8 border-b border-orange-100/30 pb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-orange-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Achievements</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {achievements.map((ach, idx) => (
                    <div key={idx} className={`p-5 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default ${ach.unlocked ? 'bg-emerald-50/20 border-emerald-100/30' : 'bg-[#FAFAFB]/30 border-gray-100/20 shadow-sm'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:rotate-[3deg] ${ach.unlocked ? 'bg-emerald-100 text-emerald-600 shadow-sm' : 'bg-orange-50/50 text-orange-400'}`}>
                                    {ach.icon}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-gray-800 tracking-tight">{ach.title}</span>
                                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{ach.desc}</span>
                                </div>
                            </div>
                            {ach.unlocked && (
                                <div className="flex flex-col items-end gap-1">
                                    <span className="px-2 py-0.5 bg-emerald-600 text-white text-[7px] font-black uppercase tracking-widest rounded-md shadow-sm">Unlocked</span>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <div className="w-full h-1.5 bg-gray-100/50 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${ach.unlocked ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-[#4A2D1F]/80'}`} 
                                    style={{ width: `${Math.min((ach.progress / ach.target) * 100, 100)}%` }} 
                                />
                            </div>
                            <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-400">
                                <span>{ach.progress}/{ach.target}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default DailyChallenge;
