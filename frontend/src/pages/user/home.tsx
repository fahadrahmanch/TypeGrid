import { logout } from "../../store/slices/auth/userAuthSlice";
import { useDispatch } from "react-redux";
import { LogoutApi } from "../../api/auth/authServices";
import Navbar from "../../components/user/Navbar";
const Home: React.FC = () => {
    const dispatch = useDispatch();
    async function handleLogout() {
        try {
            await LogoutApi();
            dispatch(logout());
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
        <Navbar/>

            <button className="min-h-screen" onClick={() => handleLogout()}>
                Logout
            </button>
        </>  
    );
};
export default Home;