import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import SideNavbar from "../../components/admin/layout/Navbar/SideNabar";
import { toast } from "react-toastify";
import { Search, Plus, Edit2, Trash2, X, Target, Zap, CheckCircle } from "lucide-react";
import ReusableTable from "../../components/common/ReusableTable";
import Pagination from "../../components/common/Pagination";
import { goalValidation } from "../../validations/challengeValidation";
import { WpmValidation, accuracyValidation } from "../../validations/lessonValidation";
import ConfirmModal from "../../components/common/ConfirmModal";
import { fetchGoals, createGoal, updateGoal, deleteGoal, fetchGoalById } from "../../api/admin/goals";

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalGoals, setTotalGoals] = useState(0);

  // Modal states
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(searchText);

  // Form states
  const [values, setValues] = useState({
    title: "",
    description: "",
    wpm: "",
    accuracy: "",
  });

  const [formErrors, setFormErrors] = useState({
    title: "",
    wpm: "",
    accuracy: "",
  });
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);
  useEffect(() => {
    loadGoals();
  }, [debouncedSearch, page]);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const response = await fetchGoals(searchText, limit, page);
      if (response && response.data) {
        const goalsList = response.data.goals || [];
        const total = response.data.total || 0;
        setGoals(goalsList);
        setTotalGoals(total);
        setTotalPages(Math.ceil(total / limit) || 1);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    let err = "";
    if (name === "title") err = goalValidation(value);
    if (name === "targetWpm") err = WpmValidation(value);
    if (name === "targetAccuracy") err = accuracyValidation(value);

    setFormErrors((prev) => ({ ...prev, [name]: err }));
  };

  const validateForm = () => {
    const errors = {
      title: goalValidation(values.title),
      wpm: WpmValidation(values.wpm),
      accuracy: accuracyValidation(values.accuracy),
    };

    setFormErrors(errors);
    return !Object.values(errors).some((err) => err !== "");
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const data = {
      ...values,
      wpm: Number(values.wpm),
      accuracy: Number(values.accuracy),
    };

    try {
      if (isEditOpen && selectedGoalId) {
        await updateGoal(selectedGoalId, data);
        toast.success("Goal updated successfully");
      } else {
        await createGoal(data);
        toast.success("Goal created successfully");
      }
      closeModals();
      loadGoals();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const response = await fetchGoalById(id);
      if (response && response.data) {
        const data = response.data.goal;
        setValues({
          title: data.title,
          description: data.description || "",
          wpm: data.wpm?.toString() || "",
          accuracy: data.accuracy?.toString() || "",
        });
        setSelectedGoalId(id);
        setEditOpen(true);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to fetch goal details");
    }
  };

  const handleDelete = (id: string) => {
    setGoalToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!goalToDelete) return;
    try {
      await deleteGoal(goalToDelete);
      setGoals((prev) => prev.filter((goal) => goal._id !== goalToDelete));
      toast.success("Goal deleted successfully");
      loadGoals();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete goal");
    } finally {
      setIsDeleteConfirmOpen(false);
      setGoalToDelete(null);
    }
  };

  const closeModals = () => {
    setCreateOpen(false);
    setEditOpen(false);
    setSelectedGoalId(null);
    setValues({
      title: "",
      description: "",
      wpm: "",
      accuracy: "",
    });
    setFormErrors({
      title: "",
      wpm: "",
      accuracy: "",
    });
  };

  return (
    <>
      <div className="md:ml-64 p-4 md:p-8 min-h-screen bg-[#FFF8EA] font-sans pt-24 md:pt-8">
        <SideNavbar />

        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 md:mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">Goals Hub</h1>
              <div className="flex items-center gap-3">
                <p className="text-gray-500 font-bold text-[10px] md:text-sm uppercase tracking-widest">Target Management</p>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ECA468]/40"></span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#ECA468] font-black text-sm">{totalGoals}</span>
                  <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Total Goals</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setCreateOpen(true)}
              className="w-full md:w-auto group flex items-center justify-center gap-2.5 bg-[#ECA468] text-white px-8 py-4 rounded-2xl font-black text-xs md:text-sm hover:bg-[#D0864B] transition-all shadow-lg shadow-[#ECA468]/20 active:scale-95 hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>CREATE GOAL</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="bg-[#fff8ea]/60 backdrop-blur-xl rounded-2xl md:rounded-[2rem] p-4 md:p-8 shadow-sm border border-[#ECA468]/10 mb-6 md:mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search goals..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-11 md:pl-14 pr-4 py-2.5 md:py-3 bg-white/70 rounded-xl md:rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all placeholder:text-gray-400 font-medium text-sm md:text-base text-gray-800"
              />
            </div>
          </div>

          {/* Goals List Section */}
          <div className="bg-[#fff8ea]/60 backdrop-blur-xl rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 shadow-sm border border-[#ECA468]/10 overflow-hidden">
            <div className="flex justify-between items-center mb-6 md:mb-8 px-1 md:px-2">
              <div>
                <h3 className="text-lg md:text-xl font-black text-gray-900 leading-tight">Active Targets</h3>
                <p className="text-[10px] text-[#D0864B] font-bold uppercase tracking-widest mt-1">
                  Performance milestones for users
                </p>
              </div>
            </div>

            {/* Goals List Table */}
            <div className="overflow-x-auto">
              <ReusableTable
                columns={[
                  {
                    header: "Goal Title",
                    key: "title",
                    render: (goal) => (
                      <div className="flex items-center gap-3 whitespace-nowrap">
                        <Target className="w-5 h-5 text-[#ECA468]" />
                        <span className="font-bold text-gray-800 leading-tight">{goal.title}</span>
                      </div>
                    ),
                  },
                  {
                    header: "WPM",
                    key: "wpm",
                    headerClassName: "text-center",
                    className: "text-center whitespace-nowrap",
                    render: (goal) => (
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <Zap className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-sm font-black text-gray-900">{goal.wpm || "-"}</span>
                        </div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">WPM</span>
                      </div>
                    ),
                  },
                  {
                    header: "Accuracy",
                    key: "accuracy",
                    headerClassName: "text-center",
                    className: "text-center whitespace-nowrap",
                    render: (goal) => (
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-sm font-black text-gray-900">{goal.accuracy || "-"}%</span>
                        </div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">ACC</span>
                      </div>
                    ),
                  },
                  {
                    header: "Description",
                    key: "description",
                    className: "text-gray-500 font-medium text-xs max-w-xs truncate italic whitespace-nowrap",
                  },
                  {
                    header: "Actions",
                    key: "actions",
                    headerClassName: "text-right",
                    className: "text-right whitespace-nowrap",
                    render: (goal) => (
                      <div className="flex justify-end gap-2 md:translate-x-2 md:opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                        <button
                          onClick={() => handleEdit(goal._id)}
                          className="p-2 text-gray-400 hover:text-[#ECA468] bg-white rounded-lg shadow-sm border border-gray-50 hover:border-[#FADDB8] transition-all"
                          title="Edit Goal"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(goal._id)}
                          className="p-2 text-gray-400 hover:text-red-500 bg-white rounded-lg shadow-sm border border-gray-50 hover:border-red-100 transition-all"
                          title="Delete Goal"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ),
                  },
                ]}
                data={goals}
                isLoading={loading}
                emptyMessage="No goals found"
                headerClassName="bg-[#FFF8EA] text-left"
                columnHeaderClassName="py-4 px-6 text-[10px] font-black text-[#D0864B] uppercase tracking-widest border-b border-[#ECA468]/10"
              />
            </div>

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      </div>

      {isDeleteConfirmOpen && (
        <ConfirmModal
          isOpen={isDeleteConfirmOpen}
          title="Delete Goal"
          message="Are you sure you want to delete this goal? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setIsDeleteConfirmOpen(false);
            setGoalToDelete(null);
          }}
        />
      )}
      {(isCreateOpen || isEditOpen) &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 p-4">
            <div className="relative w-full max-w-md bg-[#FFF8EA] rounded-2xl md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] md:max-h-[90vh] animate-in zoom-in-95 duration-300">
              {/* Header */}
              <div className="px-5 md:px-10 py-4 md:py-8 border-b border-[#ECA468]/10 bg-white/40 flex justify-between items-center">
                <div>
                  <h2 className="text-lg md:text-2xl font-black text-gray-900 leading-tight">
                    {isEditOpen ? "Update Goal" : "New Goal"}
                  </h2>
                  <p className="text-[8px] md:text-xs text-[#D0864B] font-bold uppercase tracking-widest mt-0.5">
                    {isEditOpen ? "Modify goal details" : "Configure performance target"}
                  </p>
                </div>
                <button 
                  onClick={closeModals} 
                  className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-white rounded-lg transition-all"
                >
                  <X className="w-4 h-4 md:w-6 md:h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-5 md:px-10 py-5 md:py-8 space-y-4 md:space-y-6 custom-scrollbar bg-white/20">
                <div className="space-y-1.5">
                  <label className="text-[8px] md:text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Goal Title</label>
                  <input
                    type="text"
                    name="title"
                    value={values.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Speed Master"
                    className="w-full px-4 py-2.5 md:py-4 bg-white rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all text-gray-800 placeholder:text-gray-300 font-bold text-xs md:text-base shadow-sm"
                  />
                  {formErrors.title && <p className="text-red-500 text-[8px] md:text-[10px] font-bold mt-1 ml-1">{formErrors.title}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[8px] md:text-xs font-black text-gray-400 uppercase tracking-widest ml-1">WPM</label>
                    <input
                      type="number"
                      name="wpm"
                      value={values.wpm}
                      onChange={handleInputChange}
                      placeholder="60"
                      className="w-full px-4 py-2.5 md:py-4 bg-white rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all text-gray-800 placeholder:text-gray-300 font-bold text-xs md:text-base shadow-sm"
                    />
                    {formErrors.wpm && <p className="text-red-500 text-[8px] md:text-[10px] font-bold mt-1 ml-1">{formErrors.wpm}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[8px] md:text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Accuracy (%)</label>
                    <input
                      type="number"
                      name="accuracy"
                      value={values.accuracy}
                      onChange={handleInputChange}
                      placeholder="95"
                      className="w-full px-4 py-2.5 md:py-4 bg-white rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all text-gray-800 placeholder:text-gray-300 font-bold text-xs md:text-base shadow-sm"
                    />
                    {formErrors.accuracy && <p className="text-red-500 text-[8px] md:text-[10px] font-bold mt-1 ml-1">{formErrors.accuracy}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] md:text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea
                    name="description"
                    value={values.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Briefly explain the goal..."
                    className="w-full px-4 py-2.5 md:py-4 bg-white rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all text-gray-800 resize-none placeholder:text-gray-300 font-bold text-xs md:text-base leading-relaxed shadow-sm"
                  />
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-row justify-end gap-2 md:gap-3 pt-4 md:pt-10 border-t border-[#ECA468]/5">
                  <button
                    onClick={closeModals}
                    className="px-4 md:px-8 py-2 md:py-4 rounded-xl md:rounded-2xl bg-white text-gray-500 font-black text-[8px] md:text-xs uppercase tracking-widest border border-gray-100 hover:bg-gray-50 transition-all shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-5 md:px-10 py-2 md:py-4 rounded-xl md:rounded-2xl bg-[#ECA468] text-white font-black text-[8px] md:text-xs uppercase tracking-widest hover:bg-[#D0864B] shadow-lg shadow-[#ECA468]/20 active:scale-95 hover:-translate-y-0.5"
                  >
                    {isEditOpen ? "Update" : "Create"}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #ECA468; border-radius: 10px; }
            `}</style>
    </>
  );
};

export default Goals;
