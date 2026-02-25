import React, { useState, useEffect } from "react";
import { ArrowLeft, Clock, Trophy, Users, CheckCircle2, Timer, Award, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import CompanyUserNavbar from "../../components/companyUser/layout/companyUserNavbar";
import { socket } from "../../socket";
import { fetchContestDetails } from "../../api/companyAdmin/companyContextAPI";
import { useSelector } from "react-redux";

const ContestLobby = () => {
    const navigate = useNavigate();
    const { contestId } = useParams<{ contestId: string }>();

    // Countdown state initializing with days/hours/minutes/seconds
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [contestDetails, setContestDetails] = useState<any>({});
    const user=useSelector((state:any)=>state.companyAuth.user);

    const [lobbyParticipants, setLobbyParticipants] = useState<any>([]);
    const [contestStatus, setContestStatus] = useState<any>(contestDetails?.status);

useEffect(() => {
  if (!contestId || !user?._id) return;

   socket.emit("join-companyContest-lobby", {
    contestId,
    user: {
      userId: user._id,
      name: user.name,
      imageUrl: user.imageUrl,
    },
  });
}, [contestId, user?._id]);


useEffect(() => {

  socket.on("lobby-users-update", (data) => {
    setLobbyParticipants(data);
  });

  return () => {
    socket.off("lobby-users-update");
  };

}, []);


useEffect(() => {
  socket.on("contest-status-changed", (data) => {
    setContestStatus(data.status);
    if (data.status === "ongoing") {
      navigate(`/company/user/contest/${data.contestId}`, {
     
      });
    }
  });

  return () => {
    socket.off("contest-status-changed");
  };
}, [contestDetails]);

useEffect(() => {
  return () => {
    socket.emit("leave-companyContest-lobby", {
      contestId,
      userId: user?._id,
    });
  };
}, []);
    //fecth Contest Details
    useEffect(() => {
        const fetchContest = async () => {
            try {
                const response = await fetchContestDetails(contestId!);
                setContestDetails(response.data.data);
                setContestStatus(response.data.data.status);
            } catch (error) {
                navigate("/company/user/contests",{replace:true});
            }
        };
        fetchContest();
    }, [contestId]);

    useEffect(() => {
        if (!contestDetails?.startTime) return;

        const updateTimer = () => {
            const now = new Date().getTime();
            const start = new Date(contestDetails.startTime).getTime();
            const difference = start - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000)
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return true; // indicates timer is done
            }
            return false;
        };
        // Run instantly to avoid 1-second delay 
        const isDone = updateTimer();
        if (isDone) return;

        const timer = setInterval(() => {
            const done = updateTimer();
            if (done) clearInterval(timer);
        }, 1000);

        return () => clearInterval(timer);
    }, [contestDetails?.startTime]);

    const formatTime = (time: number) => time.toString().padStart(2, "0");
    if(!contestDetails){
       return; 
    }

    return (
        <div className="h-screen  text-gray-900 font-sans overflow-hidden flex flex-col">
            <CompanyUserNavbar />

            <main className="flex-1 flex flex-col px-4 sm:px-8 max-w-7xl mx-auto w-full pt-20 pb-6">

                {/* Header Navigation */}
                <div className="flex-shrink-0 mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <div className="p-1.5 rounded-lg bg-gray-50 border border-gray-100 group-hover:bg-white group-hover:border-gray-200 transition-all shadow-sm">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        Back to Contests
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative flex flex-col h-full min-h-0">

                    {/* Decorative Top Accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500" />

                    <div className="p-6 md:p-8 flex flex-col h-full min-h-0">
                        {/* Title Section Container - Compressed */}
                        <div className="flex-shrink-0 flex justify-between items-start mb-6 border-b border-gray-50 pb-4">
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-900 mb-1">
                                    {contestDetails?.title}
                                </h1>
                                <p className="text-gray-500 text-sm">
                                    Get ready to show your skills. The contest is about to begin.
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider">
                                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                {contestStatus}
                            </span>
                        </div>

                        {/* Middle Section: Timer & Key Info */}
                        <div className="flex-shrink-0 grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-6">

                            {/* Left Info Stats */}
                            <div className="flex flex-col gap-3">
                                <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 flex items-center gap-4 hover:bg-white hover:shadow-sm transition-all">
                                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                                        <Trophy className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Prize Pool</p>
                                        <p className="text-lg font-bold text-gray-900">
                                            ${contestDetails.rewards ? contestDetails.rewards.reduce((total: number, reward: any) => total + reward.prize, 0) : 0}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Center Timer */}
                            <div className="flex justify-center">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-orange-300 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                                    <div className="relative bg-white border border-gray-100 rounded-3xl shadow-lg p-6 flex flex-col items-center justify-center w-[220px] h-[160px]">
                                        <Clock className="w-5 h-5 text-orange-500 mb-2" />
                                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Starts In</span>
                                        <div className={`font-mono font-bold tracking-tight text-gray-900 drop-shadow-sm flex items-center ${timeLeft.days > 0 ? "text-3xl" : "text-4xl"}`}>
                                            {timeLeft.days > 0 && (
                                                <>
                                                    <span>{formatTime(timeLeft.days)}</span>
                                                    <span className="text-orange-400 opacity-80 mx-0.5 mb-1">:</span>
                                                </>
                                            )}
                                            {(timeLeft.days > 0 || timeLeft.hours > 0) && (
                                                <>
                                                    <span>{formatTime(timeLeft.hours)}</span>
                                                    <span className="text-orange-400 opacity-80 mx-0.5 mb-1">:</span>
                                                </>
                                            )}
                                            <span>{formatTime(timeLeft.minutes)}</span>
                                            <span className="text-orange-400 opacity-80 mx-0.5 mb-1">:</span>
                                            <span>{formatTime(timeLeft.seconds)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Info Stats */}
                            <div className="flex flex-col gap-3">
                                <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 flex items-center gap-4 hover:bg-white hover:shadow-sm transition-all">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Timer className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Duration</p>
                                        <p className="text-lg font-bold text-gray-900">{contestDetails.duration} min</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Participants Section - Scrollable part within the layout */}
                        <div className="flex-1 flex flex-col min-h-0 bg-gray-50/30 rounded-2xl border border-gray-50 p-4">
                            <div className="flex-shrink-0 flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center">
                                        <Users className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 leading-tight">Lobby Waiting</h3>
                                        <p className="text-xs text-gray-500 font-medium">
                                            {contestDetails.joinedParticipants} of {contestDetails.maxParticipants} ready
                                        </p>
                                    </div>
                                </div>
                                <div className="hidden sm:block text-xs font-medium px-3 py-1.5 bg-white rounded-md text-gray-600 border border-gray-200 shadow-sm">
                                    Waiting for others...
                                </div>
                            </div>

                            {/* Participant Grid Layout */}
                            <div className="flex-1 overflow-y-auto pr-2 pb-2 custom-scrollbar">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                                    {lobbyParticipants.map((participant:any) => (
                                        <div
                                            key={participant.id}
                                            className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm hover:shadow-md transition-all flex justify-between items-center group cursor-default"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${participant.color}`}>
                                                    {participant.initials}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate w-24 sm:w-28">
                                                        {participant.name}
                                                    </span>
                                                    <span className="text-[9px] font-medium text-gray-400 uppercase tracking-widest leading-none">
                                                        Competitor
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Status Icon */}
                                            <div className={`p-1.5 rounded-md ${participant.status === "Ready"
                                                ? "bg-emerald-50 text-emerald-600"
                                                : "bg-amber-50 text-amber-600"
                                                }`}>
                                                {participant.status === "Ready"
                                                    ? <CheckCircle2 className="w-4 h-4" />
                                                    : <Clock className="w-4 h-4" />
                                                }
                                            </div>
                                        </div>
                                    ))}

                                    {/* Placeholder for missing participants */}
                                    {Array.from({ length: Math.min(8, contestDetails.maxParticipants - contestDetails.joinedParticipants) }).map((_, i) => (
                                        <div
                                            key={`empty-${i}`}
                                            className="bg-white/50 rounded-xl p-3 border border-dashed border-gray-200 flex items-center gap-2.5 opacity-50"
                                        >
                                            <div className="w-9 h-9 rounded-lg bg-gray-100" />
                                            <div className="flex flex-col gap-1.5 w-full">
                                                <div className="w-16 h-2 bg-gray-200 rounded-full" />
                                                <div className="w-10 h-1.5 bg-gray-100 rounded-full" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* Minimal Custom Scrollbar styles applied directly */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
            `}</style>
        </div>
    );
};

export default ContestLobby;
