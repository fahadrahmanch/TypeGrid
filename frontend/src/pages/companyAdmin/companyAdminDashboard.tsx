import React, { useEffect, useState } from "react";
import CompanyAdminSidebar from "../../components/companyAdmin/layout/CompanyAdminSideNavbar";
import { 
  Users, 
  BookOpen, 
  Trophy, 
  Activity, 
  ArrowUpRight,
  TrendingDown,
  Target,
  Medal,
  UserCheck
} from "lucide-react";
import { getCompanyDashboardStats } from "../../api/companyAdmin/dashboard";

// Types for components
interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, isPositive, icon: Icon, iconColor }) => (
  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-indigo-100 shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${iconColor} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={24} className={iconColor.replace("bg-", "text-")} />
      </div>
      <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? "text-green-600" : "text-red-500"}`}>
        {isPositive ? <ArrowUpRight size={16} /> : <TrendingDown size={16} />}
        {change}
      </div>
    </div>
    <div>
      <p className="text-sm font-semibold text-slate-500 mb-1">{title}</p>
      <h3 className="text-3xl font-black text-slate-900">{value}</h3>
      <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">from last month</p>
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
    <div className="flex min-h-screen">
      <CompanyAdminSidebar />
      
      <main className="flex-1 p-8 md:p-12 overflow-y-auto w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Company <span className="text-indigo-600">Workspace</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Here's how your team is performing today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
          <StatCard 
            title="Total Members" 
            value={stats?.totalMembers?.value || 0} 
            change={stats?.totalMembers?.change || "+0%"} 
            isPositive={stats?.totalMembers?.isPositive ?? true} 
            icon={Users} 
            iconColor="bg-blue-500" 
          />
          <StatCard 
            title="Team Groups" 
            value={stats?.totalGroups?.value || 0} 
            change={stats?.totalGroups?.change || "+0%"} 
            isPositive={stats?.totalGroups?.isPositive ?? true} 
            icon={UserCheck} 
            iconColor="bg-teal-500" 
          />
          <StatCard 
            title="Active Contests" 
            value={stats?.totalContests?.value || 0} 
            change={stats?.totalContests?.change || "+0%"} 
            isPositive={stats?.totalContests?.isPositive ?? true} 
            icon={Trophy} 
            iconColor="bg-amber-500" 
          />
          <StatCard 
            title="Assigned Lessons" 
            value={stats?.totalLessonsAssigned?.value || 0} 
            change={stats?.totalLessonsAssigned?.change || "+0%"} 
            isPositive={stats?.totalLessonsAssigned?.isPositive ?? true} 
            icon={BookOpen} 
            iconColor="bg-indigo-500" 
          />
          <StatCard 
            title="Avg Team WPM" 
            value={stats?.averageMembersWPM?.value || 0} 
            change={stats?.averageMembersWPM?.change || "+0%"} 
            isPositive={stats?.averageMembersWPM?.isPositive ?? true} 
            icon={Activity} 
            iconColor="bg-emerald-500" 
          />
        </div>


        {/* Charts & Top Performers Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* User Activity Chart */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[2.5rem] border border-indigo-100 shadow-sm lg:col-span-2">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-black text-slate-900">Typing Activity</h3>
                <p className="text-sm text-slate-500 font-medium">Monthly typing tests completed by your team</p>
              </div>
            </div>
            
            {/* Custom SVG Line Chart */}
            <div className="relative h-64 w-full mt-4">
              <svg className="w-full h-full" viewBox="0 0 600 240">
                {/* Grid Lines */}
                {[0, 60, 120, 180, 240].map((y) => (
                  <line 
                    key={y} 
                    x1="40" y1={y} x2="580" y2={y} 
                    stroke="#4F46E5" strokeOpacity="0.1" strokeDasharray="4 4" 
                  />
                ))}
                
                {/* Activity Line */}
                {stats?.userActivityChart && stats.userActivityChart.length > 0 && (
                  <path 
                    d={`M ${stats.userActivityChart.map((p: any, i: number) => {
                      const maxVal = Math.max(...stats.userActivityChart.map((x: any) => x.value), 10); // min scale is 10
                      const x = 60 + i * (480 / Math.max(stats.userActivityChart.length - 1, 1));
                      const y = 200 - (p.value / maxVal) * 160;
                      return `${i === 0 ? "" : "L"} ${x},${y}`;
                    }).join(" ")}`}
                    fill="none" 
                    stroke="#4F46E5" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                  />
                )}
                
                {/* Data Points */}
                {stats?.userActivityChart?.map((point: any, i: number) => {
                  const maxVal = Math.max(...stats.userActivityChart.map((x: any) => x.value), 10);
                  const x = 60 + i * (480 / Math.max(stats.userActivityChart.length - 1, 1));
                  const y = 200 - (point.value / maxVal) * 160;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="6" fill="#4F46E5" stroke="white" strokeWidth="2" />
                      <text x={x} y="230" textAnchor="middle" className="text-[10px] font-black fill-slate-400 uppercase tracking-widest">{point.label}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-[2.5rem] border border-indigo-100 shadow-sm lg:col-span-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900">Top Performers</h3>
              <div className="p-2 bg-amber-100 text-amber-600 rounded-full">
                <Medal size={20} />
              </div>
            </div>

            {stats?.topPerformers?.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500 font-medium">No performance data yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats?.topPerformers?.map((user: any, idx: number) => (
                  <div key={user._id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                    <div className="relative">
                      <img 
                        src={user.imageUrl || "https://res.cloudinary.com/demo/image/upload/v1690000000/default-profile.jpg"} 
                        alt={user.name} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-indigo-50"
                      />
                      {idx < 3 && (
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white
                          ${idx === 0 ? "bg-amber-400" : idx === 1 ? "bg-slate-400" : "bg-orange-400"}`}>
                          {idx + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 font-medium truncate">{user.wpm} WPM • {user.accuracy}% Acc</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-indigo-600">{user.score}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Score</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 gap-8 mb-10">
          {/* Average Accuracy Overview Banner */}
          <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between text-white">
            {/* Decorative background shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900/40 rounded-full blur-3xl -ml-20 -mb-20"></div>
            
            <div className="relative z-10 md:mr-8 text-center md:text-left mb-6 md:mb-0">
              <h3 className="text-2xl font-black mb-2">Team Accuracy Rate</h3>
              <p className="text-indigo-200 text-sm max-w-md">Your team's overall typing precision across all assignments and open tests.</p>
            </div>
            
            <div className="relative z-10 flex items-center gap-6 bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/20">
              <div className="p-4 bg-white text-indigo-600 rounded-2xl shadow-inner">
                <Target size={32} />
              </div>
              <div>
                <h2 className="text-5xl font-black tracking-tighter">{stats?.averageMembersAccuracy?.value || "0%"}</h2>
                <div className="flex items-center gap-2 text-indigo-200 mt-1">
                  <span className="text-sm font-bold uppercase tracking-widest">Average Value</span>
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
