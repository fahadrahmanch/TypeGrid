import { logout } from "../../store/slices/auth/userAuthSlice";
import { useDispatch } from "react-redux";
import { logoutApi } from "../../api/auth/authServices";
import Navbar from "../../components/user/Navbar";
import WelcomeSection from "../../components/user/home/WelcomeSection";
import GameModes from "../../components/user/home/GameModes";
import { useNavigate } from "react-router-dom";
// import RecentMatches from "../../components/user/home/RecentMatches";
// import Highscores from "../../components/user/home/Highscores";
// import RecentPosts from "../../components/user/home/RecentPosts";
import { createGroupRoom } from "../../api/user/group";
import { toast } from "react-toastify";

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  async function handleLogout() {
    try {
      await logoutApi();
      dispatch(logout());
    } catch (error) {
      console.log(error);
    }
  }

  async function handleGameModeClick(mode: string) {
    console.log(`Game mode clicked: ${mode}`);
    // Implement navigation or other actions based on the selected game mode;
    if(mode==='group'){
      try{
        const response=await createGroupRoom()
        console.log(response,'create group room response');
        if(response){
          const joinLink=response?.data?.group?.joinLink
          navigate(`/group-play/group/${joinLink}`);
        }
      }
      catch(error){
        toast.error("Failed to create group room. Please try again.");
        console.log(error)
      }
    }
   
    
  }

  return (
    <div className="min-h-screen ">
      <Navbar />
      
      <main className="w-full px-4 md:px-8 py-6">

        <WelcomeSection />
        
        <GameModes onGameModeClick={handleGameModeClick} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">

          {/* Left Column: Recent Matches */}

          {/* <div className="lg:col-span-1">
            <RecentMatches />
          </div> */}
          
          {/* Middle Column: Highscores */}
          {/* <div className="lg:col-span-1">
            <Highscores />
          </div> */}
          
          {/* Right Column: Recent Posts */}
          {/* <div className="lg:col-span-1">
            <RecentPosts />
          </div> */}
        </div>

        <div className="mt-8 text-center opacity-50 hover:opacity-100">
            <button className="text-red-500 underline text-sm" onClick={() => handleLogout()}>
                Temporary Logout
            </button>
        </div>
      </main>
    </div>
  );
};
export default Home;
