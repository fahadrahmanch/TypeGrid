import React, { useEffect } from "react";
import CompanyUserNavbar from "../../components/companyUser/layout/companyUserNavbar";
import UserContestCard from "../../components/companyUser/contests/UserContestCard";
import { openContestApi, groupContestApi } from "../../api/companyUser/contests";
import { useState } from "react";
export interface RewardResponseDTO {
  rank: number;
  prize: number;
}

export interface ContestResponseDTO {
  _id: string;
  status: string;
  contestMode: "open" | "group";
  title: string;
  description: string;
  targetGroup?: string;
  difficulty: "easy" | "medium" | "hard";
  textSource: "random" | "custom";
  contestText?: string;
  startTime: string;
  participants: string[];
  date: string;
  duration: number;
  maxParticipants: number;
  joined: boolean;
  rewards: RewardResponseDTO[];
}
const Contests: React.FC = () => {
  const [openContests, setOpenContests] = useState<ContestResponseDTO[]>([]);
  const [groupContests, setGroupContests] = useState<ContestResponseDTO[]>([]);

  useEffect(() => {
    async function fetchGroupContestApi() {
      const openContests = await openContestApi();
      const data = openContests.data.data;
      setOpenContests(data);
    }
    fetchGroupContestApi();
  }, []);
  useEffect(() => {
    async function fetchGroupContestApi() {
      const groupContests = await groupContestApi();
      const data = groupContests.data.data;
      setGroupContests(data);
    }
    fetchGroupContestApi();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF8EA]">
      <CompanyUserNavbar />

      <main className="pt-20 md:pt-24 px-4 md:px-8 max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="flex items-start gap-4 mb-8 md:mb-10">
      
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-1 tracking-tight">Contests</h1>
            <p className="text-xs md:text-sm text-gray-500 font-bold uppercase tracking-widest opacity-70">
              Compete with others and prove your speed
            </p>
          </div>
        </div>

        {/* Group Contests Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
              <h2 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight">Group Events</h2>
            </div>
            <span className="bg-blue-50 text-blue-600 font-black px-3 py-1.5 rounded-xl text-[10px] md:text-xs uppercase tracking-widest border border-blue-100 shadow-sm">
              {groupContests.length} Active
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 px-1 md:px-0">
            {groupContests.length > 0 ? (
              groupContests.map((contest) => {
                const start = new Date(contest.startTime);
                return (
                  <UserContestCard
                    key={contest._id as string}
                    _id={contest._id as string}
                    title={contest.title}
                    description={contest.description}
                    status={contest.status}
                    participants={contest.participants}
                    maxParticipants={contest.maxParticipants}
                    duration={contest.duration}
                    joined={contest.joined}
                    difficulty={contest.difficulty}
                    startTime={contest.startTime}
                    reward={contest.rewards}
                    date={start.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                    isGroup={contest.contestMode === "group"}
                    actionLabel="Join Contest"
                  />
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center bg-white/50 rounded-[2rem] border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No active group contests</p>
              </div>
            )}
          </div>
        </section>

        {/* Open Contests Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
              <h2 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight">Public Arena</h2>
            </div>
            <span className="bg-emerald-50 text-emerald-600 font-black px-3 py-1.5 rounded-xl text-[10px] md:text-xs uppercase tracking-widest border border-emerald-100 shadow-sm">
              {openContests.length} Open
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 px-1 md:px-0">
            {openContests.length > 0 ? (
              openContests.map((contest) => {
                const start = new Date(contest.startTime);

                return (
                  <UserContestCard
                    key={contest._id as string}
                    _id={contest._id as string}
                    title={contest.title}
                    description={contest.description}
                    status={contest.status}
                    participants={contest.participants}
                    maxParticipants={contest.maxParticipants}
                    duration={contest.duration}
                    joined={contest.joined}
                    difficulty={contest.difficulty}
                    startTime={contest.startTime}
                    reward={contest.rewards}
                    date={start.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                    isGroup={contest.contestMode === "group"}
                    actionLabel="Join Contest"
                  />
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center bg-white/50 rounded-[2rem] border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No open contests available</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contests;
