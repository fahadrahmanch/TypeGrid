import { getGroupRoomDetails } from "../../../api/user/group";
import Navbar from "../../../components/user/Navbar";
import { useEffect, useState, useRef } from "react";
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
import { FaWhatsapp, FaTelegram, FaShareAlt, FaTimes } from "react-icons/fa";
import { Crown, MessageSquare, Send, Sparkles } from "lucide-react";

type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  isHost?: boolean;
  avatar?: string;
  text: string;
  timestamp: string;
  isSelf: boolean;
};
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
  const inviteLink = `https://www.typegrid.in/group-play/group/${group?.joinLink}`;
  const [isBlurred, setIsBlurred] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  const [countDown, setCountDown] = useState<string>();
  const isStartingGameRef = useRef(false);

  // Small Chat UI State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
   
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);
  const quickReactions = ["👋", "🔥", "⚡", "🏎️", "👑", "😎"];

const handleSendMessage = (textToSend?: string) => {
  const content = (textToSend ?? chatInput).trim();

  if (!content || !group?.id) return;

  // Send message to backend with sender info
  socket.emit("send-message", {
    groupId: group.id,
    content,
    sender: {
      id: user?._id,
      name: user?.name || "Player",
      avatar: user?.imageUrl,
    },
  });

  // Clear input
  if (!textToSend) {
    setChatInput("");
  }
};
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const navigate = useNavigate();
  useEffect(() => {
    if (!group?.id) return;

    socket.emit("join-room", {
      groupId: group.id,
      userId: user?._id,
      userName: user?.name,
      avatar: user?.imageUrl,
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
    const handleUserLeave = ({ members, newHostId }: { members: Player[]; newHostId: string }) => {
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
          ? {
            ...prev,
            difficulty: data.difficulty,
            maximumPlayers: data.maximumPlayers,
          }
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
        navigate("/", { replace: true });
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
      const response = await removePlayerAPI(group?.id!, playerId);
      const groupDetails = response?.data?.group;
      setGroup((prev) => ({
        ...groupDetails,
        currentUserId: prev?.currentUserId,
      }));
      setPlayers(groupDetails.members);
    } catch (error: any) {
      console.log(error);
    }
  }

  async function editGroup(newDifficulty?: string, newMaxPlayers?: number) {
    if (!group?.id) return;
    await editGroupAPI(group.id, newDifficulty ?? difficulty, newMaxPlayers ?? maximumPlayers);
  }

  async function startGame() {
    try {
      if (!group?.id) return;
      isStartingGameRef.current = true;
      await startGroupPlayAPI(group?.id, Number(countDown));
    } catch (error: any) {
      console.log(error);
    }
  }


//chat section 

useEffect(() => {
  if (!group?.id) return;

  const groupId = group.id;

  const formatMessage = (message: any): ChatMessage => ({
    id: message.id,
    senderId: message.senderId,
    senderName: message.senderName || "Player",
    isHost: Boolean(group?.ownerId && String(message.senderId) === String(group.ownerId)),
    avatar: message.avatar,
    text: message.content,
    timestamp: message.timestamp
      ? new Date(message.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
    isSelf: Boolean(user?._id && String(message.senderId) === String(user._id)),
  });

  // Join chat room
  const joinChatRoom = () => {
    socket.emit("join-chat-room", {
      groupId,
      user: {
        id: user?._id,
        name: user?.name,
        avatar: user?.imageUrl,
      },
    });
  };

  // Receive chat history
  const handleChatHistory = (messages: any[]) => {
    setChatMessages((prev) => {
      const history = (messages || []).map(formatMessage);
      const historyIds = new Set(history.map((msg) => msg.id));

      const newMessages = prev.filter(
        (msg) => !historyIds.has(msg.id)
      );

      return [...history, ...newMessages];
    });
  };

  // Receive new messages
  const handleNewMessage = (message: any) => {
    const formattedMessage = formatMessage(message);

    setChatMessages((prev) => {
      if (prev.some((msg) => msg.id === formattedMessage.id)) {
        return prev;
      }

      return [...prev, formattedMessage];
    });
  };

  socket.on("chat-history", handleChatHistory);
  socket.on("new-message", handleNewMessage);
  socket.on("connect", joinChatRoom);

  if (socket.connected) {
    joinChatRoom();
  }

  return () => {
    socket.emit("leave-chat-room", { groupId });

    socket.off("chat-history", handleChatHistory);
    socket.off("new-message", handleNewMessage);
    socket.off("connect", joinChatRoom);
  };
}, [group?.id, group?.ownerId, user?._id, user?.name, user?.imageUrl]);



  if (loading) return <LoadingPage />;

  return (
    <>
      <Navbar />
      <main className="pt-24 px-4 md:px-8 pb-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* RIGHT – LOBBY & SQUAD CHAT */}
          <div className="lg:col-span-3 order-1 lg:order-3 bg-[#FFF1D8] rounded-3xl p-4 md:p-6 shadow-lg shadow-orange-900/5 flex flex-col justify-between">
            {/* LOBBY PLAYERS */}
            <div>
              <h2 className="text-base md:text-lg font-black text-gray-800 mb-3 flex items-center justify-between">
                <span>Lobby</span>
                <span className="text-[9px] md:text-[10px] bg-white/60 px-2.5 py-0.5 rounded-full text-orange-700 font-bold border border-white">
                  {players.length} / {group?.maximumPlayers}
                </span>
              </h2>

              <div className="flex flex-row lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto max-h-36 custom-scrollbar pb-1 lg:pb-0 flex-nowrap">
                {players.map((p, i) => (
                  <div key={i} className="min-w-[130px] lg:min-w-0 flex items-center justify-between bg-white/60 backdrop-blur-sm rounded-2xl px-3 py-2 border border-white transition-all hover:bg-white shrink-0">
                    {/* LEFT SIDE */}
                    <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <img
                          src={p.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`}
                          className="w-7 h-7 lg:w-8 lg:h-8 rounded-xl object-cover bg-gray-100 ring-2 ring-white shadow-xs"
                          alt={p.name}
                        />
                        {p.isHost && (
                          <div className="absolute -top-1 -right-1 bg-amber-400 text-white p-0.5 rounded-md shadow-xs border border-white">
                            <Crown size={5} className="lg:size-2.5 fill-current" />
                          </div>
                        )}
                      </div>

                      {/* Name + host */}
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] lg:text-xs font-black text-gray-800 truncate">{p.name}</span>
                        {p.isHost && (
                          <span className="text-[7px] font-black text-orange-600 uppercase tracking-widest">
                            Host
                          </span>
                        )}
                      </div>
                    </div>

                    {/* RIGHT SIDE */}
                    {!p.isHost && isHost && (
                      <button
                        onClick={() => removePlayer(p.userId)}
                        className="w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0 rounded-lg bg-red-50 text-red-500 text-[10px] flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-90"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* SMALL CHAT UI (In the empty space of Lobby Card) */}
            <div className="mt-4 pt-3 border-t border-orange-200/50 flex flex-col flex-1 min-h-[220px]">
              {/* Chat Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black text-gray-800 flex items-center gap-1.5 uppercase tracking-wider">
                  <MessageSquare size={13} className="text-[#7A6A5D]" /> Squad Chat
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </span>
                <span className="text-[8px] bg-white/70 px-2 py-0.5 rounded-full text-orange-800 font-bold uppercase tracking-wider border border-white">
                  Live
                </span>
              </div>

              {/* Chat Messages Feed */}
              <div className="flex-1 max-h-36 overflow-y-auto space-y-2 pr-1 custom-scrollbar mb-2 text-xs">
                {chatMessages.map((msg) => {
                  if (msg.senderId === "system") {
                    return (
                      <div key={msg.id} className="flex justify-center my-0.5">
                        <span className="bg-white/60 text-gray-500 rounded-full px-2.5 py-0.5 text-[9px] font-bold text-center border border-orange-100">
                          {msg.text}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-1.5 ${msg.isSelf ? "justify-end" : "justify-start"}`}
                    >
                      {!msg.isSelf && (
                        <img
                          src={msg.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.senderName}`}
                          alt={msg.senderName}
                          className="w-5 h-5 rounded-lg object-cover bg-white ring-1 ring-white shadow-xs shrink-0 mb-0.5"
                        />
                      )}

                      <div className={`flex flex-col max-w-[85%] ${msg.isSelf ? "items-end" : "items-start"}`}>
                        {!msg.isSelf && (
                          <div className="flex items-center gap-1 pl-1 mb-0.5">
                            <span className="text-[9px] font-black text-gray-700">
                              {msg.senderName}
                            </span>
                            {msg.isHost && (
                              <span className="text-[7px] font-black bg-amber-100 text-amber-700 px-1 py-0.2 rounded border border-amber-200">
                                Host
                              </span>
                            )}
                          </div>
                        )}
                        <div
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold break-words leading-tight shadow-xs ${
                            msg.isSelf
                              ? "bg-[#7A6A5D] text-white rounded-br-xs"
                              : "bg-white text-gray-800 rounded-tl-xs border border-white/80"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[7px] text-gray-400 mt-0.5 px-0.5">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatMessagesEndRef} />
              </div>

              {/* Quick Reactions */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1.5 custom-scrollbar mb-1.5">
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest shrink-0 mr-0.5 flex items-center gap-0.5">
                  <Sparkles size={8} className="text-amber-500" />
                </span>
                {quickReactions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleSendMessage(emoji)}
                    className="shrink-0 bg-white/70 hover:bg-white text-xs px-1.5 py-0.5 rounded-lg border border-white/80 active:scale-90 transition-transform shadow-xs"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Chat Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-1.5"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Chat..."
                  className="w-full bg-white border border-white rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-800 placeholder:text-gray-400 focus:border-[#7A6A5D] outline-none shadow-xs transition-all"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="p-2 rounded-xl bg-[#7A6A5D] text-white hover:bg-[#68594d] active:scale-95 transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  title="Send"
                >
                  <Send size={11} />
                </button>
              </form>
            </div>
          </div>

          {/* CENTER - Invite Box */}
          <div className="lg:col-span-6 order-2 lg:order-2 space-y-6 md:space-y-8 ">
            {/* INVITE BOX */}
            <div className="bg-[#FFF1D8]  rounded-[2.5rem] p-6 md:p-10 text-center shadow-lg shadow-orange-900/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-300 via-white to-orange-300 opacity-30"></div>

              <div className="mb-8">
                <h3 className="text-2xl md:text-3xl font-black text-gray-800 mb-2">Invite Squad</h3>
                <p className="text-sm md:text-base text-gray-500 font-medium max-w-sm mx-auto">
                  Share this magic link to bring your friends into the competition!
                </p>
              </div>

              <div className="relative group mb-8">
                <div
                  className={`bg-white border-2 border-dashed border-orange-200 rounded-2xl px-6 py-4 text-sm md:text-base font-black text-gray-600 break-all transition-all duration-500
                    ${isBlurred ? "blur-md select-none opacity-50 scale-95" : "blur-0 select-text opacity-100 scale-100"}
                  `}
                >
                  {inviteLink}
                </div>
                {isBlurred && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => setIsBlurred(false)}
                      className="px-4 py-1.5 bg-[#7A6A5D] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-transform"
                    >
                      Reveal Link
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8">
                {/* COPY */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(inviteLink);
                    toast.success("Invite link copied!");
                  }}
                  className="flex-1 min-w-[120px] md:flex-none px-8 py-3.5 text-xs md:text-sm font-black rounded-xl bg-[#7A6A5D] text-white shadow-lg shadow-orange-900/10 hover:shadow-orange-900/20 active:scale-95 transition-all uppercase tracking-widest"
                >
                  COPY LINK
                </button>

                {/* BLUR / UNBLUR */}
                <button
                  onClick={() => setIsBlurred((prev) => !prev)}
                  className="flex-1 min-w-[120px] md:flex-none px-8 py-3.5 text-xs md:text-sm font-black rounded-xl border-2 border-white bg-white text-gray-600 hover:bg-gray-50 active:scale-95 transition-all uppercase tracking-widest"
                >
                  {isBlurred ? "SHOW" : "HIDE"}
                </button>

                {/* SHARE BUTTON */}
                <div className="relative flex-1 md:flex-none">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="w-full md:w-auto px-8 py-3.5 text-xs md:text-sm font-black rounded-xl border-2 border-white bg-white text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-95 transition-all uppercase tracking-widest"
                  >
                    <FaShareAlt />
                    Share
                  </button>

                  {/* SHARE MENU POPUP */}
                  {showShareMenu && (
                    <div className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 bg-white border-2 border-orange-50 rounded-2xl shadow-2xl p-4 z-50 w-64 animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-200">
                      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Share via</h4>
                        <button onClick={() => setShowShareMenu(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                          <FaTimes className="text-gray-400" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={() => {
                            const text = `Join my TypeGrid group! Link: ${inviteLink}`;
                            const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
                            window.open(url, "_blank");
                            setShowShareMenu(false);
                          }}
                          className="w-full px-4 py-3 rounded-xl bg-[#25D366] text-white flex items-center gap-3 hover:bg-[#128C7E] transition-all font-black text-xs uppercase tracking-widest shadow-md"
                        >
                          <FaWhatsapp size={18} />
                          WhatsApp
                        </button>

                        <button
                          onClick={() => {
                            const text = "Join my TypeGrid group!";
                            const url = `https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(text)}`;
                            window.open(url, "_blank");
                            setShowShareMenu(false);
                          }}
                          className="w-full px-4 py-3 rounded-xl bg-[#0088cc] text-white flex items-center gap-3 hover:bg-[#007dbb] transition-all font-black text-xs uppercase tracking-widest shadow-md"
                        >
                          <FaTelegram size={18} />
                          Telegram
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {group?.currentUserId === group?.ownerId ? (
                <button
                  onClick={startGame}
                  className="w-full md:w-auto px-12 py-5 rounded-2xl bg-[#7A6A5D] text-white text-lg font-black uppercase tracking-[0.2em] shadow-xl shadow-orange-900/20 hover:scale-[1.02] active:scale-95 transition-all flex justify-center md:justify-start gap-3"
                >
                  <span className="text-2xl">▶</span> START GAME
                </button>
              ) : (
                <div className="flex items-center justify-center gap-3 px-6 py-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-ping"></div>
                  <p className="text-sm text-orange-800 font-bold uppercase tracking-widest italic">Waiting for host to launch…</p>
                </div>
              )}
            </div>
          </div>

          {/* LEFT – SETTINGS */}
          <div className="lg:col-span-3 order-3 lg:order-1 bg-[#FFF1D8] rounded-3xl p-6 md:p-8 shadow-lg shadow-orange-900/5">
            <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
              <span className="p-2 bg-white/50 rounded-xl">⚙️</span> Settings
            </h2>

            {/* Difficulty */}
            <div className="mb-8">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Difficulty</p>

              <div className="grid grid-cols-3 gap-2 md:gap-3 mb-3">
                {["Easy", "Medium", "Hard"].map((d) => {
                  const value = d.toLowerCase();

                  return (
                    <button
                      key={d}
                      type="button"
                      disabled={!isHost}
                      onClick={() => {
                        if (!isHost) return;

                        setGroup((prev: any) => ({
                          ...prev,
                          difficulty: value,
                        }));
                        setDifficulty(value);
                        editGroup(value, undefined);
                      }}
                      className={`text-sm md:text-base py-2.5 rounded-xl border-2 transition-all font-bold
                        ${value === group?.difficulty ? "bg-[#7A6A5D] border-[#7A6A5D] text-white shadow-md" : "bg-white border-gray-100 text-gray-700 hover:border-orange-200"}
                        ${!isHost ? "cursor-not-allowed opacity-50" : "active:scale-95"}
                      `}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>

              {!isHost && <p className="text-[10px] font-bold text-orange-600/70 uppercase tracking-wider">Host Only</p>}
            </div>

            {/* Max Players */}
            <div className="mb-8">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Max Players</p>

              <div className="grid grid-cols-3 gap-2 md:gap-3">
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
                    className={`text-sm md:text-base py-2.5 rounded-xl border-2 transition-all font-bold
                      ${num === Number(group?.maximumPlayers) ? "bg-[#7A6A5D] border-[#7A6A5D] text-white shadow-md" : "bg-white border-gray-100 text-gray-700 hover:border-orange-200"}
                      ${!isHost ? "cursor-not-allowed opacity-50" : "active:scale-95"}
                    `}
                  >
                    {num}
                  </button>
                ))}
              </div>

              {!isHost && <p className="text-[10px] font-bold text-orange-600/70 uppercase tracking-wider mt-3">Host Only</p>}
            </div>

            {/* Start Time */}
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2">Start Time</p>
              <p className="text-[11px] text-gray-400 font-medium mb-4">Lobby delay before launch (1-60s)</p>

              <div className="relative">
                <input
                  type="number"
                  value={countDown}
                  disabled={!isHost}
                  min={1}
                  max={60}
                  onKeyDown={(e) => {
                    if (["-", "e", "+"].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    if (!isHost) return;
                    let val = e.target.value;
                    if (val === "") {
                      setCountDown("");
                      return;
                    }
                    let num = parseInt(val);
                    if (num < 1) num = 1;
                    if (num > 60) num = 60;
                    setCountDown(num.toString());
                  }}
                  className="w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-3 font-black text-gray-800 focus:border-[#7A6A5D] outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
                  placeholder="10"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300 uppercase tracking-widest">Seconds</span>
              </div>

              {!isHost && <p className="text-[10px] font-bold text-orange-600/70 uppercase tracking-wider mt-3">Host Only</p>}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
export default GroupLobby;
