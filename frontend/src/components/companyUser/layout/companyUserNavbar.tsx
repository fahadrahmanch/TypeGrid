import React from "react";
import {
  LayoutDashboard,
  BookOpen,
  Trophy,
  Medal,
  Swords,
  LogOut,
  Keyboard,
  Dumbbell,
  Bell,
  User,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../store/slices/auth/authSlice";
import { companyLogoutApi } from "../../../api/auth/authServices";
import logo from "../../../assets/Icon/logo.png";

const CompanyUserNavbar: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);

  // Mapping for navigation items
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/company/user/dashboard" },
    { name: "Lessons", icon: BookOpen, path: "/company/user/lessons" },
    { name: "Leaderboard", icon: Medal, path: "/company/user/leaderboard" },
    { name: "Contests", icon: Trophy, path: "/company/user/contests" },
    {
      name: "Challenges",
      icon: Swords,
      path: "/company/user/challenges",
      badge: true,
    },
    { name: "Keyboard", icon: Keyboard, path: "/company/user/my-keyboard" },
    { name: "Practice", icon: Dumbbell, path: "/company/user/my-practice" },
    {
      name: "Notifications",
      icon: Bell,
      path: "/company/user/my-notifications",
    },
    { name: "Profile", icon: User, path: "/company/user/profile" },
  ];

  const handleLogout = async () => {
    try {
      await companyLogoutApi();
      dispatch(logout());
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-16 bg-[#FFF8EA] border-b border-[#F0E6D2] z-50 flex items-center justify-between px-8 shadow-sm">
      {/* Logo Section */}
      <Link to="/company/user/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <img
          src={logo}
          alt="TypeGrid logo"
          className="w-10 h-10 object-contain"
        />
        <div className="flex flex-col">
          <p
            className="text-2xl font-bold text-gray-900 tracking-wide leading-none"
            style={{ fontFamily: "Jaini, sans-serif" }}
          >
            TypeGrid
          </p>
          <div className="h-0.5 w-full bg-pink-500 rounded-full mt-0.5" />
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={item.name}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 group relative
                ${
                  isActive
                    ? "text-[#8B7355] bg-white/50 shadow-sm font-bold"
                    : "text-gray-500 hover:text-[#8B7355] hover:bg-white/30 font-medium"
                }
              `}
            >
              <item.icon
                className={`
                  w-5 h-5 transition-colors duration-200
                  ${isActive ? "text-[#8B7355]" : "text-gray-400 group-hover:text-[#8B7355]"}
                `}
              />
              
              {item.badge && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                </span>
              )}

              {isActive && (
                <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#8B7355] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <img
            src={user?.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "Felix"}`}
            alt="User"
            className="w-9 h-9 rounded-xl bg-white border-2 border-orange-100 shadow-sm object-cover"
          />
          <div className="hidden lg:block text-sm">
            <p className="font-bold text-gray-900 leading-tight truncate max-w-[120px]">
              {user?.name || "User"}
            </p>
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
              {user?.companyRole || "Member"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm bg-white border border-transparent hover:border-red-100"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CompanyUserNavbar;
