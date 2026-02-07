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
import { startGroupPlayAPI } from "../../../api/user/group";
import { socket } from "../../../socket";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useRef } from "react";
type Player = {
  userId: string;
  name: string;
  isHost: boolean;
  imageUrl?: string;
};

type Group = {
  id: string;
  ownerId: string;
  currentUserId: string;
  members: Player[];
  difficulty: string;
  maximumPlayers: number;
  joinLink: string;

};



const GroupLobby: React.FC = () => {
  const { joinLink } = useParams<{ joinLink: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState<string>();
  const [maximumPlayers, setMaximumPlayes] = useState<number>();
  const isHost = group?.currentUserId === group?.ownerId;
  const inviteLink = `http://localhost:5173/group-play/group/${group?.joinLink}`;
  const [isBlurred, setIsBlurred] = useState(true);
  const user = useSelector((state: any) => state.userAuth.user);
  const [startTime, setStartTime] = useState<string>();
  const isStartingGameRef = useRef(false);

  const navigate = useNavigate();
useEffect(() => {
    if (!group?.id) return;
    
    socket.emit("join-room", {
      groupId: group.id,
      userId: user._id,
    });

    return () => {
         if (isStartingGameRef.current) {
      return;
    }
     
      socket.emit("leave-group", {
        groupId: group.id,
        userId: user._id,
      });
      
    };
  }, [group?.id, user._id]);



useEffect(() => {
  const handleUserLeave = ({
    members,
    newHostId,
  }: {
    members: Player[];
    newHostId: string;
  }) => {

    const updatedMembers = [...members];

    setPlayers(updatedMembers);

    setGroup((prev) =>
      prev
        ? {
            ...prev,
            ownerId: newHostId,
            members: updatedMembers,
          }
        : prev
    );
  };

  socket.on("player-left", handleUserLeave);

  return () => {
    socket.off("player-left", handleUserLeave);
  };
}, []);


useEffect(() => {
  const handler = (data: any) => {
    isStartingGameRef.current = true; 

    navigate(`/group-play/game/${joinLink}`, {
      state: { gameData: data.competition },
      replace: true,
    });
  };

  socket.on("game-started", handler);

  return () => {
    socket.off("game-started", handler);
  };
}, [navigate, joinLink]);



  useEffect(() => {
    if (!group?.id) return;

    const handler = (data: any) => {
      setDifficulty(data.difficulty);
      setMaximumPlayes(data.maximumPlayers);
      setGroup((prev) =>
        prev
          ? { ...prev, difficulty: data.difficulty, maximumPlayers: data.maximumPlayers }
          : prev
      );
    };

    socket.on("change-difficulty", handler);

    return () => {
      socket.off("change-difficulty", handler);
    };
  }, [group?.id]);

  useEffect(() => {
    if (!group?.id) return;

    const handler = (data: any) => {

      const isRemoved = data.group.kickedUsers.find((m: any) => {

        return m.toString() === user?._id;
      });


      if (isRemoved) {
        toast.info("You have been removed from the group");
        navigate("/",{ replace: true, });
        
      } else {
        setGroup((prev: any) => ({
          ...prev,
          currentUserId: prev.currentUserId,
          members: data.group.members,
        }));
        setPlayers(data.group.members);
        setDifficulty(data.group.difficulty);
        setMaximumPlayes(data.group.maximumPlayers);
      }
    };

    socket.on("remove-player", handler);

    return () => {
      socket.off("remove-player", handler);
    };
  }, [group?.id]);

  useEffect(() => {
    const handleFetchGroupDetails = (data: any) => {
      setGroup((prev) => ({
        ...data.group,
        currentUserId: prev?.currentUserId,
      }));
      setPlayers(data.group.members);
      setDifficulty(data.group.difficulty);
      setMaximumPlayes(data.group.maximumPlayers);
    };

    socket.on("fetchGroupDetails", handleFetchGroupDetails);

    return () => {
      socket.off("fetchGroupDetails", handleFetchGroupDetails);
    };
  }, []);

  useEffect(() => {
    async function fetchGroupDetails() {
 

      try {
        await joinGroupAPI(joinLink!);
        const response = await getGroupRoomDetails(joinLink!);
        const groupDetails = response?.data?.group;

        setGroup(groupDetails);
        setPlayers(groupDetails.members);
        setDifficulty(groupDetails.difficulty);
        setMaximumPlayes(groupDetails.maximumPlayers);
      } catch (error: any) {
        console.error(error);
        navigate("/");
        // toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchGroupDetails();
  }, [joinLink]);

  async function removePlayer(playerId: string) {

    try {
      const response = await removePlayerAPI(group?.id, playerId);
      const groupDetails = response?.data?.group;
      setGroup((prev) => ({
        ...groupDetails,
        currentUserId: prev?.currentUserId
      }));
      setPlayers(groupDetails.members);
    } catch (error: any) {
      console.log(error);
    }

  }

  async function editGroup(newDifficulty?: string, newMaxPlayers?: number) {
    if (!group?.id) return;
    await editGroupAPI(group.id, newDifficulty ?? difficulty,
      newMaxPlayers ?? maximumPlayers);
  }

  async function startGame() {
    try {
      if (!group?.id) return;
       isStartingGameRef.current = true; 
      await startGroupPlayAPI(group?.id, Number(startTime));

    }
    catch (error: any) {
      console.log(error);
    }

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
                {["Easy", "Medium", "Hard"].map((d) => {
                  const value = d.toLowerCase();

                  return (
                    <button
                      key={d}
                      type="button"
                      disabled={!isHost}
                      onClick={() => {
                        if (!isHost) return;

                        setGroup((prev: any) => ({ ...prev, difficulty: value }));
                        setDifficulty(value);
                        editGroup(value, undefined);
                      }}
                      className={`text-base py-2 rounded-lg border transition
            ${value === group?.difficulty
                          ? "bg-[#7A6A5D] text-white"
                          : "bg-white text-gray-700"
                        }
            ${!isHost
                          ? "cursor-not-allowed opacity-50"
                          : "hover:bg-[#7A6A5D] hover:text-white"
                        }
          `}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>

              {!isHost && (
                <p className="text-xs text-gray-500">
                  Only the host can change difficulty
                </p>
              )}
            </div>


            {/* Max Players */}
            <div className="mb-8">
              <p className="text-base font-medium mb-3">Maximum Players</p>

              <div className="grid grid-cols-3 gap-3">
                {[3, 5, 7, 9, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    disabled={!isHost}
                    onClick={() => {
                      if (!isHost) return;

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
                      }
          ${!isHost
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-[#7A6A5D] hover:text-white"
                      }
        `}
                  >
                    {num}
                  </button>
                ))}
              </div>

              {!isHost && (
                <p className="text-xs text-gray-500 mt-2">
                  Only the host can change lobby settings
                </p>
              )}
            </div>



            {/* Start Time */}
            <div>
              <p className="text-base font-medium mb-2">Start Time</p>
              <p className="text-sm text-gray-500 mb-3">
                Time in seconds before the match starts (default: 10)
              </p>

              <input
                type="text"
                value={startTime}
                disabled={!isHost}
                onChange={(e) => {
                  if (!isHost) return;
                  setStartTime(e.target.value);
                }}
                className="w-full border rounded-lg px-4 py-3"
              />


              {!isHost && (
                <p className="text-xs text-gray-500 mt-2">
                  Only the host can change start time
                </p>
              )}
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

              <div
                className={`bg-white border rounded-lg px-4 py-3 text-base mb-6 break-all transition
    ${isBlurred ? "blur-sm select-none" : "blur-0 select-text"}
  `}
              >
                {inviteLink}
              </div>
              <div className="flex justify-center gap-4 mb-6">
                {/* COPY */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(inviteLink);
                    toast.success("Invite link copied!");
                  }}
                  className="px-6 py-2.5 text-base rounded-lg bg-[#7A6A5D] text-white"
                >
                  COPY
                </button>

                {/* BLUR / UNBLUR */}
                <button
                  onClick={() => setIsBlurred((prev) => !prev)}
                  className="px-6 py-2.5 text-base rounded-lg border bg-white"
                >
                  {isBlurred ? "SHOW" : "HIDE"}
                </button>
              </div>

              {group?.currentUserId === group?.ownerId ? (
                <button
                  onClick={startGame}
                  className="px-8 py-3 rounded-xl bg-[#7A6A5D] text-white text-lg flex items-center gap-2 mx-auto"
                >
                  ▶ START GAME
                </button>
              ) : (
                <p className="text-sm text-gray-500 text-center mt-4">
                  ⏳ Waiting for host to start the game…
                </p>
              )}

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
              Lobby ({players.length} / {group?.maximumPlayers})
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
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        // alt={p.name}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0" />
                    )}

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
                  {!p.isHost && isHost && (
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
};
export default GroupLobby;
