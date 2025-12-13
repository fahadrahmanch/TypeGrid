import Logo from "../../../../assets/Icon/logo.png";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AdminLogoutApi } from "../../../../api/auth/authServices";
import { logout } from "../../../../store/slices/auth/adminAuthSlice";
const SideNavbar: React.FC = () => {
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
    <div className="w-64 h-screen bg-[#FFF3DB] flex flex-col pl-5 pt-4 fixed left-0 top-0 shadow-md">
      {/* Logo + Title */}
      <div className="flex items-center">
        <img src={Logo} className="w-10" />
        <h2 className="text-2xl font-bold text-black pl-3">Admin</h2>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 pt-8 text-black text-start">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `p-2 rounded-md font-medium transition 
         ${isActive ? "bg-[#B99F8D] text-white" : "hover:bg-gray-300"}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `p-2 rounded-md font-medium transition 
         ${isActive ? "bg-[#B99F8D] text-white" : "hover:bg-gray-300"}`
          }
        >
          Users
        </NavLink>

        <NavLink
          to="/admin/company"
          className={({ isActive }) =>
            `p-2 rounded-md font-medium transition 
         ${isActive ? "bg-[#B99F8D] text-white" : "hover:bg-gray-300"}`
          }
        >
          Company
        </NavLink>

        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `p-2 rounded-md font-medium transition 
         ${isActive ? "bg-[#B99F8D] text-white" : "hover:bg-gray-300"}`
          }
        >
          Settings
          
        </NavLink>
       
         <button className="text-start pl-3" onClick={() => handleLogout()}>
        Logout
      </button>
      </nav>
    </div>
  );
};
export default SideNavbar;
