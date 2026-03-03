import React, { useEffect, useState } from 'react';
import { ArrowLeft, Play, MessageSquare, Users, Send } from 'lucide-react';
import { updateContestStatus } from '../../../api/companyAdmin/companyContextAPI';
import { socket } from '../../../socket';

interface ContestLobbyModalProps {
    isOpen: boolean;
    onClose: () => void;
    contestId: string;
    contestTitle: string;
    onStartContest: () => void; // Callback to update parent state if needed
}

const ContestLobbyModal: React.FC<ContestLobbyModalProps> = ({ isOpen, onClose, contestId, contestTitle, onStartContest }) => {
    const [participantsList, setParticipantsList] = useState<Array<{ name: string; email: string }>>([]);
    const [isStarting, setIsStarting] = useState(false);
    const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);
    const [announcementMsg, setAnnouncementMsg] = useState('');
  useEffect(() => {
    if (!isOpen) return;

    socket.emit("admin-join-companyContest-lobby", {
        contestId
    });

    socket.on("lobby-users-update", (data) => {
        if (Array.isArray(data)) {
            setParticipantsList(data);
        }
    });

    return () => {
        socket.off("lobby-users-update");
    };
}, [isOpen, contestId]);
 
        const changeStatus = async (id: string) => {
            try {
                const response = await updateContestStatus(id, 'ongoing');
                const data = response.data;
                if (data.success) {
                 
                    socket.emit("contest-status-updated", {
                        contestId: id,
                        status: data.status
                    });
                }
                onClose()
    
            } catch (error) {
                console.log(error);
            }
        };
          

    const handleSendAnnouncement = () => {
        if (!announcementMsg.trim()) return;
        socket.emit("send-contest-announcement", {
            contestId: contestId,
            message: announcementMsg
        });
        setAnnouncementMsg('');
        setIsAnnouncementOpen(false);
    };
    
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F4F2EE]/80 backdrop-blur-sm animate-in fade-in duration-200 p-4 sm:p-8">
            <div className="bg-[#F8F7F4] w-full max-w-4xl h-full max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-200">

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
                    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm mb-6 flex justify-between items-center border border-gray-100">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Lobby Area</h1>
                            <p className="text-gray-500 font-medium">{contestTitle}</p>
                        </div>
                        {/* <div className="bg-yellow-100/80 text-yellow-700 px-4 py-1.5 rounded-full font-bold text-sm border border-yellow-200/50 shadow-sm">
                            {contestStatus}
                        </div> */}
                    </div>

                    {/* Action Buttons Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 flex flex-col gap-4 border border-gray-100">
                        <div className="flex flex-wrap gap-4 items-center">
                            <button
                                onClick={() => {
                                    changeStatus(contestId);
                                    setIsStarting(true);
                                  

                                }}
                                disabled={isStarting}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white shadow-sm transition-all focus:ring-4 focus:ring-emerald-200 outline-none
                                    ${isStarting ? 'bg-emerald-400 cursor-wait' : 'bg-emerald-500 hover:bg-emerald-600 hover:shadow-md hover:-translate-y-0.5'}`}
                            >
                                <Play className="w-5 h-5 fill-current" />
                                {isStarting ? "Starting..." : "Start Contest"}
                            </button>

                            <button
                                onClick={() => setIsAnnouncementOpen(!isAnnouncementOpen)}
                                className="flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 focus:ring-4 focus:ring-indigo-200 outline-none"
                            >
                                <MessageSquare className="w-5 h-5" />
                                Send Announcement
                            </button>
                        </div>

                        {isAnnouncementOpen && (
                            <div className="mt-2 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 animate-in slide-in-from-top-2 duration-200">
                                <textarea
                                    value={announcementMsg}
                                    onChange={(e) => setAnnouncementMsg(e.target.value)}
                                    placeholder="Write your announcement here..."
                                    className="w-full p-3 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none h-24 mb-3"
                                />
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setIsAnnouncementOpen(false)}
                                        className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSendAnnouncement}
                                        disabled={!announcementMsg.trim()}
                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <Send className="w-4 h-4" />
                                        Send
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Participants Card */}
                    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            Participants <span className="text-gray-500 text-lg">( {participantsList.length} )</span>
                        </h2>

                        {participantsList.length > 0 ? (
                            <div className="flex flex-col gap-3">
                                {participantsList.map((participant, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-[#F9F9F9] rounded-xl p-4 flex items-center justify-between border border-gray-50 hover:bg-gray-50 hover:border-gray-200 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shadow-inner">
                                                {participant.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-bold text-gray-800">{participant.name}</span>
                                        </div>
                                        <span className="text-sm text-gray-400 font-medium">{participant.email}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                                <Users className="w-12 h-12 text-gray-300 mb-3" />
                                <p className="font-medium text-gray-500">No participants have joined yet</p>
                                <p className="text-sm mt-1">They will appear here once they connect to the lobby</p>
                            </div>
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
        </div>
    );
};

export default ContestLobbyModal;
