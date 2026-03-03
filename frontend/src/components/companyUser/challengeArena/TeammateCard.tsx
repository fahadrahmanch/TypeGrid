import React from 'react';
import { Target, Zap, Swords } from "lucide-react";
import { Teammate } from './types';

const TeammateCard = ({ teammate }: { teammate: Teammate }) => (
    <div className="bg-[#FAF3E0] rounded-2xl overflow-hidden shadow-sm border border-[#EBE3D5] flex flex-col relative group hover:shadow-md transition-all">
        {/* Top Banner */}
        <div className="h-24 bg-gradient-to-r from-[#5a483e] to-[#40332c] relative">
            {/* Status Badge */}
            <div className="absolute top-4 right-4 z-10">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${teammate.status === 'online' ? 'bg-[#1DCE6C] text-white' : 'bg-[#A8A2A0] text-white'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80 animate-pulse"></span>
                    {teammate.status === 'online' ? 'Online' : 'Offline'}
                </span>
            </div>
        </div>

        {/* Content body */}
        <div className="px-6 flex-1 flex flex-col pb-6 relative -mt-10">
            {/* Avatar */}
            <div className="mb-3">
                <img src={teammate.avatar} alt={teammate.name} className="w-20 h-20 rounded-2xl object-cover border-4 border-[#FAF3E0] shadow-sm bg-white" />
            </div>

            {/* Info */}
            <div className="mb-5">
                <h3 className="text-[17px] font-bold text-gray-900 mb-0.5">{teammate.name}</h3>
                <p className="text-sm font-medium text-indigo-500/80">{teammate.role}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6 flex-1">
                <div className="bg-white/60 rounded-xl p-3 flex flex-col justify-center">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 mb-1">
                        <Zap className="w-3.5 h-3.5" />
                        Avg WPM
                    </div>
                    <div className="text-2xl font-black text-indigo-600 tracking-tight">{teammate.avgWpm}</div>
                </div>
                <div className="bg-white/60 rounded-xl p-3 flex flex-col justify-center">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-500 mb-1">
                        <Target className="w-3.5 h-3.5" />
                        Accuracy
                    </div>
                    <div className="text-2xl font-black text-purple-600 tracking-tight flex items-baseline">
                        {teammate.accuracy}<span className="text-base font-bold ml-0.5">%</span>
                    </div>
                </div>
            </div>

            {/* Action */}
            <button
                disabled={teammate.status === 'offline'}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${teammate.status === 'online'
                    ? 'bg-[#B09D89] hover:bg-[#A3907C] text-white shadow-sm'
                    : 'bg-[#E5DFD3] text-[#A8A2A0] cursor-not-allowed'
                    }`}
            >
                <Swords className="w-4 h-4" />
                {teammate.status === 'online' ? 'Challenge' : 'Offline'}
            </button>
        </div>
    </div>
);

export default TeammateCard;
