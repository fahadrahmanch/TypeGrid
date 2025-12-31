import Logo from "../../../../assets/Icon/logo.png";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AdminLogoutApi } from "../../../../api/auth/authServices";
import { logout } from "../../../../store/slices/auth/adminAuthSlice";
import { Menu, X } from "lucide-react";
import { useState } from "react";
const SideNavbar: React.FC = () => {
  const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
  async function handleLogout() {
    try {

      await AdminLogoutApi();
      dispatch(logout());
    } catch (error) {
      console.log(error);
    }
  }
  return (
     <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#FFF3DB] shadow fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center">
          <img src={Logo} className="w-8" />
          <h2 className="text-xl font-bold text-black pl-2">Admin</h2>
        </div>

        <button onClick={() => setOpen(true)}>
          <Menu size={26} />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 bg-[#FFF3DB] shadow-md
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between pl-5 pt-4">
          <div className="flex items-center">
            <img src={Logo} className="w-10" />
            <h2 className="text-2xl font-bold text-black pl-3">Admin</h2>
          </div>

          <button className="md:hidden pr-4" onClick={() => setOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 pt-8 px-3 text-black">
          {[
            { to: "/admin/dashboard", label: "Dashboard" },
            { to: "/admin/users", label: "Users" },
            { to: "/admin/company", label: "Company" },
            { to: "/admin/settings", label: "Settings" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `p-2 rounded-md font-medium transition text-start
                ${isActive ? "bg-[#B99F8D] text-white" : "hover:bg-gray-300"}`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <button
            onClick={() => {
              setOpen(false);
              handleLogout();
            }}
            className="text-start p-2 mt-4 rounded-md hover:bg-gray-300 font-medium"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Desktop spacing */}
      <div className="hidden md:block w-64" />
    </>
  );
};
export default SideNavbar;
