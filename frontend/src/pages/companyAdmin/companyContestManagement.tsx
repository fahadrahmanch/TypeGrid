import React, { useState } from "react";
import CompanyAdminSidebar from "../../components/companyAdmin/layout/CompanyAdminSideNavbar";
import ContestStatsCards from "../../components/companyAdmin/contest/ContestStatsCards";
import ContestCard, { ContestProps } from "../../components/companyAdmin/contest/ContestCard";
import CreateContestModal from "../../components/companyAdmin/contest/CreateContestModal";
import { Plus } from "lucide-react";

const dummyContests: ContestProps[] = [
    {
        id: "1",
        title: "Speed Typing Challenge",
        status: "Waiting",
        participants: 12,
        maxParticipants: 50,
        duration: 5,
        level: "Intermediate",
        targetWpm: 60,
        prize: "$500",
        date: "1/25/2024",
    },
    {
        id: "2",
        title: "Advanced Typing Masters",
        status: "Active",
        participants: 8,
        maxParticipants: 20,
        duration: 10,
        level: "Advanced",
        targetWpm: 80,
        prize: "$500",
        type: "Group",
    },
    {
        id: "3",
        title: "Speed Typing Challenge",
        status: "Upcoming",
        participants: 12,
        maxParticipants: 50,
        duration: 5,
        level: "Intermediate",
        targetWpm: 60,
        prize: "$500",
    },
    {
        id: "4",
        title: "Speed Typing Challenge",
        status: "Completed",
        participants: 50,
        maxParticipants: 50,
        duration: 5,
        level: "Intermediate",
        targetWpm: 60,
        prize: "$500",
    },
];

const CompanyContestManagement: React.FC = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#FFF8EA]">
            {/* Fixed Sidebar */}
            <CompanyAdminSidebar />

            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">
                                Contest Management
                            </h1>
                            <p className="text-gray-500">
                                Create, monitor, and manage typing contests
                            </p>
                        </div>

                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                        >
                            <Plus className="w-5 h-5" />
                            Create Contest
                        </button>
                    </div>

                    {/* Stats Section */}
                    <ContestStatsCards />

                    {/* Filters/Tabs could go here (e.g. All, Active, Completed) */}

                    {/* Contest Cards List */}
                    <div className="flex flex-col gap-6">
                        {dummyContests.map((contest) => (
                            <ContestCard key={contest.id} {...contest} />
                        ))}
                    </div>
                </div>

                {/* Create Contest Modal */}
                <CreateContestModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                />
            </main>
        </div>
    );
};

export default CompanyContestManagement;
