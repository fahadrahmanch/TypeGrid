import { NavLink } from "react-router-dom";
import Logo from "../../../assets/Icon/logo.png"
const CompanyAdminSidebar:React.FC = () => {
  return (
    <div className="w-64 h-screen bg-[#FFF3DB] flex flex-col pl-5 pt-4 fixed left-0 top-0 shadow-md">
      {/* Logo + Title */}
      <div className="flex items-center">
        <img src={Logo} className="w-10 " />
        <h2 className="text-2xl font-bold text-black pl-3 pt-2">TypeGrid</h2>
      </div>
        <p className="text-[12px] text-start pl-16">company admin</p>
      {/* Navigation */}
      <nav className="flex flex-col gap-1 pt-8 text-black text-start">
        <NavLink
          to="/company/admin/dashboard"
          className={({ isActive }) =>
            `p-2 rounded-md font-medium transition 
         ${isActive ? "bg-[#B99F8D] text-white" : "hover:bg-gray-300"}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/company/admin/users"
          className={({ isActive }) =>
            `p-2 rounded-md font-medium transition 
         ${isActive ? "bg-[#B99F8D] text-white" : "hover:bg-gray-300"}`
          }
        >
          Users
        </NavLink>


        <NavLink
          to="/company/admin/settings"
          className={({ isActive }) =>
            `p-2 rounded-md font-medium transition 
         ${isActive ? "bg-[#B99F8D] text-white" : "hover:bg-gray-300"}`
          }
        >
          Settings
        </NavLink>
      </nav>
    </div>
  );
};

export default CompanyAdminSidebar;