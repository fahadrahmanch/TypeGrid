import React from "react";
import SideNavbar from "../../components/admin/layout/Navbar/SideNabar";
import { 
  Users, 
  UserCheck, 
  Crown, 
  Trophy, 
  DollarSign,
  Building2,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";
import { getDashboardStats } from "../../api/admin/dashboard";

// Types for components
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, iconColor }) => (
  <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-[1.5rem] md:rounded-3xl border border-[#ECA468]/10 shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="flex justify-between items-start mb-2 md:mb-4">
      <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl ${iconColor} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={20} className={`${iconColor.replace("bg-", "text-")} md:w-6 md:h-6`} />
      </div>
      {/* <div className={`flex items-center gap-0.5 md:gap-1 text-[10px] md:text-sm font-bold ${isPositive ? "text-green-600" : "text-red-500"}`}>
        {isPositive ? <ArrowUpRight size={14} className="md:w-4 md:h-4" /> : <TrendingDown size={14} className="md:w-4 md:h-4" />}
        {change}
      </div> */}
    </div>
    <div>
      <p className="text-[10px] md:text-sm font-semibold text-gray-500 mb-0.5 md:mb-1">{title}</p>
      <h3 className="text-xl md:text-3xl font-black text-[#1A1512] truncate">{value}</h3>
      <p className="text-[8px] md:text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold hidden md:block">from last month</p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        setStats(response.data.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#FAF5E9] items-center justify-center">
        <div className="text-xl font-bold text-[#D0864B] animate-pulse font-black uppercase tracking-widest">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FAF5E9]">
      <SideNavbar />
      
      <main className="flex-1 p-4 md:p-12 overflow-y-auto pt-24 md:pt-12">
        {/* Header */}
        <div className="mb-6 md:mb-10">
          <h1 className="text-2xl md:text-4xl font-black text-[#1A1512] tracking-tight">
            Admin <span className="text-[#D0864B]">Dashboard</span>
          </h1>
          <p className="text-[11px] md:text-sm text-gray-500 font-medium mt-1 md:mt-2">Welcome back! Monitoring platform activity.</p>
        </div>

        {/* Stats Grid - 4 columns on medium/large screens as requested */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6 mb-8 md:mb-10">
          <StatCard 
            title="Total Users" 
            value={stats?.totalUsers.value.toLocaleString()} 
            // change={stats?.totalUsers.change} 
            // isPositive={stats?.totalUsers.isPositive} 
            icon={Users} 
            iconColor="bg-blue-500" 
          />
          <StatCard 
            title="Active Users" 
            value={stats?.activeUsers.value.toLocaleString()} 
            // change={stats?.activeUsers.change} 
            // isPositive={stats?.activeUsers.isPositive} 
            icon={UserCheck} 
            iconColor="bg-teal-500" 
          />
          <StatCard 
            title="Subscribers" 
            value={stats?.premiumSubscribers.value.toLocaleString()} 
            // change={stats?.premiumSubscribers.change} 
            // isPositive={stats?.premiumSubscribers.isPositive} 
            icon={Crown} 
            iconColor="bg-amber-500" 
          />
          <StatCard 
            title="Competitions" 
            value={stats?.competitions.value.toLocaleString()} 
            // change={stats?.competitions.change} 
            // isPositive={stats?.competitions.isPositive} 
            icon={Trophy} 
            iconColor="bg-orange-500" 
          />
          <StatCard 
            title="Revenue" 
            value={stats?.monthlyRevenue.value} 
            // change={stats?.monthlyRevenue.change} 
            // isPositive={stats?.monthlyRevenue.isPositive} 
            icon={DollarSign} 
            iconColor="bg-emerald-500" 
          />
        </div>


        {/* Charts Section - Side by side on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-10">
          {/* User Activity & Competitions Chart */}
          <div className="bg-white/80 backdrop-blur-sm p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-[#ECA468]/10 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center mb-6 md:mb-8">
              <div>
                <h3 className="text-base md:text-xl font-black text-[#1A1512]">User Activity</h3>
                <p className="text-[10px] md:text-sm text-gray-500 font-medium">Monthly engagement overview</p>
              </div>
            </div>
            
            {/* Custom SVG Line Chart - Responsive viewBox */}
            <div className="relative h-48 md:h-64 w-full">
              <svg className="w-full h-full" viewBox="0 0 600 240" preserveAspectRatio="none">
                {/* Grid Lines */}
                {[0, 60, 120, 180, 240].map((y) => (
                  <line 
                    key={y} 
                    x1="0" y1={y} x2="600" y2={y} 
                    stroke="#ECA468" strokeOpacity="0.1" strokeDasharray="4 4" 
                  />
                ))}
                
                {/* Activity Line */}
                {stats?.userActivityChart && (
                  <path 
                    d={`M ${stats.userActivityChart.map((p: any, i: number) => {
                      const maxVal = Math.max(...stats.userActivityChart.map((x: any) => x.value), 100);
                      const x = i * (600 / (stats.userActivityChart.length - 1));
                      const y = 200 - (p.value / maxVal) * 160;
                      return `${i === 0 ? "" : "L"} ${x},${y}`;
                    }).join(" ")}`}
                    fill="none" 
                    stroke="#D0864B" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                  />
                )}
                
                {/* Data Points */}
                {stats?.userActivityChart.map((point: any, i: number) => {
                  const maxVal = Math.max(...stats.userActivityChart.map((x: any) => x.value), 100);
                  const x = i * (600 / (stats.userActivityChart.length - 1));
                  const y = 200 - (point.value / maxVal) * 160;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="6" fill="#D0864B" stroke="white" strokeWidth="2" />
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="flex justify-between mt-4 px-2">
               {stats?.userActivityChart.map((p:any, i:number) => (
                 <span key={i} className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">{p.label}</span>
               ))}
            </div>
          </div>

          {/* Revenue Overview Bar Chart */}
          <div className="bg-white/80 backdrop-blur-sm p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-[#ECA468]/10 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center mb-6 md:mb-8">
              <div>
                <h3 className="text-base md:text-xl font-black text-[#1A1512]">Revenue Overview</h3>
                <p className="text-[10px] md:text-sm text-gray-500 font-medium">Monthly subscription revenue</p>
              </div>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="relative h-48 md:h-64 w-full">
              <svg className="w-full h-full" viewBox="0 0 600 240" preserveAspectRatio="none">
                {/* Bars */}
                {stats?.revenueChart.map((bar: any, i: number) => {
                  const barWidth = 30;
                  const spacing = 600 / stats.revenueChart.length;
                  const x = (i + 0.5) * spacing;
                  const maxVal = Math.max(...stats.revenueChart.map((x: any) => x.value), 1000);
                  const height = (bar.value / maxVal) * 180;
                  const y = 200 - height;
                  
                  return (
                    <g key={i}>
                      <rect 
                        x={x - barWidth/2} y={y} 
                        width={barWidth} height={height} 
                        rx="6" fill="#1A1512" 
                        className="hover:fill-[#D0864B] transition-colors duration-300 cursor-pointer"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
            <div className="flex justify-between mt-4 px-2">
               {stats?.revenueChart.map((p:any, i:number) => (
                 <span key={i} className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">{p.label}</span>
               ))}
            </div>
          </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Accuracy Distribution */}
          <div className="bg-white/80 backdrop-blur-sm p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-[#ECA468]/10 shadow-sm col-span-1">
            <h3 className="text-base md:text-xl font-black text-[#1A1512] mb-6 md:mb-8">Accuracy</h3>
            
            <div className="relative flex flex-col items-center">
              <svg className="w-48 h-48 md:w-64 md:h-64 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1A1512" strokeWidth="12" strokeDasharray={`${(parseInt(stats?.accuracyDistribution[0].percent) || 0) * 2.51} 251.2`} strokeDashoffset="0" />
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#D0864B" strokeWidth="12" strokeDasharray={`${(parseInt(stats?.accuracyDistribution[1].percent) || 0) * 2.51} 251.2`} strokeDashoffset={`-${(parseInt(stats?.accuracyDistribution[0].percent) || 0) * 2.51}`} />
              </svg>
              
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="block text-2xl md:text-3xl font-black text-[#1A1512]">{stats?.averageAccuracy}</span>
                <span className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Average</span>
              </div>
            </div>

            <div className="mt-6 md:mt-8 space-y-3 md:space-y-4">
              {stats?.accuracyDistribution.map((item: any, i: number) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${i === 0 ? "bg-[#1A1512]" : "bg-[#D0864B]"}`} />
                    <span className="text-xs md:text-sm font-bold text-gray-600">{item.label}</span>
                  </div>
                  <span className="font-black text-xs md:text-base text-[#1A1512]">{item.percent}</span>
                </div>
              ))}
            </div>
          </div>


          {/* Company Overview Section */}
          <div className="bg-white/80 backdrop-blur-sm p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-[#ECA468]/10 shadow-sm col-span-1 lg:col-span-2">
            <div className="flex justify-between items-center mb-6 md:mb-8">
              <h3 className="text-base md:text-xl font-black text-[#1A1512]">Companies</h3>
              <button className="text-[#D0864B] font-black text-[10px] md:text-xs uppercase tracking-widest hover:underline">Manage</button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 md:gap-6">
              {[
                { label: "Total", value: stats?.companyOverview.total, icon: Building2, color: "text-blue-500", bg: "bg-blue-50" },
                { label: "Active", value: stats?.companyOverview.active, icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
                { label: "Expired", value: stats?.companyOverview.expired, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
                { label: "Inactive", value: stats?.companyOverview.inactive, icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
              ].map((item, i) => (
                <div key={i} className="p-4 md:p-6 rounded-2xl md:rounded-3xl border border-[#ECA468]/10 bg-[#FAF5E9]/30 hover:bg-white transition-all duration-300 group">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon size={20} className="md:w-6 md:h-6" />
                  </div>
                  <h4 className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</h4>
                  <div className="text-lg md:text-2xl font-black text-[#1A1512]">{item.value}</div>
                </div>
              ))}
            </div>

            {/* Newest Company Bar */}
            {stats?.newestCompany && (
              <div className="mt-6 md:mt-8 p-3 md:p-4 bg-white rounded-xl md:rounded-2xl border border-[#ECA468]/5 flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center font-black text-[10px] md:text-xs shrink-0">
                    NEW
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs md:text-sm font-black text-[#1A1512] truncate">{stats.newestCompany.name}</p>
                    <p className="text-[8px] md:text-[10px] text-gray-400 font-bold uppercase tracking-tighter">New Registration</p>
                  </div>
                </div>
                <div className="text-[8px] md:text-[10px] font-black text-[#D0864B] py-1 px-3 bg-[#D0864B]/10 rounded-full uppercase tracking-widest shrink-0">
                  {stats.newestCompany.status}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
