import { logout } from "../../store/slices/auth/userAuthSlice";
import { useDispatch } from "react-redux";
import { logoutApi } from "../../api/auth/authServices";
import Navbar from "../../components/user/Navbar";
const Home: React.FC = () => {
  const dispatch = useDispatch();
  async function handleLogout() {
    try {
      await logoutApi();
      dispatch(logout());
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <Navbar />

      <button className="min-h-screen" onClick={() => handleLogout()}>
        Logout
      </button>
    </>
  );
};
export default Home;
