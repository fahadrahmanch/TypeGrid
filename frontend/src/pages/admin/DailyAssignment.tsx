import { useState, useEffect } from "react";
import SideNavbar from "../../components/admin/layout/Navbar/SideNabar";
import StatCard from "../../components/admin/common/StatCard";
import { 
    createAssignChallenge, 
    fetchAssignChallenges,
    updateAssignChallenge,
    deleteAssignChallenge 
} from "../../api/admin/dailyAssignChallenges";
import DailyAssignmentModal from "../../components/admin/common/DailyAssignmentModal";
import CustomCalendar from "../../components/admin/common/CustomCalendar";
import { 
    Search, 
    Plus, 
    Trophy, 
    Users, 
    Target, 
    Clock, 
    Edit2,
    Trash2
} from "lucide-react";
import { fetchChallenges } from "../../api/admin/challenges";
import { toast } from "react-toastify";

const DailyAssignment = () => {
    const [searchText, setSearchText] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [currentEditId, setCurrentEditId] = useState<string | null>(null);
    const [challenges, setChallenges] = useState<any[]>([]);
    
    // Mock data for UI demonstration
    const stats = [
        { title: "Total Challenges", value: "2", subtitle: "1 active", icon: <Trophy className="w-4 h-4" /> },
        { title: "Total Attempts", value: "245", subtitle: "Across all challenges", icon: <Users className="w-4 h-4" /> },
        { title: "Completion Rate", value: "36%", subtitle: "Overall success rate", icon: <Target className="w-4 h-4" /> },
        { title: "Upcoming", value: "1", subtitle: "Scheduled challenges", icon: <Clock className="w-4 h-4" /> },
    ];

    const [assignChallenges, setAssignChallenges] = useState<any[]>([]);

    const [modalValues, setModalValues] = useState({
        date: selectedDate,
        challengeId: "",
    });

    useEffect(() => {
        loadChallenges();
    }, []);

    const loadChallenges = async () => {
        try {
            const response = await fetchChallenges("", "", 100, 1);
            if (response && response.data) {
                setChallenges(response.data.challenges || []);
            }
        } catch (err) {
            console.error("Error fetching challenges:", err);
            toast.error("Failed to load challenges for selection");
        }
    };
    useEffect(() => {
        const handler = setTimeout(() => {
            loadDailyAssignChallenges();
        }, 300);
        return () => clearTimeout(handler);
    }, [searchText, selectedDate]);

    const loadDailyAssignChallenges = async () => {
        try {
            const response = await fetchAssignChallenges(selectedDate, 10, 1);
            console.log(response.data);
            if (response.data) {
                setAssignChallenges(response.data.data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleModalChange = (name: string, value: any) => {
        setModalValues(prev => ({ ...prev, [name]: value }));
    };

    const handleOpenAddModal = () => {
        setModalMode("add");
        setModalValues({ date: selectedDate, challengeId: "" });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (assignment: any) => {
        setModalMode("edit");
        setCurrentEditId(assignment._id);
        setModalValues({ 
            date: assignment.date, 
            challengeId: assignment.challengeId?._id || assignment.challengeId, 
        });
        setIsModalOpen(true);
    };

    const handleModalSubmit = async () => {
        console.log("Submitting:", modalValues);
        try {
            if (modalMode === "add") {
                const response = await createAssignChallenge(modalValues);
                if (response.data) {
                    toast.success("Challenge assigned successfully");
                }else{
                    toast.error(response.data.message);
                }
            } else if (modalMode === "edit" && currentEditId) {
                const response = await updateAssignChallenge(currentEditId, modalValues);
                if (response.data) {
                    toast.success("Assignment updated successfully");
                }else{
                    toast.error(response.data.message);
                }
            }
            loadDailyAssignChallenges();
            setIsModalOpen(false);
        } catch (err: any) {
            console.error("Error submitting assignment:", err);
            toast.error(err.response?.data?.message || `Failed to ${modalMode} assignment`);
        }
    };

    const handleDeleteChallenge = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this assignment?")) return;
        
        try {
            await deleteAssignChallenge(id);
            toast.success("Assignment deleted successfully");
            loadDailyAssignChallenges();
        } catch (err: any) {
            console.error("Error deleting assignment:", err);
            toast.error(err.response?.data?.message || "Failed to delete assignment");
        }
    };
   
   

    return (
        <div className="md:ml-64 p-8 min-h-screen bg-[#FFF8EA] font-sans">
            <SideNavbar />

            <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header Section */}
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Daily Challenge Assignment</h1>
                    <p className="text-gray-500 font-medium tracking-tight">Manage and schedule daily challenges to keep your users engaged.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat, index) => (
                        <StatCard 
                            key={index}
                            title={stat.title}
                            value={stat.value}
                            subtitle={stat.subtitle}
                            icon={stat.icon}
                        />
                    ))}
                </div>

                {/* Search & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div className="relative flex-1 min-w-[300px] max-w-md flex gap-4">
                       
                        <CustomCalendar 
                            selectedDate={selectedDate}
                            onSelect={(date) => setSelectedDate(date)}
                        />
                    </div>

                    <button
                        onClick={handleOpenAddModal}
                        className="flex items-center gap-2 bg-[#ECA468] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#D0864B] transition-all shadow-lg shadow-[#ECA468]/20 hover:shadow-xl hover:-translate-y-0.5"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Assign Challenge</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Center Column: Assigned Challenges Table */}
                    <div className="col-span-1">
                        <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-8 shadow-sm border border-[#ECA468]/5 h-full min-h-[500px]">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="text-lg font-black text-gray-800">Scheduled Challenges</h3>
                                    <p className="text-[#D0864B] font-bold text-sm uppercase tracking-wide">
                                        All upcoming and current challenges
                                    </p>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100/50">
                                            <th className="pb-4 px-4">Challenge</th>
                                            <th className="pb-4 px-4">Date</th>
                                            <th className="pb-4 px-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50/50">
                                        {assignChallenges.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="py-32 text-center">
                                                    <div className="flex flex-col items-center opacity-30">
                                                        <Trophy className="w-12 h-12 mb-4 text-[#ECA468]" />
                                                        <p className="text-[10px] font-black text-[#D0864B] uppercase tracking-widest">No challenges assigned</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            assignChallenges.map((assign: any) => (
                                                <tr key={assign._id} className="group hover:bg-white/40 transition-all duration-300">
                                                    <td className="py-5 px-4">
                                                        <span className="text-sm font-black text-gray-800 group-hover:text-[#ECA468] transition-colors">{assign.challengeId?.title}</span>
                                                    </td>
                                                    <td className="py-5 px-4 font-bold text-gray-400 text-xs">{new Date(assign.date).toLocaleDateString()}</td>
                                                 
                                                    <td className="py-5 px-4 text-right">
                                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                            <button 
                                                                onClick={() => handleOpenEditModal(assign)}
                                                                className="p-2 text-gray-400 hover:text-[#ECA468] bg-white rounded-lg shadow-sm border border-gray-100 transition-all"
                                                            >
                                                                <Edit2 className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteChallenge(assign._id)}
                                                                className="p-2 text-red-300 hover:text-red-500 bg-white rounded-lg shadow-sm border border-gray-100 transition-all"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DailyAssignmentModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === "add" ? "Assign Challenge" : "Edit Assignment"}
                mode={modalMode}
                values={modalValues}
                challenges={challenges}
                onChange={handleModalChange}
                onSubmit={handleModalSubmit}
            />

        </div>
    );
};

export default DailyAssignment;