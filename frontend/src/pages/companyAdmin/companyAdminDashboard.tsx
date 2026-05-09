import React, { useEffect, useState } from "react";
import CompanyAdminSidebar from "../../components/companyAdmin/layout/CompanyAdminSideNavbar";
import { 
  Users, 
  BookOpen, 
  Trophy, 
  Activity, 


  Target,
  Medal,
  UserCheck
} from "lucide-react";
import { getCompanyDashboardStats } from "../../api/companyAdmin/dashboard";

// Types for components
interface StatCardProps {
  title: string;
  value: string | number;

  icon: React.ElementType;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value,  icon: Icon, iconColor }) => (
  <div className="bg-white/80 backdrop-blur-sm p-2.5 md:p-6 rounded-xl md:rounded-3xl border border-indigo-100 shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="flex justify-between items-start mb-1.5 md:mb-4">
      <div className={`p-1.5 md:p-3 rounded-lg md:rounded-2xl ${iconColor} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={14} className={`${iconColor.replace("bg-", "text-")} md:w-6 md:h-6`} />
      </div>
      {/* <div className={`flex items-center gap-0.5 text-[7px] md:text-sm font-bold ${isPositive ? "text-green-600" : "text-red-500"}`}>
        {isPositive ? <ArrowUpRight size={10} className="md:w-4 md:h-4" /> : <TrendingDown size={10} className="md:w-4 md:h-4" />}
        {change}
      </div> */}
    </div>
    <div>
      <p className="text-[7px] md:text-sm font-semibold text-slate-500 mb-0.5 md:mb-1 truncate line-clamp-1">{title}</p>
      <h3 className="text-sm md:text-3xl font-black text-slate-900 truncate">{value}</h3>
      <p className="text-[8px] md:text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold hidden md:block">from last month</p>
    </div>
  </div>
);

const CompanyAdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getCompanyDashboardStats();
        setStats(response.data.data);
      } catch (error) {
        console.error("Error fetching company dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#F8FAFC] items-center justify-center">
        <div className="text-xl font-bold text-indigo-600 animate-pulse">Loading Workspace...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen ">
      <CompanyAdminSidebar />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 overflow-y-auto pt-24 md:pt-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 md:mb-10">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Company <span className="text-indigo-600">Workspace</span>
            </h1>
            <p className="text-sm md:text-base text-slate-500 font-medium mt-1 md:mt-2">Review your team's real-time performance metrics.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 md:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6 mb-8 md:mb-10">
            <StatCard 
              title="Total Members" 
              value={stats?.totalMembers?.value || 0} 
              // change={stats?.totalMembers?.change || "+0%"} 
              // isPositive={stats?.totalMembers?.isPositive ?? true} 
              icon={Users} 
              iconColor="bg-blue-500" 
            />
            <StatCard 
              title="Team Groups" 
              value={stats?.totalGroups?.value || 0} 
              // change={stats?.totalGroups?.change || "+0%"} 
              // isPositive={stats?.totalGroups?.isPositive ?? true} 
              icon={UserCheck} 
              iconColor="bg-teal-500" 
            />
            <StatCard 
              title="Active Contests" 
              value={stats?.totalContests?.value || 0} 
              // change={stats?.totalContests?.change || "+0%"} 
              // isPositive={stats?.totalContests?.isPositive ?? true} 
              icon={Trophy} 
              iconColor="bg-amber-500" 
            />
            <StatCard 
              title="Assigned Lessons" 
              value={stats?.totalLessonsAssigned?.value || 0} 
              // change={stats?.totalLessonsAssigned?.change || "+0%"} 
              // isPositive={stats?.totalLessonsAssigned?.isPositive ?? true} 
              icon={BookOpen} 
              iconColor="bg-indigo-500" 
            />
            <StatCard 
              title="Avg Team WPM" 
              value={stats?.averageMembersWPM?.value || 0} 
              // change={stats?.averageMembersWPM?.change || "+0%"} 
              // isPositive={stats?.averageMembersWPM?.isPositive ?? true} 
              icon={Activity} 
              iconColor="bg-emerald-500" 
            />
          </div>

          {/* Charts & Top Performers Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-10">
            
            {/* User Activity Chart */}
            <div className="bg-white/80 backdrop-blur-sm p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-indigo-100 shadow-sm lg:col-span-2 overflow-hidden">
              <div className="flex justify-between items-center mb-6 md:mb-8">
                <div>
                  <h3 className="text-lg md:text-xl font-black text-slate-900">Typing Activity</h3>
                  <p className="text-xs md:text-sm text-slate-500 font-medium">Monthly performance engagement</p>
                </div>
              </div>
              
              {/* Custom SVG Line Chart */}
              <div className="relative h-48 md:h-64 w-full">
                <svg className="w-full h-full" viewBox="0 0 600 240" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  {[0, 60, 120, 180, 240].map((y) => (
                    <line 
                      key={y} 
                      x1="0" y1={y} x2="600" y2={y} 
                      stroke="#4F46E5" strokeOpacity="0.1" strokeDasharray="4 4" 
                    />
                  ))}
                  
                  {/* Activity Line */}
                  {stats?.userActivityChart && stats.userActivityChart.length > 0 && (
                    <path 
                      d={`M ${stats.userActivityChart.map((p: any, i: number) => {
                        const maxVal = Math.max(...stats.userActivityChart.map((x: any) => x.value), 10);
                        const x = i * (600 / Math.max(stats.userActivityChart.length - 1, 1));
                        const y = 200 - (p.value / maxVal) * 160;
                        return `${i === 0 ? "" : "L"} ${x},${y}`;
                      }).join(" ")}`}
                      fill="none" 
                      stroke="#4F46E5" 
                      strokeWidth="4" 
                      strokeLinecap="round" 
                    />
                  )}
                </svg>
              </div>
              <div className="flex justify-between mt-4 px-1">
                 {stats?.userActivityChart?.map((p:any, i:number) => (
                   <span key={i} className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.label}</span>
                 ))}
              </div>
            </div>

            {/* Top Performers */}
            <div className="bg-white/80 backdrop-blur-sm p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-indigo-100 shadow-sm lg:col-span-1">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg md:text-xl font-black text-slate-900">Top Performers</h3>
                <div className="p-2 bg-amber-100 text-amber-600 rounded-full">
                  <Medal size={20} />
                </div>
              </div>

              {stats?.topPerformers?.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-xs md:text-sm text-slate-500 font-medium">No performance data yet.</p>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {stats?.topPerformers?.map((user: any, idx: number) => (
                    <div key={user._id} className="flex items-center gap-3 md:gap-4 p-2 md:p-3 hover:bg-slate-50 rounded-xl transition-colors group">
                      <div className="relative shrink-0">
                        <img 
                          src={user.imageUrl || "https://res.cloudinary.com/demo/image/upload/v1690000000/default-profile.jpg"} 
                          alt={user.name} 
                          className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-indigo-50 group-hover:border-indigo-200 transition-colors"
                        />
                        {idx < 3 && (
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-[8px] md:text-[10px] font-bold text-white border-2 border-white
                            ${idx === 0 ? "bg-amber-400" : idx === 1 ? "bg-slate-400" : "bg-orange-400"}`}>
                            {idx + 1}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate text-sm md:text-base">{user.name}</p>
                        <p className="text-[10px] md:text-xs text-slate-500 font-medium truncate">{user.wpm} WPM • {user.accuracy}% Acc</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs md:text-sm font-black text-indigo-600">{user.score}</p>
                        <p className="text-[8px] md:text-[10px] text-slate-400 uppercase font-bold tracking-wider">Score</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Third Row */}
          <div className="mb-10">
            {/* Average Accuracy Overview Banner */}
            <div className="bg-indigo-600 p-6 md:p-10 rounded-2xl md:rounded-[3rem] shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between text-white text-center md:text-left">
              {/* Decorative background shapes */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900/40 rounded-full blur-3xl -ml-20 -mb-20"></div>
              
              <div className="relative z-10 md:mr-8 mb-6 md:mb-0">
                <h3 className="text-xl md:text-3xl font-black mb-2 md:mb-3">Team Accuracy Rate</h3>
                <p className="text-indigo-100 text-xs md:text-base max-w-md">The collective typing precision of your entire organization across all evaluations.</p>
              </div>
              
              <div className="relative z-10 flex items-center gap-4 md:gap-8 bg-white/10 p-5 md:p-8 rounded-[2rem] backdrop-blur-md border border-white/20">
                <div className="p-3 md:p-5 bg-white text-indigo-600 rounded-2xl shadow-inner shrink-0">
                  <Target size={32} className="md:w-10 md:h-10" />
                </div>
                <div className="text-left">
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">{stats?.averageMembersAccuracy?.value || "0%"}</h2>
                  <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-indigo-200 mt-2">Precision Metric</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyAdminDashboard;
