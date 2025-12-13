import { companyLogoutApi } from "../../api/auth/authServices";
import { useDispatch } from "react-redux";
import { logout } from "../../store/slices/auth/companyAuthSlice";
const CompanyUserDashboard:React.FC=()=>{
    const dispatch = useDispatch();
    
 async function handleLogout() {
    try {

      await companyLogoutApi();
      dispatch(logout());
    } catch (error) {
      console.log(error);
    }
  }
    return(
        <>
        <h1>Dashboard</h1>
         <button className="min-h-screen" onClick={() => handleLogout()}>
        Logout
      </button>
        </>
    );
};
export default CompanyUserDashboard;