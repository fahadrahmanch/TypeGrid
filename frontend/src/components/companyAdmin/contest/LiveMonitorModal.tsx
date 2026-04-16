import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Square, RotateCcw, Send, Trophy } from "lucide-react";
import { socket } from "../../../socket";
import { fetchContest } from "../../../api/companyAdmin/companyContextAPI";
interface LiveMonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  contestId: string;
  contestTitle: string;
  duration: number; // in minutes
  // onEndContest: () => void;
}

interface ParticipantLiveStats {
  userId: string;
  name: string;
  wpm: number;
  accuracy: number;
  errors: number;
  progress: number;
}
export type GamePlayerResult = {
  userId: string;
  wpm: number;
  accuracy: number | null;
  errors: number;
  typedLength: number;
  status: "times-up" | "finished" | "playing";
  updatedAt: number;
  name: string;
  imageUrl: string;
  timeTaken: number;
  prize: number;
  rank?: number;
};

const LiveMonitorModal: React.FC<LiveMonitorModalProps> = ({
  isOpen,
  onClose,
  contestId,
  contestTitle,
  // duration,
}) => {
  const [participants, setParticipants] = useState<ParticipantLiveStats[]>([]);
  const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
  const [announcementMsg, setAnnouncementMsg] = useState("");
  const [contestDetails, setContestDetails] = useState<any>({});
  const [contestStatus, setContestStatus] = useState<any>(null);
  // const [phase, setPhase] = useState<"COUNTDOWN" | "PLAY">("COUNTDOWN");
  // const [countdown, setCountdown] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  // const [elapsedTime, setElapsedTime] = useState(0);
  const [finalResult, setFinalResult] = useState<GamePlayerResult[]>([]);

  // const [isFinished, setIsFinished] = useState(false);
  useEffect(() => {
    if (!isOpen) return;

    socket.emit("admin-join-live-monitor", { contestId });

    socket.on("admin-live-data", (data) => {
      if (Array.isArray(data)) {
        setParticipants(data);
      }
    });

    socket.on("typing-progress-update-contest", (data) => {
      setParticipants((prev) => prev.map((p) => (p.userId === data.userId ? { ...p, ...data } : p)));
    });

    socket.on("contest-users-update", (data) => {
      setParticipants(data);
    });

    socket.on("game-finished-contest", (data) => {
      setContestStatus("completed");
      setFinalResult(data);
    });

    return () => {
      socket.off("admin-live-data");
      socket.off("typing-progress-update-contest");
      socket.off("contest-users-update");
      socket.off("game-finished-contest");
    };
  }, [isOpen, contestId]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleSendAnnouncement = () => {
    if (!announcementMsg.trim()) return;
    socket.emit("send-contest-announcement", {
      contestId,
      message: announcementMsg,
    });
    setAnnouncementMsg("");
    setIsAnnouncementOpen(false);
  };

  useEffect(() => {
    const fetchContestDetails = async () => {
      try {
        const response = await fetchContest(contestId!);
        // Safely grab the data whether it is nested or not
        const contestData = response.data?.data || response.data;

        if (contestData) {
          setContestDetails(contestData);
          setContestStatus(contestData.status);
        }
      } catch (error) {
        console.error("Failed to fetch contest details:", error);
      }
    };
    fetchContestDetails();
  }, [contestId]);

  useEffect(() => {
    if (!contestDetails?.startTime || !contestDetails?.duration || finalResult.length > 0) return;
    const startTimesamp = new Date(contestDetails.startTime).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTimesamp) / 1000);
      if (elapsed < contestDetails.countDown) {
        // setPhase("COUNTDOWN");
        setCountdown(contestDetails.countDown - elapsed);
      } else if (elapsed < contestDetails.countDown + contestDetails.duration) {
        // setPhase("PLAY");
        setRemainingTime(contestDetails.countDown + contestDetails.duration - elapsed);

        // setElapsedTime(elapsed - contestDetails.countDown);
      } else {
        // setPhase("PLAY");
        setRemainingTime(0);
        //  setIsfinished(true);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [contestDetails?.startTime, contestDetails?.duration, contestDetails?.countDown, finalResult]);

  useEffect(() => {
    const handleRestart = (data: any) => {
      setFinalResult([]);
      setContestStatus("ongoing");

      if (Array.isArray(data.users)) {
        setParticipants(data.users);
      }

      if (data.newStartTime) {
        setContestDetails((prev: any) => ({
          ...prev,
          startTime: data.newStartTime,
        }));
      }
    };

    socket.on("contest-restarted", handleRestart);

    return () => {
      socket.off("contest-restarted", handleRestart);
    };
  }, []);
  async function restart() {
    socket.emit("restart-contest", {
      contestId,
      status: "ongoing",
    });
  }

  async function handleEndContest() {
    socket.emit("end-contest", {
      contestId: contestId,
      status: "completed",
    });
  }

  if (!isOpen) return null;
  if (!contestDetails) return null;
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FDFBF7]/90 backdrop-blur-sm animate-in fade-in duration-200 p-2 sm:p-4">
      <div className="bg-[#F4F2EE] w-full max-w-[1500px] h-full max-h-[98vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-200 border border-[#ECA468]/10 text-slate-800">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar relative">
          {/* Back header */}
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-medium mb-8 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dashboard</span>
          </button>

          {/* Top Header Card */}
          <div className="bg-white rounded-[1.5rem] p-6 md:p-8 shadow-sm mb-6 flex justify-between items-center border border-gray-100">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Live Monitoring Panel</h1>
              <p className="text-gray-500 font-medium">{contestTitle}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Time Remaining</p>
                {contestDetails?.startTime ? (
                  <p className="text-3xl font-black text-[#D0864B] tracking-tight">{formatTime(remainingTime)}</p>
                ) : (
                  <p className="text-gray-500 font-medium">Loading timer...</p>
                )}
              </div>
              <div className="bg-emerald-100/80 text-emerald-700 px-4 py-2 rounded-full font-bold text-sm border border-emerald-200/50 shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {contestStatus}
              </div>
            </div>
          </div>

          {/* Action Buttons Card */}
          {contestStatus === "ongoing" && (
            <div className="bg-white rounded-[1.5rem] p-6 md:p-8 shadow-sm mb-6 flex flex-col gap-4 border border-gray-100">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleEndContest}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#ECA468] hover:bg-[#D0864B] text-white rounded-xl font-bold shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 outline-none"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    End Contest
                  </button>
                  <button
                    onClick={restart}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#7D6B5D] hover:bg-[#635449] text-white rounded-xl font-bold shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 outline-none"
                  >
                    <RotateCcw className="w-4 h-4 stroke-[3]" />
                    Restart
                  </button>
                  {/* <button
                                    onClick={() => setIsAnnouncementOpen(!isAnnouncementOpen)}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 focus:ring-4 focus:ring-indigo-200 outline-none"
                                >
                                    <MessageSquare className="w-4 h-4 stroke-[2.5]" />
                                    Send Announcement
                                </button> */}
                </div>

                {/* <button className="flex items-center gap-2 px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-bold shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 focus:ring-4 focus:ring-purple-200 outline-none">
                                <Download className="w-4 h-4 stroke-[2.5]" />
                                Export Data
                            </button> */}
              </div>

              {/* Expandable Announcement Section */}
              {isAnnouncementOpen && (
                <div className="mt-4 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 animate-in slide-in-from-top-2 duration-200">
                  <textarea
                    value={announcementMsg}
                    onChange={(e) => setAnnouncementMsg(e.target.value)}
                    placeholder="Type your announcement here..."
                    className="w-full p-4 rounded-xl border border-indigo-200/60 shadow-inner bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-28 mb-4 text-gray-800 placeholder-gray-400 font-medium"
                  />
                  <div className="flex justify-start">
                    <button
                      onClick={handleSendAnnouncement}
                      disabled={!announcementMsg.trim()}
                      className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-sm hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm"
                    >
                      <Send className="w-4 h-4 stroke-[2.5]" />
                      Send to All Participants
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Participants List Panel */}
          <div className="bg-white rounded-[1.5rem] p-6 md:p-8 shadow-sm border border-gray-100">
            {contestStatus === "completed" || finalResult.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-[#ECA468]" />
                    Final Results
                  </h2>
                </div>
                <div className="flex flex-col gap-4">
                  {finalResult
                    .sort((a, b) => (a.rank || 999) - (b.rank || 999))
                    .map((result, index) => (
                      <div
                        key={result.userId}
                        className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between hover:bg-white hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#FFF4EC] text-[#D0864B] flex items-center justify-center font-bold shadow-sm border border-[#FADDB8]/50">
                            {result.rank || index + 1}
                          </div>
                          <img
                            src={result.imageUrl}
                            className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
                            alt={result.name}
                          />
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{result.name}</p>
                            <p className="text-xs text-gray-500">{formatTime(result.timeTaken)}</p>
                          </div>
                        </div>
                        <div className="flex gap-6 text-right">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                              WPM
                            </span>
                            <span className="text-lg font-black text-[#D0864B] leading-none">{result.wpm}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                              Accuracy
                            </span>
                            <span className="text-lg font-bold text-emerald-500 leading-none">{result.accuracy}%</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                              Errors
                            </span>
                            <span className="text-lg font-bold text-red-500 leading-none">{result.errors}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                              Prize
                            </span>
                            <span className="text-lg font-bold text-purple-600 leading-none">
                              {contestDetails?.rewards?.find((r: any) => r.rank === result.rank)?.prize
                                ? `$${contestDetails.rewards.find((r: any) => r.rank === result.rank)?.prize}`
                                : "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  Participants{" "}
                  <span className="text-gray-500 text-lg font-bold tracking-tight">( {participants.length} )</span>
                </h2>

                {participants.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {participants.map((p, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 flex flex-col gap-4 hover:bg-white hover:shadow-sm transition-all"
                      >
                        <div className="grid grid-cols-4 gap-4 items-center">
                          <div>
                            <p className="font-bold text-gray-900 text-sm mb-2">{p.name || `Player ${idx + 1}`}</p>
                            <div className="flex flex-col">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                                WPM
                              </span>
                              <span className="text-xl font-black text-[#D0864B] leading-none">{p.wpm || "0"}</span>
                            </div>
                          </div>
                          <div>
                            <div className="flex flex-col mt-7">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                                Accuracy
                              </span>
                              <span className="text-lg font-bold text-emerald-500 leading-none">
                                {p.accuracy || "0"}%
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="flex flex-col mt-7">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                                Errors
                              </span>
                              <span className="text-lg font-bold text-red-500 leading-none">{p.errors || "0"}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex flex-col mt-7 items-end">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
                                Progress
                              </span>
                              <span className="text-lg font-bold text-purple-600 leading-none">
                                {p.progress || "0"}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div
                            className="bg-[#ECA468] h-1.5 rounded-full transition-all duration-300 relative"
                            style={{ width: `${p.progress || 0}%` }}
                          >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#ECA468] rounded-full shadow-sm"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                    <p className="font-medium text-gray-500">Waiting for live statistical updates...</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
            `}</style>
    </div>,
    document.body
  );
};

export default LiveMonitorModal;
