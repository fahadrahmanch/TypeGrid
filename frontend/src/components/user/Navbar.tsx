import React from "react";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../../store/slices/auth/authSlice";
import Logo from "../../assets/Icon/logo.png";
import { useSelector, useDispatch } from "react-redux";
import { logoutApi } from "../../api/auth/authServices";
import { Home, MessageSquare, Award, Trophy, Target, LogOut } from "lucide-react";

const Navbar: React.FC = () => {
  const { user, accessToken } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogout = async () => {
    await logoutApi();
    dispatch(logout());
  };

  const navItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Daily Challenge", icon: Target, path: "/daily-challenge" },
    { name: "Discuss", icon: MessageSquare, path: "/discussions" },
    { name: "Badges", icon: Award, path: "/badges" },
    { name: "Highscores", icon: Trophy, path: "/highscores" },
  ];

  return (
    <div className="fixed top-0 left-0 w-full h-16 bg-[#FFF8EA] border-b border-[#F0E6D2] z-50 flex items-center justify-between px-8 shadow-sm">
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <img src={Logo} alt="TypeGrid logo" className="w-10 h-10 object-contain" />
        <div className="flex flex-col">
          <p
            className="text-2xl font-bold text-gray-900 tracking-wide leading-none"
            style={{ fontFamily: "Jaini, sans-serif" }}
          >
            TypeGrid
          </p>
          <div className="h-0.5 w-full bg-pink-500 rounded-full mt-0.5" />
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-8">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 group relative
                ${isActive ? "text-[#8B7355] font-bold" : "text-gray-500 hover:text-[#8B7355] font-medium"}
              `}
            >
              <item.icon
                className={`
                  w-5 h-5 transition-colors duration-200
                  ${isActive ? "text-[#8B7355]" : "text-gray-400 group-hover:text-[#8B7355]"}
                `}
              />
              <span className="hidden md:inline-block">{item.name}</span>
              {isActive && (
                <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#8B7355] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-4">
        <Link
          to="/profile"
          className="flex items-center gap-3 pl-4 border-l border-gray-200 transition-all hover:opacity-80"
        >
          <img
            src={user?.imageUrl || "https://via.placeholder.com/150"}
            alt="User"
            className="w-9 h-9 rounded-full bg-white border-2 border-white shadow-sm object-cover"
          />
          <div className="hidden lg:block text-sm">
            <p className="font-bold text-gray-900">{user?.name || "Player"}</p>
            <p className="text-xs text-gray-500">User</p>
          </div>
        </Link>

        {accessToken && (
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all ml-2"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
