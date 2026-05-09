import React, { useState } from "react";
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
  Menu,
  X,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mapping for navigation items
  const navItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/company/user/dashboard",
    },
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
    <>
      <div className="fixed top-0 left-0 w-full h-16 bg-[#FFF8EA]/80 backdrop-blur-md border-b border-[#F0E6D2] z-[60] flex items-center justify-between px-4 md:px-8 shadow-sm">
        {/* Logo Section */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 lg:hidden text-gray-600 hover:bg-white/50 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link to="/company/user/dashboard" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity">
            <img src={logo} alt="TypeGrid logo" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
            <div className="flex flex-col">
              <p
                className="text-xl md:text-2xl font-bold text-gray-900 tracking-wide leading-none"
                style={{ fontFamily: "Jaini, sans-serif" }}
              >
                TypeGrid
              </p>
              <div className="h-0.5 w-full bg-pink-500 rounded-full mt-0.5" />
            </div>
          </Link>
        </div>

        {/* Navigation Links - Desktop */}
        <div className="hidden lg:flex items-center gap-2">
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
                <span className="text-sm hidden 2xl:block">{item.name}</span>

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
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-gray-200">
            <img
              src={user?.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "Felix"}`}
              alt="User"
              className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-white border-2 border-orange-100 shadow-sm object-cover"
            />
            <div className="hidden sm:block lg:block text-sm">
              <p className="font-bold text-gray-900 leading-tight truncate max-w-[80px] md:max-w-[120px]">
                {user?.name || "User"}
              </p>
              <p className="text-[9px] md:text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                {user?.companyRole || "Member"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 md:p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm bg-white border border-transparent hover:border-red-100"
            title="Logout"
          >
            <LogOut className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Sidebar */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[70] transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div
        className={`fixed top-0 left-0 h-full w-72 bg-[#FFF8EA] shadow-2xl z-[80] transform transition-transform duration-300 lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <Link to="/company/user/dashboard" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
              <img src={logo} alt="TypeGrid logo" className="w-8 h-8 object-contain" />
              <p className="text-xl font-bold text-gray-900 tracking-wide" style={{ fontFamily: "Jaini, sans-serif" }}>
                TypeGrid
              </p>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${
                      isActive
                        ? "text-[#8B7355] bg-white shadow-sm font-bold"
                        : "text-gray-500 hover:text-[#8B7355] hover:bg-white/50 font-medium"
                    }
                  `}
                >
                  <item.icon
                    className={`
                      w-5 h-5 transition-colors duration-200
                      ${isActive ? "text-[#8B7355]" : "text-gray-400"}
                    `}
                  />
                  <span className="text-sm">{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto flex h-2 w-2 rounded-full bg-orange-500"></span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 w-full transition-all font-bold"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyUserNavbar;
