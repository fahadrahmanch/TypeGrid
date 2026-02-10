import React, { useState } from "react";
import CompanyAdminSidebar from "../../components/companyAdmin/layout/CompanyAdminSideNavbar";
import { ArrowLeft, Plus, ChevronUp } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import AddUsersModal from "../../components/companyAdmin/groups/AddUsersModal";

// Dummy members
const dummyMembers = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", wpm: 45, accuracy: 92, streak: 5, lastActive: "2024-01-15" },
    { id: 2, name: "David Brown", email: "david@example.com", wpm: 40, accuracy: 88, streak: 0, lastActive: "2024-01-01" },
];

const GroupDetails: React.FC = () => {
    const { groupId } = useParams();
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#FFF8EA]">
            <CompanyAdminSidebar />
            <div className="flex-1 ml-64 p-8">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Back & Header */}
                    <div className="space-y-6">
                        <Link
                            to="/company/admin/groups"
                            className="inline-flex items-center text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Groups
                        </Link>

                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">Starter Squad <span className="text-gray-400 font-normal text-lg">#{groupId}</span></h1>
                                <p className="text-gray-500">Beginner Users</p>
                            </div>
                            <button
                                onClick={() => setIsAddUserModalOpen(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                Add Users
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-sm font-semibold text-gray-500 mb-1">Total Users</p>
                            <div className="text-3xl font-bold text-gray-900">2</div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-sm font-semibold text-gray-500 mb-1">Average WPM</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-gray-900">42.5</span>
                                <span className="text-green-500"><ChevronUp className="w-5 h-5" /></span>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-sm font-semibold text-gray-500 mb-1">Average Accuracy</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-gray-900">90.0%</span>
                                <span className="text-green-500"><ChevronUp className="w-5 h-5" /></span>
                            </div>
                        </div>
                    </div>

                    {/* Members Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900">Group Members</h2>
                        </div>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">WPM</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Accuracy</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Streak</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Active</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {dummyMembers.map(member => (
                                    <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-gray-900 text-sm">{member.name}</td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{member.email}</td>
                                        <td className="px-6 py-4 text-gray-600 font-medium text-sm">{member.wpm}</td>
                                        <td className="px-6 py-4 text-gray-600 font-medium text-sm">{member.accuracy} %</td>
                                        <td className="px-6 py-4 text-gray-600 font-medium text-sm">{member.streak} days</td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{member.lastActive}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-xs font-semibold text-red-500 hover:text-red-700 hover:underline">
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add User Modal */}
                <AddUsersModal
                    isOpen={isAddUserModalOpen}
                    onClose={() => setIsAddUserModalOpen(false)}
                />
            </div>
        </div>
    );
};

export default GroupDetails;
