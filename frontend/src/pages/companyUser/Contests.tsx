import React, { useEffect } from "react";
import CompanyUserNavbar from "../../components/companyUser/layout/companyUserNavbar";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserContestCard, { UserContestCardProps } from "../../components/companyUser/contests/UserContestCard";
import { openContestApi } from "../../api/companyUser/contests";
import { useState } from "react";
import { groupContestApi } from "../../api/companyUser/contests";
export interface RewardResponseDTO {
  rank: number;
  prize: number;
}

export interface ContestResponseDTO {
  _id: string;
  status:string;
  contestMode: "open" | "group";
  title: string;
  description: string;
  targetGroup?: string;
  difficulty: "easy" | "medium" | "hard";
  textSource: "random" | "custom";
  contestText?: string;
  startTime:string;
  date: string;
  duration: number;
  maxParticipants: number;
  joined:boolean;
  rewards: RewardResponseDTO[];
}
const Contests: React.FC = () => {
    const navigate = useNavigate();
    const [openContests,setOpenContests]=useState<ContestResponseDTO[]>([]);
    const [groupContests,setGroupContests]=useState<ContestResponseDTO[]>([]);
    // const groupContests: UserContestCardProps[] = [
    //     {
    //         id: "1",
    //         title: "Company Sprint Challenge",
    //         status: "Upcoming",
    //         participants: 12,
    //         maxParticipants: 30,
    //         duration: 15,
    //         startTime:"",
    //         level: "Hard",
    //         date: "Oct 29, 07:27 AM",
    //         isGroup: true,
    //         prize: "$500",
    //         tags: [{ label: "Intermediate", color: "bg-gray-400 text-white" }],
    //         actionLabel: "Join Contest"
    //     },
    //     {
    //         id: "2",
    //         title: "Company Sprint Challenge",
    //         status: "Waiting",
    //         participants: 12,
    //         startTime:"",
    //         maxParticipants: 30,
    //         duration: 15,
    //         level: "Hard",
    //         date: "Oct 29, 07:27 AM",
    //         isGroup: true,
    //         tags: [{ label: "beginner", color: "bg-gray-400 text-white" }],
    //         actionLabel: "Join Lobby"
    //     }
    // ];

    // const openContests: UserContestCardProps[] = [
    //     {
    //         id: "3",
    //         title: "Speed Typing Championship",
    //         description: "Test your typing speed against the best!",
    //         status: "Waiting", // Assuming it's waiting/active based on screenshot having "Join Contest"
    //         participants: 0,
    //         maxParticipants: 50,
    //         duration: 10,
    //         level: "Medium",
    //         date: "Oct 29, 06:27 AM",
    //         isGroup: false,
    //         actionLabel: "Join Contest"
    //     }
    // ];


    useEffect(()=>{
        async function fetchGroupContestApi(){
            const openContests=await openContestApi();
            const data=openContests.data.data;
            setOpenContests(data);
        }
        fetchGroupContestApi();

    },[]);
    useEffect(()=>{
        async function fetchGroupContestApi(){
            const groupContests=await groupContestApi();
            const data=groupContests.data.data;
            setGroupContests(data);
          
        }
        fetchGroupContestApi();

    },[]);

    return (
        <div className="min-h-screen bg-[#FFF8EA]">
            <CompanyUserNavbar />

            <main className="pt-24 px-8 max-w-7xl mx-auto pb-12">

                {/* Header */}
                <div className="flex items-start gap-4 mb-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">Available Contests</h1>
                        <p className="text-gray-500">Join a contest and compete with others</p>
                    </div>
                </div>

                {/* Group Contests Section */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Group Contests</h2>
                        <span className="bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-lg text-sm">
                            {groupContests.length} Available
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groupContests.length>0 && groupContests.map(contest =>{
                              const start = new Date(contest.startTime);
                            return(
                                <UserContestCard
      key={contest._id as string}
      _id={contest._id as string}
      title={contest.title}
      description={contest.description}
      status={contest.status}
      participants={[]}
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
                        })}
                    </div>
                </section>

                {/* Open Contests Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Open Contests</h2>
                        <span className="bg-emerald-100 text-emerald-700 font-semibold px-3 py-1 rounded-lg text-sm">
                            {openContests.length} Available
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {openContests.map((contest) => {
  const start = new Date(contest.startTime);

  return (
    <UserContestCard
      key={contest._id as string}
      _id={contest._id as string}
      title={contest.title}
      description={contest.description}
      status={contest.status}
      participants={[]}
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
})}
                    </div>
                </section>

            </main>
        </div>
    );
};

export default Contests;