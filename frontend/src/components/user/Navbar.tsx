import { Link } from "react-router-dom";
import { logout } from "../../store/slices/auth/authSlice";
import Logo from "../../assets/Icon/logo.png";
import { useSelector, useDispatch } from "react-redux";
import { logoutApi } from "../../api/auth/authServices";
const Navbar: React.FC = () => {
  const { user, accessToken } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await logoutApi();
    dispatch(logout());
  };

  return (
    <>
      <nav className="bg-white flex items-center justify-between w-full px-6 py-4 fixed top-0 left-0 z-50 shadow-sm h-20">
        <h1 className="text-[25px] font-bold font-jaini top-2 fixed">
          TypeGrid
        </h1>
        <div className="flex gap-14 ">
          <img src={Logo} className="h-12 left-3 top-3 relative" />
          <div className="flex gap-16 pl-10 pt-3 text-[20px] font-jaini">
            <Link to="/">
              <p>Home</p>
            </Link>
            <p>Discuss</p>
            <p>Badges</p>
            <p>Highscores</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {accessToken && (
            <button
              onClick={handleLogout}
              className="text-sm font-bold text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          )}
          <Link to="/profile">
            <img
              src={
                user?.imageUrl
                  ? user.imageUrl
                  : "https://via.placeholder.com/150"
              }
              alt="User"
              className="w-14 h-14 rounded-full object-cover shadow cursor-pointer"
            />
          </Link>
        </div>
      </nav>
    </>
  );
};
export default Navbar;
