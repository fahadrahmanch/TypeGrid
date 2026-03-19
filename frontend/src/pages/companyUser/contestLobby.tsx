import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Clock,
  Trophy,
  Users,
  CheckCircle2,
  Timer,
 
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import CompanyUserNavbar from "../../components/companyUser/layout/companyUserNavbar";
import { socket } from "../../socket";
import { fetchContestDetails } from "../../api/companyAdmin/companyContextAPI";
import { useSelector } from "react-redux";
import { updateContestStatus } from "../../api/companyAdmin/companyContextAPI";
const ContestLobby = () => {
  const navigate = useNavigate();
  const { contestId } = useParams<{ contestId: string }>();

  // Countdown state initializing with days/hours/minutes/seconds
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [contestDetails, setContestDetails] = useState<any>({});
  const user = useSelector((state: any) => state.companyAuth.user);

  const [lobbyParticipants, setLobbyParticipants] = useState<any>([]);
  const [contestStatus, setContestStatus] = useState<any>("");

  const [timerFinished, setTimerFinished] = useState(false);
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
        navigate(`/company/user/contest/${data.contestId}`, {});
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
        navigate("/company/user/contests", { replace: true });
      }
    };
    fetchContest();
  }, [contestId]);

  useEffect(() => {
    if (!contestDetails?.startTime) return;
    if (contestStatus == "waiting") return;
    const updateTimer = () => {
      const now = new Date().getTime();
      const start = new Date(contestDetails.startTime).getTime();
      const difference = start - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setTimerFinished(true);
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
  }, [contestDetails?.startTime, contestStatus]);

  const formatTime = (time: number) => time.toString().padStart(2, "0");
  if (!contestDetails) {
    return;
  }
  useEffect(() => {
    if (contestStatus === "waiting") {
      setTimeLeft({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
      setTimerFinished(true);
    }
  }, [contestStatus]);
  useEffect(() => {
    if (contestStatus === "upcoming" && timerFinished) {
      updateContestStatus(contestId!, "waiting").then((res) =>
        setContestStatus(res.data.status),
      );
    }
  }, [timerFinished, contestStatus]);

  // Anti-Interaction Logic (Copy/Paste/Zoom/Scroll)
  useEffect(() => {
    const handleEvents = (e: any) => {
      // Prevent zooming (Cmd/Ctrl +/-)
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "+" || e.key === "-" || e.key === "=" || e.key === "0")
      ) {
        e.preventDefault();
      }
    };

    const handleWheel = (e: any) => {
      // Prevent Ctrl+Wheel zoom
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    const preventPaste = (e: ClipboardEvent) => e.preventDefault();
    const preventCopy = (e: ClipboardEvent) => e.preventDefault();
    const preventContextMenu = (e: MouseEvent) => e.preventDefault();

    window.addEventListener("keydown", handleEvents);
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("paste", preventPaste);
    window.addEventListener("copy", preventCopy);
    window.addEventListener("contextmenu", preventContextMenu);

    // Lock Body Scroll
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      window.removeEventListener("keydown", handleEvents);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("paste", preventPaste);
      window.removeEventListener("copy", preventCopy);
      window.removeEventListener("contextmenu", preventContextMenu);
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#FDF9F2] font-sans selection:bg-[#ECA468]/30 selection:text-[#ECA468] flex flex-col text-slate-800 overflow-hidden z-[100]">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#ECA468]/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#8CA78A]/10 blur-[100px] pointer-events-none"></div>

      <CompanyUserNavbar />

      <main className="flex-1 flex flex-col px-4 sm:px-8 max-w-7xl mx-auto w-full pt-24 pb-12 z-10 h-full relative">
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
        <div className="flex-1 bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-[0_15px_40px_rgb(236,164,104,0.06)] border border-[#ECA468]/10 overflow-hidden relative flex flex-col h-full min-h-0">
          {/* Decorative Top Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ECA468] via-orange-400 to-[#8CA78A]" />

          <div className="p-6 md:p-8 flex flex-col h-full min-h-0">
            {/* Title Section Container - Compressed */}
            <div className="flex-shrink-0 flex justify-between items-start mb-8 border-b border-[#f8e8c8]/40 pb-6">
              <div>
                <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-800 mb-1">
                  {contestDetails?.title}
                </h1>
                <p className="text-slate-500 text-sm font-medium">
                  Get ready to show your skills. The contest is about to begin.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FFF4EC]/60 border border-[#FADDB8] text-[#D0864B] text-[10px] font-black uppercase tracking-widest shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#ECA468] animate-pulse" />
                {contestStatus}
              </span>
            </div>

            {/* Middle Section: Timer & Key Info */}
            <div className="flex-shrink-0 grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-6">
              {/* Left Info Stats */}
              <div className="flex flex-col gap-3 h-full">
                <div className="bg-[#f8e8c8]/10 rounded-2xl p-5 border border-[#f8e8c8]/40 flex items-start gap-4 hover:bg-[#fff8ea]/40 hover:shadow-md transition-all h-full group/card">
                  <div className="w-12 h-12 rounded-xl bg-[#FFF4EC] flex items-center justify-center text-[#ECA468] shrink-0 shadow-sm border border-[#FADDB8]">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div className="w-full pr-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2">
                      Prize Pool
                    </p>
                    {contestDetails.rewards &&
                    contestDetails.rewards.length > 0 ? (
                      <div className="flex flex-col gap-1.5">
                        {[...contestDetails.rewards]
                          .sort((a: any, b: any) => a.rank - b.rank)
                          .map((reward: any) => (
                            <div
                              key={reward.rank}
                              className="flex justify-between items-center text-sm border-b last:border-0 border-[#f8e8c8]/30 pb-1 last:pb-0"
                            >
                              <span className="font-bold text-slate-500">
                                {reward.rank}
                                {reward.rank === 1
                                  ? "st"
                                  : reward.rank === 2
                                    ? "nd"
                                    : reward.rank === 3
                                      ? "rd"
                                      : "th"}
                              </span>
                              <span className="font-black text-[#ECA468]">
                                ${reward.prize}
                              </span>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-xl font-black text-slate-800">$0</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Center Timer */}
              <div className="flex justify-center">
                <div className="relative group/timer">
                  <div className="absolute inset-0 bg-[#ECA468]/20 rounded-[2rem] blur-2xl opacity-40 group-hover/timer:opacity-60 transition-opacity duration-700" />
                  <div className="relative bg-[#fff8ea]/80 border border-[#FADDB8] rounded-[2rem] shadow-xl p-8 flex flex-col items-center justify-center min-w-[240px] min-h-[180px] backdrop-blur-md">
                    <Timer className="w-6 h-6 text-[#ECA468] mb-3 animate-pulse" />
                    {contestStatus === "waiting" ? (
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-black text-[#D0864B] uppercase tracking-[0.2em] text-center px-4 leading-tight mb-2">
                          Status
                        </span>
                        <span className="text-sm font-bold text-slate-600 text-center leading-snug">
                          Waiting for host<br/>to start
                        </span>
                      </div>
                    ) : (
                      <>
                        <span className="text-[10px] font-black text-[#D0864B] uppercase tracking-[0.2em] mb-2">
                          Starts In
                        </span>
                        <div
                          className={`font-mono font-black tracking-tight text-slate-800 drop-shadow-sm flex items-center ${timeLeft.days > 0 ? "text-4xl" : "text-5xl"}`}
                        >
                          {timeLeft.days > 0 && (
                            <>
                              <span>{formatTime(timeLeft.days)}</span>
                              <span className="text-[#ECA468] opacity-60 mx-1 mb-1">:</span>
                            </>
                          )}
                          {(timeLeft.days > 0 || timeLeft.hours > 0) && (
                            <>
                              <span>{formatTime(timeLeft.hours)}</span>
                              <span className="text-[#ECA468] opacity-60 mx-1 mb-1">:</span>
                            </>
                          )}
                          <span>{formatTime(timeLeft.minutes)}</span>
                          <span className="text-[#ECA468] opacity-60 mx-1 mb-1">:</span>
                          <span>{formatTime(timeLeft.seconds)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Info Stats */}
              <div className="flex flex-col gap-3">
                <div className="bg-[#f8e8c8]/10 rounded-2xl p-5 border border-[#f8e8c8]/40 flex items-center gap-4 hover:bg-[#fff8ea]/40 hover:shadow-md transition-all group/card">
                  <div className="w-12 h-12 rounded-xl bg-[#F2F7F2] flex items-center justify-center text-[#8CA78A] shadow-sm border border-[#C4E0C4]">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#6D8A6B] mb-1">
                      Duration
                    </p>
                    <p className="text-xl font-black text-slate-800">
                      {Math.round(contestDetails.duration / 60)} min
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Participants Section - Scrollable part within the layout */}
            <div className="flex-1 flex flex-col min-h-0 bg-[#f8e8c8]/10 rounded-[2rem] border border-[#f8e8c8]/30 p-6">
              <div className="flex-shrink-0 flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/80 shadow-sm border border-[#f8e8c8]/60 flex items-center justify-center backdrop-blur-sm">
                    <Users className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 leading-tight">
                      Waiting Lobby
                    </h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest opacity-70">
                      {lobbyParticipants.length} / {contestDetails.maxParticipants} Ready to Race
                    </p>
                  </div>
                </div>
                <div className="hidden sm:block text-[10px] font-black px-4 py-2 bg-white/80 rounded-xl text-slate-600 border border-[#f8e8c8]/60 shadow-sm uppercase tracking-[0.15em] backdrop-blur-sm">
                  Waiting for racers...
                </div>
              </div>

              {/* Participant Grid Layout */}
              <div className="flex-1 overflow-y-auto pr-2 pb-2 custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                  {lobbyParticipants.map((participant: any) => (
                    <div
                      key={participant.id}
                      className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-[#f8e8c8]/40 shadow-sm hover:shadow-md transition-all flex justify-between items-center group cursor-default hover:bg-white/60"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shadow-inner ${participant.color}`}
                        >
                          {participant.initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-800 group-hover:text-[#ECA468] transition-colors truncate w-24 sm:w-28">
                            {participant.name}
                          </span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">
                            Competitor
                          </span>
                        </div>
                      </div>

                      {/* Status Icon */}
                      <div
                        className={`p-2 rounded-lg ${
                          participant.status === "Ready"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-amber-50 text-amber-600 border border-amber-100"
                        }`}
                      >
                        {participant.status === "Ready" ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Placeholder for missing participants */}
                  {Array.from({
                    length: Math.min(
                      8,
                      contestDetails.maxParticipants -
                        contestDetails.joinedParticipants,
                    ),
                  }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="bg-white/20 rounded-2xl p-4 border border-dashed border-[#f8e8c8]/60 flex items-center gap-3 opacity-40"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-200/50 animate-pulse" />
                      <div className="flex flex-col gap-2 w-full">
                        <div className="w-20 h-2.5 bg-slate-200/50 rounded-full animate-pulse" />
                        <div className="w-12 h-2 bg-slate-100/50 rounded-full animate-pulse" />
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
