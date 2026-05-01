import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CompanyUserNavbar from "../../components/companyUser/layout/companyUserNavbar";
import { getCompanyUserDashboardStats } from "../../api/companyUser/dashboard";
import { 
  TrendingUp, 
  Target, 
  CheckCircle,
  ArrowUp,
  ArrowDown
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ElementType;
  iconBgColor: string;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, value, subValue, change, isPositive, icon: Icon, iconBgColor, iconColor 
}) => (
  <div className="bg-[#FAF5EC] p-6 rounded-2xl shadow-sm border border-[#EFE5D5] flex-1 min-w-[240px]">
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-2 rounded-xl ${iconBgColor}`}>
        <Icon size={20} className={iconColor} />
      </div>
      <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
    </div>
    <div>
      <div className="text-4xl font-extrabold text-gray-900 mb-1">{value}</div>
      {subValue ? (
        <p className="text-sm font-semibold text-[#8B5CF6] mt-2">{subValue}</p>
      ) : (
        <div className={`flex items-center gap-1 text-sm font-bold mt-2 ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          {change}
        </div>
      )}
    </div>
  </div>
);

const CompanyUserDashboard: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getCompanyUserDashboardStats();
        console.log("response",response)
        setStats(response.data.data);
      } catch (error) {
        console.error("Error fetching company user dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFBF4] pt-20 flex items-center justify-center">
        <div className="text-xl font-bold text-gray-400 animate-pulse">Loading Your Progress...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF4] pb-12 font-sans">
      <CompanyUserNavbar />
      
      <main className="max-w-6xl mx-auto px-6 pt-24">
        {/* Header section */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Welcome back, {user?.name?.split(" ")[0] || "User"}!
          </h1>
          <p className="text-gray-500 font-medium">Keep up the great work on your typing journey</p>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap gap-6 mb-8">
          <StatCard 
            title="Current WPM"
            value={stats?.currentWpm?.value || 0}
            change={stats?.currentWpm?.change || "0% this week"}
            isPositive={stats?.currentWpm?.isPositive ?? true}
            icon={TrendingUp}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-500"
          />
          <StatCard 
            title="Accuracy"
            value={stats?.accuracy?.value || "0%"}
            change={stats?.accuracy?.change || "0% improvement"}
            isPositive={stats?.accuracy?.isPositive ?? true}
            icon={Target}
            iconBgColor="bg-green-100"
            iconColor="text-green-500"
          />
          <StatCard 
            title="Completed"
            value={`${stats?.completedLessons?.completed || 0}/${stats?.completedLessons?.total || 0}`}
            subValue="lessons done"
            icon={CheckCircle}
            iconBgColor="bg-purple-100"
            iconColor="text-purple-500"
          />
        </div>

        {/* Line Chart */}
        <div className="bg-[#FAF5EC] p-8 rounded-3xl shadow-sm border border-[#EFE5D5] mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Your Progress This Week</h2>
          
          <div className="relative h-64 w-full pl-8 pb-6">
            <svg className="w-full h-full overflow-visible xl:pr-10" viewBox="0 0 800 240">
              {/* Y Axis Guides */}
              {[40, 60, 80].map((yVal) => (
                <g key={`y-${yVal}`}>
                  <text x="-10" y={240 - (yVal/100)*240} textAnchor="end" className="fill-gray-400 text-xs font-semibold">{yVal}</text>
                  <line 
                    x1="10" y1={240 - (yVal/100)*240} 
                    x2="790" y2={240 - (yVal/100)*240} 
                    stroke="#D1D5DB" strokeOpacity="0.5" strokeDasharray="4 4" 
                  />
                </g>
              ))}
              <text x="-10" y="240" textAnchor="end" className="fill-gray-400 text-xs font-semibold">0</text>
              <line 
                x1="10" y1="240" 
                x2="790" y2="240" 
                stroke="#9CA3AF" strokeWidth="2"
              />
              <line 
                x1="10" y1="0" 
                x2="10" y2="240" 
                stroke="#9CA3AF" strokeWidth="2"
              />

              {/* X Axis vertical grid */}
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                <g key={`x-${day}`}>
                  <line 
                    x1={10 + (i * 130)} y1="0" 
                    x2={10 + (i * 130)} y2="240" 
                    stroke="#D1D5DB" strokeOpacity="0.5" strokeDasharray="4 4" 
                  />
                  <text x={10 + (i * 130)} y="260" textAnchor="middle" className="fill-gray-400 text-xs font-semibold">{day}</text>
                </g>
              ))}

              {/* Chart Line */}
              {stats?.progressChart && (
                <path 
                  d={`M ${stats.progressChart.map((p: any, i: number) => {
                    // map progress to SVG space. Max WPM on graph is 100 for scaling relative mapping
                    const mappedY = 240 - ((p.value || 0) / 100) * 240;
                    return `${i === 0 ? "" : "L"} ${10 + (i * 130)},${mappedY}`;
                  }).join(" ")}`}
                  fill="none" 
                  stroke="#3B82F6" 
                  strokeWidth="2.5"
                />
              )}
            </svg>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#3B82F6] rounded-3xl p-6 text-white shadow-md relative overflow-hidden transition-transform hover:-translate-y-1">
            <h3 className="text-xl font-bold mb-2 relative z-10">Continue Learning</h3>
            <p className="text-blue-100 mb-6 text-sm font-medium relative z-10">Resume your next lesson</p>
            <Link 
              to="/company/user/lessons" 
              className="inline-block bg-white text-[#3B82F6] font-bold text-sm px-6 py-2.5 rounded-xl shadow-sm hover:shadow relative z-10"
            >
              Start Lesson
            </Link>
          </div>

          <div className="bg-[#A855F7] rounded-3xl p-6 text-white shadow-md relative overflow-hidden transition-transform hover:-translate-y-1">
            <h3 className="text-xl font-bold mb-2 relative z-10">Join a Contest</h3>
            <p className="text-purple-100 mb-6 text-sm font-medium relative z-10">Compete with colleagues</p>
            <Link 
              to="/company/user/contests" 
              className="inline-block bg-white text-[#A855F7] font-bold text-sm px-6 py-2.5 rounded-xl shadow-sm hover:shadow relative z-10"
            >
              View Contests
            </Link>
          </div>

          <div className="bg-[#F97316] rounded-3xl p-6 text-white shadow-md relative overflow-hidden transition-transform hover:-translate-y-1">
            <h3 className="text-xl font-bold mb-2 relative z-10">Practice Now</h3>
            <p className="text-orange-100 mb-6 text-sm font-medium relative z-10">Generate custom exercises</p>
            <Link 
              to="/company/user/my-practice" 
              className="inline-block bg-white text-[#F97316] font-bold text-sm px-6 py-2.5 rounded-xl shadow-sm hover:shadow relative z-10"
            >
              Start Practice
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyUserDashboard;
