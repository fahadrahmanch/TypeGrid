import { getGroupRoomDetails } from "../../../api/user/group";
import Navbar from "../../../components/user/Navbar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingPage from "../../../components/common/LoadingPage";
import { editGroupAPI } from "../../../api/user/group";
import { joinGroupAPI } from "../../../api/user/group";
import { toast } from "react-toastify";
import { removePlayerAPI } from "../../../api/user/group";
import { useNavigate } from "react-router-dom";
const GroupLobby: React.FC = () => {
  const { joinLink } = useParams<{ joinLink: string }>();
  const [group, setGroup] = useState<any>({});
  const [loading, setLoading] = useState(true)
  const [players, setPlayers] = useState<any[]>([])
  const [difficulty, setDifficulty] = useState<string>()
  const [maximumPlayers, setMaximumPlayes] = useState<number>()
  const navigate = useNavigate()
  useEffect(() => {
    async function fetchGroupDetails() {
      try {
        await joinGroupAPI(joinLink!);
        const response = await getGroupRoomDetails(joinLink!);
        const groupDetails = response?.data?.group;

        setGroup(groupDetails);
        setPlayers(groupDetails.members)
        setDifficulty(groupDetails.difficulty)
        setMaximumPlayes(groupDetails.maximumPlayers)
      } catch (error: any) {
        console.error(error);
        navigate("/")
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchGroupDetails();
  }, [joinLink]);

  async function removePlayer(playerId: string) {

    try {
      const response = await removePlayerAPI(group.id, playerId)
      const groupDetails = response?.data?.group;
      setGroup(groupDetails);
      setPlayers(groupDetails.members)
      console.log("players after remove player", groupDetails.members)
    } catch (error: any) {
      console.log(error)
    }

  }

  async function editGroup(newDifficulty?: string, newMaxPlayers?: number) {
    await editGroupAPI(group.id, newDifficulty ?? difficulty,
      newMaxPlayers ?? maximumPlayers)
  }

  async function startGame(){
    
  }

  if (loading) return <LoadingPage />;

  


  return (
    <>
      <Navbar />
      <h1>Group Lobby Page</h1>
      <div className="mt-12 bg-[#FFF6E8] flex items-center justify-center p-10">
        <div className="w-full max-w-[1600px] grid grid-cols-12 gap-8">
          {/* LEFT – SETTINGS */}
          <div className="col-span-3 bg-[#FFF1D8] rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              ⚙️ Settings
            </h2>

            {/* Difficulty */}
            <div className="mb-8">
              <p className="text-base font-medium mb-3">Difficulty</p>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {["Easy", "Medium", "Hard"].map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      const value = d.toLowerCase();
                      setGroup((prev: any) => ({ ...prev, difficulty: value }));
                      setDifficulty(value);
                      editGroup(value, undefined);
                    }}

                    className={`text-base py-2 rounded-lg border ${d.toLowerCase() === group.difficulty.toLowerCase()
                        ? "bg-[#7A6A5D] text-white"
                        : "bg-white text-gray-700"
                      }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              {/* <button className="w-full text-base py-2 rounded-lg border bg-white">
                Random
              </button> */}
            </div>

            {/* Max Players */}
            <div className="mb-8">
              <p className="text-base font-medium mb-3">Maximum Players</p>

              <div className="grid grid-cols-3 gap-3">
                {[3, 5, 7, 9, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setGroup((prev: any) => ({
                        ...prev,
                        maximumPlayers: num,
                      }));
                      setMaximumPlayes(num);
                      editGroup(undefined, num);
                    }}

                    className={`text-base py-2 rounded-lg border transition
          ${num === Number(group?.maximumPlayers)
                        ? "bg-[#7A6A5D] text-white"
                        : "bg-white"
                      }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>


            {/* Start Time */}
            <div>
              <p className="text-base font-medium mb-2">Start Time</p>
              <p className="text-sm text-gray-500 mb-3">
                Time in seconds before the match starts (default: 10)
              </p>
              <input
                type="number"
                value={10}
                className="w-full border rounded-lg px-4 py-3 text-base"
              />
            </div>
          </div>

          {/* CENTER */}
          <div className="col-span-6 space-y-8">
            {/* INVITE BOX */}
            <div className="bg-[#FFF1D8] rounded-2xl p-10 text-center">
              <p className="text-base text-gray-600 mb-5">
                Share this link to invite players.
                <br />
                Click the link to copy!
              </p>

              <div className="bg-white border rounded-lg px-4 py-3 text-base mb-6 break-all">
                http://localhost:5173/group-play/group/{group?.joinLink}
              </div>

              <div className="flex justify-center gap-4 mb-6">
                <button className="px-6 py-2.5 text-base rounded-lg bg-[#7A6A5D] text-white">
                  COPY
                </button>
                <button className="px-6 py-2.5 text-base rounded-lg border bg-white">
                  SHOW
                </button>
              </div>

              <button 
              onClick={startGame}
              className="px-8 py-3 rounded-xl bg-[#7A6A5D] text-white text-lg flex items-center gap-2 mx-auto">
                ▶ START GAME
              </button>
            </div>

            {/* CHAT */}
            <div className="bg-[#FFF1D8] rounded-2xl p-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                💬 Chat
              </h3>

              <div className="bg-white rounded-lg border p-4 text-base text-gray-600 mb-4 h-32">
                <span className="text-orange-500">spider man</span> has joined
                the lobby.
              </div>

              <div className="flex gap-3">
                <input
                  placeholder="Write a message..."
                  className="flex-1 border rounded-lg px-4 py-3 text-base"
                />
                <button className="px-6 py-3 rounded-lg bg-[#7A6A5D] text-white text-base">
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT – PLAYERS */}
          <div className="col-span-3 bg-[#FFF1D8] rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Lobby ({players.length} / {group.maximumPlayers})
            </h2>

            <div className="space-y-4">
              {players.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-[#FFF6E8] rounded-xl px-4 py-3"
                >
                  {/* LEFT SIDE */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0" />

                    {/* Name + host */}
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base truncate">
                        {p.name}
                      </span>

                      {p.isHost && (
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full flex-shrink-0">
                          Host
                        </span>
                      )}
                    </div>
                  </div>

                  {/* RIGHT SIDE */}
                  {!p.isHost && group.currentUserId === group.ownerId && (
                    <button
                      onClick={() => removePlayer(p.userId)}
                      className="w-8 h-8 flex-shrink-0 rounded-full bg-red-500 text-white text-sm flex items-center justify-center hover:bg-red-600 transition"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-6">
              <span className="w-3 h-3 bg-gray-400 rounded-full" />
              <span className="w-3 h-3 bg-gray-300 rounded-full" />
              <span className="w-3 h-3 bg-gray-300 rounded-full" />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
export default GroupLobby;
