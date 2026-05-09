import { Link } from "react-router-dom";
import { getUserDataApi, getAnotherUserProfileApi } from "../../../api/user/userService";

import { myDiscussions } from "../../../api/user/disscussions";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { 
  Trophy, 
  Zap, 
  Target, 
  MessageSquare, 
  Edit2, 
  ShieldCheck, 
  ArrowRight,
  Medal,
  Calendar,
  Mail,
  Crown,
  Clock
} from "lucide-react";

interface ProfileDiv1Props {
  userId?: string;
}

const ProfileDiv1: React.FC<ProfileDiv1Props> = ({ userId }) => {
  const currentUser = useSelector((state: any) => state.auth.user);
  const isOwnProfile = !userId || userId === currentUser?._id;

  const [user, setUser] = useState({
    name: "",
    email: "",
    bio: "",
    imageUrl: "",
    age: "",
    gender: "",
    keyboardLayout: "",
  });

  const [stats, setStats] = useState({
    avgWpm: 0,
    avgAccuracy: 0,
    totalTests: 0,
  });
  const [level, setLevel] = useState(1);
  const [joinedAt, setJoinedAt] = useState("");
  const [achievements, setAchievements] = useState<any[]>([]);

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfileData() {
      try {
        setLoading(true);
        if (isOwnProfile) {
          const userDataRes = await getUserDataApi();
          const discussionsRes = await myDiscussions();

          if (userDataRes?.data?.user) {
            const u = userDataRes.data.user;
            setUser({
              name: u.name,
              email: u.email,
              bio: u.bio || "No bio yet...",
              imageUrl: u.imageUrl || "",
              age: u.age || "",
              gender: u.gender || "",
              keyboardLayout: u.KeyBoardLayout || "qwerty",
            });
            setStats({
              avgWpm: u.performance?.averageSpeed || 0,
              avgAccuracy: u.performance?.accuracy || 0,
              totalTests: u.performance?.competitions || 0,
            });
            setJoinedAt(u.joinedAt || "");
            setLevel(u.level || 1);
          }


          if (discussionsRes?.data?.data) {
            setPosts(discussionsRes.data.data.slice(0, 10));
          }
        } else if (userId) {
          const res = await getAnotherUserProfileApi(userId);
          if (res?.data?.success) {
            const { user, performance, discussions, achievements } = res.data.data;
            setUser({
              name: user.name,
              email: user.email,
              bio: user.bio || "No bio yet...",
              imageUrl: user.imageUrl || "",
              age: user.age || "",
              gender: user.gender || "",
              keyboardLayout: user.KeyBoardLayout || "qwerty",
            });
            setStats({
              avgWpm: performance.averageSpeed || 0,
              avgAccuracy: performance.accuracy || 0,
              totalTests: performance.competitions || 0,
            });
            setPosts(discussions || []);
            setAchievements(achievements || []);
            setLevel(user.level || 1);
            setJoinedAt(user.joinedAt || "");
          }
        }
      } catch (error) {
        console.error("Failed to load profile data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProfileData();
  }, [userId, isOwnProfile]);

  if (loading) {
    return (
      <div className="w-full flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#96705B]"></div>
      </div>
    );
  }
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 mt-12 md:mt-20 animate-in fade-in duration-700">
      {/* Banner Section */}
      <div className="relative h-40 md:h-64 rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-[#96705B] via-[#A68F6F] to-[#C4A484] overflow-hidden shadow-2xl mb-[-4rem] md:mb-[-5rem] z-0">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.2),transparent)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(0,0,0,0.1),transparent)]"></div>
        </div>
        <div className="absolute top-6 right-8 hidden md:block">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-white font-black text-xs uppercase tracking-widest">
            <Crown className="w-4 h-4 text-yellow-400" />
            Elite Member
          </div>
        </div>
      </div>

      {/* Profile Info Header */}
      <div className="relative z-10 px-4 md:px-12 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 mb-8 md:mb-12">
        <div className="relative group">
          <img
            src={user.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
            alt="Profile"
            className="w-32 h-32 md:w-48 md:h-48 rounded-[2rem] md:rounded-[3rem] border-[4px] md:border-[8px] border-white shadow-2xl object-cover bg-white"
          />
          {isOwnProfile && (
            <Link 
              to="/profile/edit"
              className="absolute bottom-1 right-1 md:bottom-2 md:right-2 p-2 md:p-3 bg-[#96705B] text-white rounded-xl md:rounded-2xl shadow-xl hover:scale-110 transition-transform border-2 md:border-4 border-white"
            >
              <Edit2 className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
          )}
        </div>

        <div className="flex-1 pb-2 md:pb-4 text-center md:text-left w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-center md:justify-start gap-2 md:gap-3 mb-3 md:mb-2">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">{user.name}</h1>
            <div className="flex items-center gap-2 bg-[#96705B]/10 px-3 py-1 rounded-full border border-[#96705B]/20 w-fit mx-auto md:mx-0">
              <Zap className="w-3.5 h-3.5 text-[#96705B] fill-current" />
              <span className="text-[10px] font-black text-[#96705B] uppercase tracking-widest">Level {level}</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 text-slate-500 font-bold text-xs md:text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#96705B]" />
              <span className="truncate max-w-[200px] md:max-w-none">{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#96705B]" />
              Joined {joinedAt ? new Date(joinedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Unknown"}
            </div>
          </div>
        </div>

        {isOwnProfile && (
          <div className="flex gap-3 pb-0 md:pb-4 w-full md:w-auto">
            <Link to="/subscription/manage" className="w-full md:w-auto">
              <button className="flex lg:flex items-center justify-center gap-2 w-full px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm">
                <ShieldCheck className="w-5 h-5" />
                Manage
              </button>
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 px-0 md:px-2">
        {/* Left Column: Stats & About */}
        <div className="lg:col-span-1 space-y-6 md:space-y-8">
          {/* Quick Stats */}
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
            <h3 className="text-lg md:text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-xl">
                <Zap className="w-5 h-5 text-orange-500" />
              </div>
              Performance
            </h3>
            <div className="space-y-5 md:space-y-6">
              <StatRow label="Average Speed" value={`${stats.avgWpm} WPM`} icon={Zap} color="text-orange-500" />
              <StatRow label="Accuracy" value={`${stats.avgAccuracy}%`} icon={Target} color="text-blue-500" />
              <StatRow label="Competitions" value={stats.totalTests} icon={Trophy} color="text-purple-500" />
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
            <h3 className="text-lg md:text-xl font-black text-slate-900 mb-4">About Me</h3>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium mb-6">
              {user.bio}
            </p>

            {/* Additional Details */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              {user.age && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Age</span>
                  <span className="text-sm font-bold text-slate-700">{user.age} Years</span>
                </div>
              )}
              {user.gender && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender</span>
                  <span className="text-sm font-bold text-slate-700 capitalize">{user.gender}</span>
                </div>
              )}
              {user.keyboardLayout && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Layout</span>
                  <span className="text-sm font-bold text-slate-700 uppercase">{user.keyboardLayout}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Discussions & Achievements */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/40">
            <div className="flex items-center justify-between mb-6 md:mb-8">
              <h3 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-3">
                <div className="p-2 md:p-2.5 bg-blue-100 rounded-xl md:rounded-2xl">
                  <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                </div>
                {isOwnProfile ? "My Discussions" : "Discussions"}
              </h3>
              {isOwnProfile && (
                <Link to="/discussions/my" className="text-xs md:text-sm font-black text-[#96705B] hover:underline flex items-center gap-1 group">
                  View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1 md:pr-2 custom-scrollbar">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <Link 
                    key={post.id || post._id} 
                    to={`/discussions/${post.id || post._id}`}
                    className="block group p-4 md:p-6 rounded-2xl md:rounded-3xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 gap-2">
                      <h4 className="font-black text-base md:text-lg text-slate-800 group-hover:text-[#96705B] transition-colors line-clamp-1">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full whitespace-nowrap">
                          {post.commentCount} Comments
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3 text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold">
                        {post.postedAt ? new Date(post.postedAt).toLocaleDateString("en-US", { 
                          month: "short", 
                          day: "numeric",
                          year: "numeric"
                        }) : "Recent"}
                      </span>
                    </div>
                    <p className="text-slate-500 line-clamp-2 text-xs md:text-sm font-medium leading-relaxed">
                      {post.content}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="text-center py-10 md:py-12 bg-slate-50/50 rounded-[2rem] md:rounded-[2.5rem] border border-dashed border-slate-200">
                  <MessageSquare className="w-10 h-10 md:w-12 md:h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">No discussions found</p>
                </div>
              )}
            </div>
          </div>

          {/* Achievements Placeholder */}
          <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-[#96705B]/10 blur-[80px] md:blur-[100px] rounded-full" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl font-black flex items-center gap-3">
                  <div className="p-2 md:p-2.5 bg-white/10 rounded-xl md:rounded-2xl backdrop-blur-md">
                    <Medal className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
                  </div>
                  Recent Badges
                </h3>
                {isOwnProfile && (
                  <Link to="/badges" className="text-[10px] md:text-xs font-black text-[#96705B] hover:text-[#C4A484] transition-colors">
                    VIEW ALL
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 md:gap-6 max-h-[200px] overflow-y-auto pr-1 md:pr-2 custom-scrollbar">
                {achievements.length > 0 ? (
                  achievements.map((achievement, i) => (
                    <div key={i} className="aspect-square bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center border border-white/5 group hover:bg-white/10 transition-all cursor-pointer relative">
                      <img src={achievement.icon} alt={achievement.name} className="w-6 h-6 md:w-8 md:h-8 object-contain group-hover:scale-110 transition-all duration-500" />
                      <div className="absolute -bottom-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-[8px] px-2 py-0.5 rounded pointer-events-none whitespace-nowrap z-20">
                        {achievement.name}
                      </div>
                    </div>
                  ))
                ) : (
                  [1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-square bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center border border-white/5 group hover:bg-white/10 transition-all cursor-pointer">
                      <Trophy className="w-6 h-6 md:w-8 md:h-8 text-white/20 group-hover:text-yellow-400 group-hover:scale-110 transition-all duration-500" />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatRow: React.FC<{ label: string; value: string | number; icon: any; color: string }> = ({ 
  label, value, icon: Icon, color 
}) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-3">
      <div className={`p-2.5 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="font-black text-slate-400 uppercase tracking-widest text-[10px]">{label}</span>
    </div>
    <span className="text-2xl font-black text-slate-900 group-hover:text-[#96705B] transition-colors">{value}</span>
  </div>
);

export default ProfileDiv1;
