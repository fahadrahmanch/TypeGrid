import Navbar from "../../components/user/Navbar";
import WelcomeSection from "../../components/user/home/WelcomeSection";
import GameModes from "../../components/user/home/GameModes";
import { useNavigate } from "react-router-dom";
// import RecentMatches from "../../components/user/home/RecentMatches";
// import Highscores from "../../components/user/home/Highscores";
// import RecentPosts from "../../components/user/home/RecentPosts";
import { createGroupRoom } from "../../api/user/group";
import { toast } from "react-toastify";
import { createSoloRoom } from "../../api/user/solo";
import { createQuick } from "../../api/user/quick";


const Home: React.FC = () => {
  const navigate = useNavigate();

  async function handleGameModeClick(mode: string) {
    // Implement navigation or other actions based on the selected game mode;
    if (mode === "group") {
      try {
        const response = await createGroupRoom();
        if (response) {
          const joinLink = response?.data?.group?.joinLink;
          navigate(`/group-play/group/${joinLink}`);
        }
      } catch (error: any) {
        console.error("Group creation error:", error);
        toast.error(error.response?.data?.message || "Failed to create group room. Please try again.");
      }
    } else if (mode === "solo") {
      try {
        const response = await createSoloRoom();
        if (response) {
          const data = response.data.data;
          if (!data?._id) {
            throw new Error("Solo room ID missing");
          }
          const soloId = data?._id;
          navigate(`/solo-play/${soloId}`, {
            state: { gameData: data },
          });
        }
      } catch (error: any) {
        console.error("Solo creation error:", error);
        toast.error(error.response?.data?.message || "Failed to create solo room. Please try again.");
      }
    } else if (mode === "practice") {
      navigate("/typing/practice");
    } else if (mode === "quick") {
      try {
        const response = await createQuick();
        if (!response) {
          throw new Error("Quick play  missing");
        }
        navigate("/quick-play", {
          state: { gameData: response.data.quickPlay },
          replace: true,
        });
      } catch (error: any) {
        console.error("Quick play error:", error);
        toast.error(error.response?.data?.message || "Failed to start quick play. Please try again.");
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF8EA]">
      <Navbar />

      <main className="w-full px-4 md:px-8 pt-20 pb-12">
        <div className="max-w-7xl mx-auto">
          <WelcomeSection />


          <GameModes onGameModeClick={handleGameModeClick} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
            {/* Future expansion slots */}
          </div>
        </div>
      </main>
    </div>
  );
};
export default Home;
