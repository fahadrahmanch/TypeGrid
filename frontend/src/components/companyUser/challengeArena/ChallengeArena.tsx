import { useEffect, useState } from "react";
import { Target, Swords, Search } from "lucide-react";
import TeammateCard from "./TeammateCard";
import { Teammate } from "../../../types/challenge";
import { companyUsers } from "../../../api/companyUser/challenge";
import { useSelector } from "react-redux";
import { checkalreadySendChallenge } from "../../../api/companyUser/challenge";
const ChallengeArena = ({
  setView,
}: {
  setView: (v: "arena" | "my-challenges") => void;
}) => {
  const [users, setUsers] = useState<Teammate[]>([]);
  const [challengeStatuses, setChallengeStatuses] = useState<
    Record<string, string>
  >({});
  const [searchText, setSearchText] = useState("");

  const companyUser = useSelector((state: any) => state.auth.user);
  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, challengesRes] = await Promise.all([
          companyUsers(searchText),
          checkalreadySendChallenge(),
        ]);

        if (usersRes.data.data) setUsers(usersRes.data.data);

        if (challengesRes.data.data) {
          const statusMap: Record<string, string> = {};
          challengesRes.data.data.forEach((challenge: any) => {
            statusMap[challenge.receiverId] = challenge.status;
          });
          setChallengeStatuses(statusMap);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [searchText]);
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Area */}
      <div className="flex flex-col items-center justify-center text-center mb-10 pt-4 cursor-default">
        <div className="bg-[#B09D89] text-white px-4 py-1.5 rounded-full text-xs font-bold mb-6 flex items-center gap-2 shadow-sm">
          <Target className="w-3.5 h-3.5" />
          Company Challenge Arena
        </div>

        <div className="w-full relative py-6">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#AD9B8E] to-transparent opacity-80 blur-sm pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#AD9B8E] to-transparent pointer-events-none"></div>
          <h1 className="text-4xl font-black text-gray-900 relative z-10 tracking-tight">
            Challenge Your Teammates
          </h1>
        </div>

        <p className="text-gray-500 font-medium mt-4 mb-8">
          Compete with colleagues and track your typing performance
        </p>

        <button
          onClick={() => setView("my-challenges")}
          className="flex items-center gap-2 text-sm font-bold text-gray-900 hover:text-indigo-600 transition-colors"
        >
          <Swords className="w-4 h-4" />
          View My Challenges
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 flex gap-4 shadow-sm border border-[#EBE3D5] mb-10 sticky top-24 z-20">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            onChange={(e) => setSearchText(e.target.value)}
            type="text"
            placeholder="Search by name..."
            className="w-full bg-[#FAF5EC] border border-[#EBE3D5] rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B09D89]/50 transition-all font-medium placeholder:text-gray-400 text-gray-700"
          />
        </div>
        {/* <div className="w-56 relative group">
          <select className="w-full bg-[#FAF5EC] border border-[#EBE3D5] rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B09D89]/50 appearance-none font-semibold text-gray-700 cursor-pointer">
            <option>All Designations</option>
            <option>Senior Developer</option>
            <option>Junior Developer</option>
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <div className="w-56 relative group">
          <select className="w-full bg-[#FAF5EC] border border-[#EBE3D5] rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#B09D89]/50 appearance-none font-semibold text-gray-700 cursor-pointer">
            <option>All Skill Levels</option>
            <option>Beginner (Below 60 WPM)</option>
            <option>Pro (Above 90 WPM)</option>
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div> */}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {users
          .filter((user) => user._id !== companyUser?._id)
          .map((user) => (
            <TeammateCard
              key={user._id}
              teammate={user}
              challengeStatus={challengeStatuses[user._id]}
              onStatusChange={(id, status) =>
                setChallengeStatuses((prev) => ({ ...prev, [id]: status }))
              }
              onViewChallenges={() => setView("my-challenges")}
            />
          ))}
      </div>
    </div>
  );
};

export default ChallengeArena;
