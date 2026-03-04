import React, { useEffect, useState } from 'react';
import { BaseChallenge, CompletedChallenge } from './types';
import { CheckCircle2, Clock, Zap, Target, Swords } from "lucide-react";
import { challengeAccept } from '../../../api/companyUser/challenge';
import { socket } from '../../../socket';
import { useNavigate } from 'react-router-dom';
const ChallengeCard = ({ challenge }: { challenge: BaseChallenge | CompletedChallenge }) => {
    const [hasJoined, setHasJoined] = useState(false);
    const [localAccepted, setLocalAccepted] = useState(false);
    const navigate = useNavigate();
    // Determine card styling based on status
    const isCompleted = challenge.status === 'completed';
    const isSent = challenge.type === 'sent';
    const isReceived = challenge.type === 'received';
    const isAccepted = challenge.status === 'accepted' || localAccepted;
    const isPending = challenge.status === 'pending' && !localAccepted;
    const isWaiting = challenge.status === 'waiting' && !localAccepted;

    let statusStyle = '';
    let statusIcon = null;
    let statusText: string = localAccepted ? 'accepted' : challenge.status;

    if (isCompleted) {
        statusStyle = 'bg-blue-50 text-blue-700 border-blue-200';
        statusIcon = <CheckCircle2 className="w-3.5 h-3.5" />;
        statusText = 'Completed';
    } else if (isPending) {
        statusStyle = 'bg-yellow-50 text-yellow-700 border-yellow-200';
        statusIcon = <Clock className="w-3.5 h-3.5" />;
        statusText = 'Pending';
    } else if (isAccepted) {
        statusStyle = 'bg-green-50 text-green-700 border-green-200';
        statusIcon = <CheckCircle2 className="w-3.5 h-3.5" />;
        statusText = 'Accepted';
    } else if (isWaiting) {
        statusStyle = 'bg-blue-50 text-indigo-600 border-indigo-200';
        statusIcon = <Clock className="w-3.5 h-3.5" />;
        statusText = 'Waiting to Join';
    }
    async function handleAccept(challengeId: string, senderId: string) {
        try {

            const response = await challengeAccept(challengeId)

            if (response?.data?.success) {

                setHasJoined(false)
                setLocalAccepted(true)


                socket.emit("challenge-accepted", {
                    challengeId,
                    senderId
                })

            }

        } catch (error) {
            console.error("Error accepting challenge:", error)
        }
    }
    async function handleJoinmatch(challengeId: string) {
        try {

            setHasJoined(true)

            socket.emit("join-challenge-match", {
                challengeId
            })

        } catch (error) {
            console.error("Error joining match:", error)
        }

    }
    useEffect(() => {

        socket.on("start-match", ({ challengeId }) => {

            navigate(`/challenge/${challengeId}`)

        })

        return () => { socket.off("start-match"); };

    }, [])

    return (
        <div className={`bg-[#FAF3E0] rounded-2xl p-6 shadow-sm border flex flex-col transition-all hover:shadow-md ${isAccepted ? 'border-green-300 border-l-4 border-l-green-400' : isWaiting ? 'border-indigo-200 border-l-4 border-l-indigo-400' : isPending && isSent ? 'border-[#EBE3D5] border-l-4 border-l-yellow-400' : 'border-[#EBE3D5]'}`}>

            {/* Header: User Info & Badge */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4 items-center">
                    <img src={challenge.opponent.avatar} alt={challenge.opponent.name} className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-sm" />
                    <div>
                        <h3 className="font-bold text-gray-900 leading-tight">{challenge.opponent.name}</h3>
                        <p className="text-xs font-medium text-indigo-500">{challenge.opponent.role}</p>
                    </div>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${statusStyle}`}>
                    {statusIcon} <span className="capitalize">{statusText}</span>
                </div>
            </div>

            {/* Middle: Details Row */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white/60 rounded-xl py-3 px-2 flex flex-col items-center justify-center text-center">
                    <Zap className="w-4 h-4 text-indigo-500 mb-1" />
                    <span className="text-[11px] font-bold text-gray-500 mb-0.5">Difficulty</span>
                    <span className="text-sm font-bold text-indigo-600 capitalize">{challenge.difficulty}</span>
                </div>
                <div className="bg-white/60 rounded-xl py-3 px-2 flex flex-col items-center justify-center text-center">
                    <Clock className="w-4 h-4 text-purple-500 mb-1" />
                    <span className="text-[11px] font-bold text-gray-500 mb-0.5">Duration</span>
                    <span className="text-sm font-black text-purple-600 leading-none">{(challenge.durationSeconds / 60)} <span className="text-[10px]">m</span></span>
                </div>
                <div className="bg-white/60 rounded-xl py-3 px-2 flex flex-col items-center justify-center text-center">
                    <Target className="w-4 h-4 text-pink-500 mb-1" />
                    <span className="text-[11px] font-bold text-gray-500 mb-0.5">Type</span>
                    <span className="text-sm font-bold text-pink-600 capitalize">{challenge.type}</span>
                </div>
            </div>

            {/* Bottom: Result / Actions */}
            {isCompleted ? (
                <div className="mt-auto">
                    <div className="bg-[#E5DFD3]/50 rounded-xl p-4 mb-4">
                        <div className="flex justify-between items-center mb-3 text-sm">
                            <span className="font-bold text-gray-600">Result</span>
                            <span className={`font-black ${(challenge as CompletedChallenge).result === 'won' ? 'text-green-600' : 'text-red-500'}`}>
                                🏆 You {(challenge as CompletedChallenge).result === 'won' ? 'Won!' : 'Lost'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                            <div className="flex items-center gap-2"><span className="text-gray-500 font-medium">Your WPM:</span> <span className="text-gray-900">{(challenge as CompletedChallenge).yourWpm}</span></div>
                            <div className="flex items-center gap-2"><span className="text-gray-500 font-medium">Their WPM:</span> <span className="text-gray-900">{(challenge as CompletedChallenge).theirWpm}</span></div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex-1 py-2.5 bg-[#1DCE6C] hover:bg-[#1ab860] text-white rounded-xl font-bold text-sm transition-colors shadow-sm">
                            Rematch
                        </button>
                        <button className="flex-1 py-2.5 bg-[#E5DFD3] hover:bg-[#d8d2c6] text-gray-700 rounded-xl font-bold text-sm transition-colors">
                            View Details
                        </button>
                    </div>
                </div>
            ) : isAccepted ? (
                <div className="mt-auto">
                    {hasJoined ? (
                        <div className="text-center text-sm font-bold text-indigo-600/80 mb-4 bg-indigo-50 py-2 rounded-lg">
                            Waiting for opponent to join...
                        </div>
                    ) : (
                        <button
                            onClick={() => handleJoinmatch(challenge.id)}
                            className="w-full py-3 bg-[#1DCE6C] hover:bg-[#1ab860] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                        >
                            <Swords className="w-4 h-4" /> Join Match
                        </button>
                    )}
                </div>
            ) : isPending && isReceived ? (
                <div className="mt-auto flex gap-3">
                    <button className="flex-1 py-3 bg-white border-2 border-[#EBE3D5] text-gray-600 hover:bg-gray-50 rounded-xl font-bold text-sm transition-colors">
                        Decline
                    </button >
                    <button
                        onClick={() => handleAccept(challenge.id, challenge.senderId)}
                        className="flex-1 py-3 bg-[#1DCE6C] hover:bg-[#1ab860] text-white rounded-xl font-bold text-sm transition-colors shadow-sm">
                        Accept
                    </button>
                </div>
            ) : null}

        </div>
    );
};

export default ChallengeCard;
