import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {  } from "lucide-react";
import SideNavbar from "../../components/admin/layout/Navbar/SideNabar";
// import StatCard from "../../components/common/StatCard";
import {
  createAssignChallenge,
  fetchAssignChallenges,
  updateAssignChallenge,
  deleteAssignChallenge,
} from "../../api/admin/dailyAssignChallenges";
import DailyAssignmentModal from "../../components/common/DailyAssignmentModal";
import CustomCalendar from "../../components/common/CustomCalendar";
import { Plus, Edit2, Trash2,Calendar } from "lucide-react";
import ReusableTable from "../../components/common/ReusableTable";
import { fetchChallenges } from "../../api/admin/challenges";
import { toast } from "react-toastify";

const DailyAssignment = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [challenges, setChallenges] = useState<any[]>([]);


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
      const response = await fetchChallenges("", 100, 1);
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
  }, [selectedDate]);

  const loadDailyAssignChallenges = async () => {
    try {
      const response = await fetchAssignChallenges(selectedDate, 10, 1);
      if (response.data) {
        setAssignChallenges(response.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleModalChange = (name: string, value: any) => {
    setModalValues((prev) => ({ ...prev, [name]: value }));
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
    try {
      if (modalMode === "add") {
        const response = await createAssignChallenge(modalValues);
        if (response.data) {
          toast.success("Challenge assigned successfully");
        } else {
          toast.error(response.data.message);
        }
      } else if (modalMode === "edit" && currentEditId) {
        const response = await updateAssignChallenge(currentEditId, modalValues);
        if (response.data) {
          toast.success("Assignment updated successfully");
        } else {
          toast.error(response.data.message);
        }
      }
      loadDailyAssignChallenges();
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to ${modalMode} assignment`);
    }
  };

  const handleDeleteChallenge = (id: string) => {
    setAssignmentToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteAssignment = async () => {
    if (!assignmentToDelete) return;

    try {
      await deleteAssignChallenge(assignmentToDelete);
      toast.success("Assignment deleted successfully");
      loadDailyAssignChallenges();
      setIsDeleteModalOpen(false);
      setAssignmentToDelete(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete assignment");
    }
  };

  return (
    <div className="md:ml-64 p-4 md:p-8 min-h-screen bg-[#FFF8EA] font-sans pt-24 md:pt-8">
      <SideNavbar />

      <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Section */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-1 md:mb-2">Daily Assignment</h1>
          <p className="text-xs md:text-sm text-gray-500 font-medium tracking-tight">
            Schedule challenges to keep users engaged and competitive.
          </p>
        </div>

        {/* Search & Actions */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6 md:mb-8">
          <div className="w-full md:max-w-md">
            <CustomCalendar selectedDate={selectedDate} onSelect={(date) => setSelectedDate(date)} />
          </div>

          <button
            onClick={handleOpenAddModal}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#ECA468] text-white px-6 py-3.5 md:py-3 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-[#D0864B] transition-all shadow-lg shadow-[#ECA468]/20 hover:shadow-xl hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Assign Challenge</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Assigned Challenges Section */}
          <div className="bg-[#fff8ea]/60 backdrop-blur-xl rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 shadow-sm border border-[#ECA468]/10 h-full min-h-[500px]">
            <div className="flex justify-between items-center mb-6 md:mb-8 px-1 md:px-2">
              <div>
                <h3 className="text-lg md:text-xl font-black text-gray-800">Scheduled challenges</h3>
                <p className="text-[10px] text-[#D0864B] font-bold uppercase tracking-wide mt-1">
                  Upcoming and current assignments
                </p>
              </div>
            </div>

            {/* Scheduled Challenges Table */}
            <div className="overflow-x-auto">
              <ReusableTable
                columns={[
                  {
                    header: "Challenge",
                    key: "challengeId.title",
                    render: (assign) => (
                      <span className="flex items-center gap-2 text-sm font-black text-gray-800 group-hover:text-[#ECA468] transition-colors whitespace-nowrap">
                        {assign.challengeId?.title}
                      </span>
                    ),
                  },
                  {
                    header: "Date",
                    key: "date",
                    className: "font-bold text-gray-400 text-xs whitespace-nowrap",
                    render: (assign) => (
                      <div className="flex items-center gap-2 text-sm font-black text-gray-800 group-hover:text-[#ECA468] transition-colors">
                        <Calendar className="w-3 h-3 text-[#D0864B]" /> {new Date(assign.date).toLocaleDateString()}
                      </div>
                    ),
                  },
                  {
                    header: "Actions",
                    key: "actions",
                    headerClassName: "text-right",
                    className: "text-right whitespace-nowrap",
                    render: (assign) => (
                      <div className="flex justify-end gap-2 md:translate-x-2 md:opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                        <button
                          onClick={() => handleOpenEditModal(assign)}
                          className="p-2 text-gray-400 hover:text-[#ECA468] bg-white rounded-lg shadow-sm border border-gray-50 hover:border-[#FADDB8] transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteChallenge(assign._id)}
                          className="p-2 text-gray-400 hover:text-red-500 bg-white rounded-lg shadow-sm border border-gray-50 hover:border-red-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ),
                  },
                ]}
                data={assignChallenges}
                emptyMessage="No challenges assigned"
                headerClassName="bg-[#FFF8EA] text-left"
                columnHeaderClassName="py-4 px-6 text-[10px] font-black text-[#D0864B] uppercase tracking-widest border-b border-[#ECA468]/10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 p-4 sm:p-8">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-[#ECA468]/10 animate-in zoom-in-95 duration-200">
              <div className="px-8 py-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                  <Trash2 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 leading-tight mb-2">Delete Assignment?</h2>
                <p className="text-sm text-gray-500 font-medium">
                  Are you sure you want to delete this assignment? This action cannot be undone.
                </p>
              </div>
              <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-3 shadow-inner">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setAssignmentToDelete(null);
                  }}
                  className="flex-1 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteAssignment}
                  className="flex-1 px-6 py-3 rounded-2xl bg-red-500 text-white text-xs font-black uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

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
