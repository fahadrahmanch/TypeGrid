import { Link } from "react-router-dom";
import { GetUserDataApi } from "../../api/user/userService";
import {useState, useEffect } from "react";
import Logo from "../../assets/Icon/logo.png";
const Navbar: React.FC = () => {
   const [image, setImage] = useState({
    
      imageUrl: "",
    });
  
      useEffect(() => {
        async function getUserData() {
          const res = await GetUserDataApi();
          if (res?.data) {
            setImage({
              imageUrl: res.data.imageUrl || "",
            });
          }
        }
        getUserData();
      }, []);
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
        <Link to="/profile">
          <img
              src={
                      image.imageUrl
                        ? image.imageUrl
                        : "https://via.placeholder.com/150"
                    }
            alt="User"
            className="w-14 h-14 rounded-full object-cover shadow cursor-pointer"
          />
        </Link>
      </nav>
    </>
  );
};
export default Navbar;
