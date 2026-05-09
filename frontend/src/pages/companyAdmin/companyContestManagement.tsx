import React, { useState, useEffect } from "react";
import CompanyAdminSidebar from "../../components/companyAdmin/layout/CompanyAdminSideNavbar";
import ContestCard from "../../components/companyAdmin/contest/ContestCard";
import { ContestProps } from "../../types/contest";
import CreateContestModal from "../../components/companyAdmin/contest/CreateContestModal";
import { Plus } from "lucide-react";
import { companyContests } from "../../api/companyAdmin/companyContextAPI";
import { socket } from "../../socket";
const CompanyContestManagement: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [contests, setContests] = useState<ContestProps[]>([]);

  const fetchContests = async () => {
    const response = await companyContests();
    const data = response.data.data;
    console.log(data);
    setContests(data);
  };
  useEffect(() => {
    fetchContests();
  }, []);

  useEffect(() => {
    socket.emit("company-admin-contest");
  }, []);

  useEffect(() => {
    socket.on("contest-updated-admin", ({ contestId, status }) => {
      if (!status) return;
      setContests((prev) => prev.map((contest) => (contest._id === contestId ? { ...contest, status } : contest)));
    });
    return () => {
      socket.off("contest-updated-admin");
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-[#FFF8EA]">
      {/* Fixed Sidebar */}
      <CompanyAdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 overflow-y-auto pt-24 md:pt-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-10 px-2">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-1">Contest Management</h1>
              <p className="text-xs md:text-base text-gray-500 font-medium">Create, monitor, and manage typing contests</p>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#ECA468] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-[#ECA468]/20 hover:bg-[#D0864B] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 uppercase text-[10px] md:text-xs tracking-widest"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              Create Contest
            </button>
          </div>

          {/* Stats Section */}
          {/* <ContestStatsCards /> */}

          {/* Filters/Tabs could go here (e.g. All, Active, Completed) */}

          {/* Contest Cards List */}
          <div className="flex flex-col gap-6">
            {contests.map((contest: any) => (
              <ContestCard
                key={contest._id}
                title={contest.title}
                status={contest.status}
                participants={contest.participants}
                maxParticipants={contest.maxParticipants}
                duration={contest.duration}
                level={contest.difficulty}
                targetWpm={contest.targetWpm}
                prize={contest.prize}
                rewards={contest.rewards}
                startTime={contest.startTime}
                id={contest._id}
                type={contest.contestMode}
                setContests={setContests}
                fetchContests={fetchContests}
              />
            ))}
          </div>
        </div>

        {/* Create Contest Modal */}
        <CreateContestModal
          isOpen={isCreateModalOpen}
          fetchContests={fetchContests}
          onClose={() => setIsCreateModalOpen(false)}
          setContests={setContests}
        />
      </main>
    </div>
  );
};

export default CompanyContestManagement;
