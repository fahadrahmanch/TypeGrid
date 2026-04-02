import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Trophy, AlertCircle, Medal } from "lucide-react";
import { fetchContestResults } from "../../../api/companyAdmin/companyContextAPI";
import { ContestResult } from "../../../types/contest";

interface Reward {
  rank: number;
  prize: string | number;
}

interface ContestResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contestId: string;
  rewards: Reward[];
}

const ContestResultsModal: React.FC<ContestResultsModalProps> = ({
  isOpen,
  onClose,
  contestId,
  rewards,
}) => {
  const [results, setResults] = useState<ContestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const getResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchContestResults(contestId);
        const data = response.data.data;
        setResults(data);
      } catch (_err: any) {
        setError("An error occurred while fetching results.");
      } finally {
        setIsLoading(false);
      }
    };

    getResults();
  }, [isOpen, contestId]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const getPrizeForRank = (rank: number) => {
    const reward = rewards.find((r) => r.rank === rank);
    return reward ? reward.prize : null;
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center font-bold shadow-sm border border-yellow-200">
            <Trophy className="w-4 h-4" />
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold shadow-sm border border-gray-300">
            <Medal className="w-4 h-4" />
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold shadow-sm border border-amber-200">
            <Medal className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-orange-50 text-[#D0864B] flex items-center justify-center font-bold shadow-sm border border-orange-100 text-sm">
            {rank}
          </div>
        );
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FDFBF7]/90 backdrop-blur-sm animate-in fade-in duration-200 p-2 sm:p-4">
      <div className="bg-white w-full max-w-7xl max-h-[98vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl relative animate-in zoom-in-95 duration-200 border border-[#ECA468]/10 text-slate-800">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#FFF4EC] text-[#D0864B] rounded-xl border border-[#FADDB8]/50">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                Contest Results
              </h2>
              <p className="text-sm text-gray-500 font-medium">
                Final rankings and performance stats
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-gray-400 hover:text-gray-700 hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#FDFBF7]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-[#FADDB8] border-t-[#ECA468] rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 font-medium animate-pulse">
                Loading results...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">Oops!</h3>
              <p className="text-gray-500">{error}</p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
              <Trophy className="w-12 h-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                No Results Available
              </h3>
              <p className="text-gray-500 text-sm">
                It looks like no one participated or the results are not ready
                yet.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Header Row */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-white rounded-xl border border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 shadow-sm">
                <div className="col-span-1 text-center">Rank</div>
                <div className="col-span-4">Player</div>
                <div className="col-span-2 text-center">Speed</div>
                <div className="col-span-2 text-center">Accuracy</div>
                <div className="col-span-3 text-right">Reward</div>
              </div>

              {/* Data Rows */}
              {results.map((result, index) => {
                const rank = result.rank || index + 1;
                const prize = getPrizeForRank(rank);
                const isTop3 = rank <= 3;

                return (
                  <div
                    key={result.userId || index}
                    className={`grid grid-cols-12 gap-4 px-6 py-4 rounded-xl border items-center transition-all duration-200 hover:shadow-md
                      ${isTop3 ? "bg-white border-[#FADDB8] shadow-sm" : "bg-gray-50/50 border-gray-100 hover:bg-white"}`}
                  >
                    {/* Rank */}
                    <div className="col-span-1 flex justify-center">
                      {getRankBadge(rank)}
                    </div>

                    {/* Player Info */}
                    <div className="col-span-4 flex items-center gap-3">
                      {result.imageUrl ? (
                        <img
                          src={result.imageUrl}
                          alt={result.name}
                          className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#FFF4EC] text-[#D0864B] flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">
                          {result.name?.charAt(0) || "?"}
                        </div>
                      )}
                      <div>
                        <p
                          className={`font-bold text-sm ${isTop3 ? "text-gray-900" : "text-gray-700"}`}
                        >
                          {result.name || "Unknown Player"}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                          Time: {formatTime(result.time)} • {result.errors}{" "}
                          Errors
                        </p>
                      </div>
                    </div>

                    {/* WPM */}
                    <div className="col-span-2 flex flex-col items-center justify-center">
                      <span
                        className={`text-xl font-black ${isTop3 ? "text-[#D0864B]" : "text-gray-900"} leading-none mb-0.5`}
                      >
                        {result.wpm}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        WPM
                      </span>
                    </div>

                    {/* Accuracy */}
                    <div className="col-span-2 flex flex-col items-center justify-center">
                      <span
                        className={`text-lg font-bold ${isTop3 ? "text-emerald-500" : "text-gray-700"} leading-none mb-0.5`}
                      >
                        {result.accuracy || 0}%
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        Acc
                      </span>
                    </div>

                    {/* Reward */}
                    <div className="col-span-3 flex justify-end items-center">
                      {result.prize || prize ? (
                        <div
                          className={`px-3 py-1.5 rounded-lg font-bold text-sm flex items-center gap-1.5 whitespace-nowrap
                          ${
                            rank === 1
                              ? "bg-yellow-50 text-yellow-700 border border-yellow-200 shadow-sm"
                              : rank === 2
                                ? "bg-gray-100 text-gray-700 border border-gray-200"
                                : rank === 3
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-green-50 text-green-700 border border-green-200"
                          }`}
                        >
                          <span className="opacity-80">🏆</span>{" "}
                          {result.prize || prize}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm font-medium">
                          -
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
      `}</style>
    </div>,
    document.body,
  );
};

export default ContestResultsModal;
