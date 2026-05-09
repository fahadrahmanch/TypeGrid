import Logo from "../../../../assets/Icon/logo.png";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminLogoutApi } from "../../../../api/auth/authServices";
import { logout } from "../../../../store/slices/auth/authSlice";
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Users, 
  Building2, 
  Swords, 
  Gift, 
  Target, 
  CalendarCheck, 
  CreditCard, 
  BookOpen, 
  Trophy, 
  LogOut 
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

const SideNavbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  async function handleLogout() {
    try {
      await adminLogoutApi();
      dispatch(logout());
    } catch (error:any) {
      toast.error(error.message);
    }
  }

  const menuItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/company", label: "Company", icon: Building2 },
    { to: "/admin/challenges", label: "Challenges", icon: Swords },
    { to: "/admin/reward", label: "Rewards", icon: Gift },
    { to: "/admin/goals", label: "Goals", icon: Target },
    { to: "/admin/daily-assignment", label: "Daily Assignment", icon: CalendarCheck },
    { to: "/admin/subscription-plans", label: "Subscription plans", icon: CreditCard },
    { to: "/admin/lessons", label: "Lesson Management", icon: BookOpen },
    { to: "/admin/achievements", label: "Achievements", icon: Trophy },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-40 border-b border-orange-100">
        <div className="flex items-center gap-2">
          <img src={Logo} className="w-8 h-8 object-contain" alt="Logo" />
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Admin</h2>
        </div>

        <button 
          onClick={() => setOpen(true)}
          className="p-2 hover:bg-orange-50 rounded-xl transition-colors text-gray-600"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300" 
          onClick={() => setOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 z-[70] h-screen w-64 bg-[#FFF3DB] shadow-2xl border-r border-orange-100/50
          transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
          ${open ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}
          md:translate-x-0 md:opacity-100 md:shadow-none
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-6">
          <div className="flex items-center gap-2.5">
            <div className="bg-white p-1.5 rounded-xl shadow-sm border border-orange-100">
              <img src={Logo} className="w-7 h-7 object-contain" alt="Logo" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-black text-gray-900 leading-none tracking-tight">Admin</h2>
              <span className="text-[9px] font-bold text-[#B99F8D] uppercase tracking-widest mt-0.5">Control Panel</span>
            </div>
          </div>

          <button 
            className="md:hidden p-2 hover:bg-orange-100 rounded-xl transition-colors text-gray-500" 
            onClick={() => setOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-3 overflow-y-auto custom-scrollbar h-[calc(100vh-180px)]">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl font-bold transition-all duration-200
                ${isActive 
                  ? "bg-[#B99F8D] text-white shadow-lg shadow-[#B99F8D]/20 translate-x-1" 
                  : "text-gray-600 hover:bg-white/50 hover:text-gray-900"
                }`
              }
            >
              <item.icon size={18} className="shrink-0" />
              <span className="text-xs">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer / Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-orange-100/30 bg-orange-50/20">
          <button
            onClick={() => {
              setOpen(false);
              handleLogout();
            }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all duration-200 group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs">Logout</span>
          </button>
        </div>
      </div>

      {/* Desktop spacing */}
      <div className="hidden md:block w-64 shrink-0" />
    </>
  );
};

export default SideNavbar;
