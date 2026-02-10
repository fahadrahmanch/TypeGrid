import React from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../../assets/Icon/logo.png";
import { companyLogoutApi } from "../../../api/auth/authServices";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/slices/auth/companyAuthSlice";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Trophy,
  Settings,
  LogOut,
  UsersRound,
} from "lucide-react";

// Define navigation items with their respective icons and paths
const navItems = [
  { path: "/company/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/company/admin/users", label: "Users", icon: Users },
  { path: "/company/admin/lessons", label: "Lessons", icon: BookOpen },
  { path: "/company/admin/contest-management", label: "Contest Management", icon: Trophy },
  { path: '/company/admin/groups', label: 'Groups', icon: UsersRound },
  { path: "/company/admin/settings", label: "Settings", icon: Settings },
];

const CompanyAdminSidebar: React.FC = () => {
  const dispatch = useDispatch();

  async function handleLogout() {
    try {
      await companyLogoutApi();
      dispatch(logout());
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <aside className="h-screen w-64 bg-[#FFF8EA] border-r border-[#E6DCC3] flex flex-col fixed left-0 top-0 shadow-lg z-50">
      {/* Header Section */}
      <div className="flex items-center gap-3 px-6 py-8">
        <img src={Logo} alt="TypeGrid Logo" className="w-10 h-10 object-contain" />
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight font-jaini leading-none">
            TypeGrid
          </h2>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mt-1">
            Company Admin
          </span>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar flex flex-col">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden
              ${isActive
                ? "bg-[#B99F8D] text-white shadow-md shadow-[#B99F8D]/25 font-semibold"
                : "text-gray-600 hover:bg-[#F0E6D2] hover:text-gray-900"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active Indicator Strip */}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/20" />
                )}
                <item.icon
                  className={`w-5 h-5 transition-transform duration-200 ${isActive ? "scale-105" : "group-hover:scale-110"
                    }`}
                />
                <span className="text-sm tracking-wide">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Logout Section */}
      <div className="p-4 border-t border-[#E6DCC3] bg-[#FFF8EA]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-200 group border border-transparent hover:border-red-100"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default CompanyAdminSidebar;