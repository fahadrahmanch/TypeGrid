import { logout } from "../../store/slices/authSlice";
import { useDispatch } from "react-redux";
import { LogoutApi } from "../../api/auth/authServices";
const Home: React.FC = () => {
    const dispatch = useDispatch()
    async function handleLogout() {
        try {
            await LogoutApi()
            dispatch(logout());
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            <button onClick={() => handleLogout()}>
                Logout
            </button>
        </>
    );
};
export default Home;