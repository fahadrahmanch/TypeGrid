import  { useEffect, useState } from "react";
import {
  ChevronLeft,
  LayoutList,
  Send,
  Inbox,
  CheckCircle2,
} from "lucide-react";
import ChallengeCard from "./ChallengeCard";
import { getAllChallenges } from "../../../api/companyUser/challenge";
import { useMyChallengeSocket } from "../../../hooks/companyUser/useMyChallenges";
const MyChallenges = ({
    setView,
  challenges,
  setChallenges,
}: {
  setView: (v: "arena" | "my-challenges") => void;
  challenges: any[];
  setChallenges: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const [activeTab, setActiveTab] = useState<
    "all" | "sent" | "received" | "completed"
  >("sent");

  useEffect(() => {
    const getAllChallengesData = async () => {
      const response = await getAllChallenges();
      if (response.data.data) {
        const challenges = response.data.data;
        setChallenges(challenges);
      }

      // const data = await response.json();
      // return data;
    };
    getAllChallengesData();
  }, []);
  useMyChallengeSocket(setChallenges);
  const filteredChallenges = challenges.filter((challenge) => {
    if (activeTab === "all") return true;
    return challenge.type === activeTab;
  });

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <button
        onClick={() => setView("arena")}
        className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Challenge Arena
      </button>

      <div className="flex flex-col items-center justify-center text-center mb-10 cursor-default">
        <div className="w-full max-w-2xl relative py-4">
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-r from-transparent via-[#4A3d36] to-transparent opacity-30 rounded-full blur-xl pointer-events-none"></div>
          <h1 className="text-3xl font-black text-gray-900 relative z-10 tracking-tight">
            My Challenges
          </h1>
        </div>
        <p className="text-gray-500 font-medium mt-2">
          Track all your typing competitions in one place
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white/80 backdrop-blur-md border border-[#EBE3D5] rounded-2xl p-2 flex gap-2 shadow-sm mb-10 w-full">
        {/* <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeTab === "all" ? "bg-[#AD9B8E] text-white shadow-md" : "text-gray-600 hover:bg-gray-50"}`}
        >
          <LayoutList className="w-4 h-4" /> All Challenges
        </button> */}
        <button
          onClick={() => setActiveTab("sent")}
          className={`flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeTab === "sent" ? "bg-[#AD9B8E] text-white shadow-md" : "text-gray-600 hover:bg-gray-50"}`}
        >
          <Send className="w-4 h-4" /> Sent
        </button>
        <button
          onClick={() => setActiveTab("received")}
          className={`flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeTab === "received" ? "bg-[#AD9B8E] text-white shadow-md" : "text-gray-600 hover:bg-gray-50"}`}
        >
          <Inbox className="w-4 h-4" /> Received
        </button>
        {/* <button
          onClick={() => setActiveTab("completed")}
          className={`flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeTab === "completed" ? "bg-[#AD9B8E] text-white shadow-md" : "text-gray-600 hover:bg-gray-50"}`}
        >
          <CheckCircle2 className="w-4 h-4" /> Completed
        </button> */}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredChallenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
        {filteredChallenges.length === 0 && (
          <div className="col-span-1 md:col-span-2 text-center py-20 text-gray-500 font-medium">
            No challenges found in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyChallenges;
