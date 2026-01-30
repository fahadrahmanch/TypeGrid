import { companyLogoutApi } from "../../api/auth/authServices";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/auth/companyAuthSlice";
import CompanyUserNavbar from "../../components/companyUser/layout/companyUserNavbar";
const CompanyUserDashboard: React.FC = () => {
  const dispatch = useDispatch();

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
      <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => handleLogout()}>
        Logout
      </button>
    </div>
  );
};
export default CompanyUserDashboard;