import { companyLogoutApi } from "../../api/auth/authServices";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/auth/authSlice";
import CompanyUserNavbar from "../../components/companyUser/layout/companyUserNavbar";
const CompanyUserDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);

  async function handleLogout() {
    try {
      await companyLogoutApi();
      dispatch(logout());
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="min-h-screen pt-20 px-8 bg-[#FFF8EA]">
      <CompanyUserNavbar />
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#FDE6C6] mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Welcome, {user?.name || "User"}!
        </h2>
        <p className="text-gray-600">
          You are logged in to the company portal.
        </p>
      </div>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        onClick={() => handleLogout()}
      >
        Logout
      </button>
    </div>
  );
};
export default CompanyUserDashboard;
