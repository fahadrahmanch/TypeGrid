import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import SideNavbar from "../../components/admin/layout/Navbar/SideNabar";
import { toast } from "react-toastify";
import { Search, Plus, Edit2, Trash2, X, Target, Zap, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { goalValidation } from "../../validations/challengeValidation";
import { WpmValidation, accuracyValidation } from "../../validations/lessonValidation";
import ConfirmModal from "../../components/common/ConfirmModal";
import {
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    fetchGoalById
} from "../../api/admin/goals";

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
        } catch (err) {
            console.error("Error fetching goals:", err);
            toast.error("Failed to load goals");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setValues((prev) => ({
            ...prev,
            [name]: value
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
        } catch (err) {
            toast.error("Failed to fetch goal details");
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
        } catch (err) {
            toast.error("Failed to delete goal");
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
            <div className="md:ml-64 p-8 min-h-screen bg-[#FFF8EA] font-sans">
                <SideNavbar />

                <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-end mb-10">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Goals</h1>
                            <div className="flex items-center gap-3">
                                <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">Target Management</p>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#ECA468]/40"></span>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[#ECA468] font-black text-sm">{totalGoals}</span>
                                    <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Total Goals</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setCreateOpen(true)}
                            className="group flex items-center gap-2.5 bg-[#A68F7A] text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-[#8D7763] transition-all shadow-lg shadow-[#A68F7A]/20 active:scale-95 hover:-translate-y-0.5"
                        >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                            <span>CREATE GOAL</span>
                        </button>
                    </div>

                    <div className="bg-[#FFFDF9] rounded-[2rem] p-8 shadow-sm border border-[#ECA468]/5 mb-8">
                        <div className="relative max-w-md mb-8">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search goals..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="w-full pl-12 pr-6 py-3 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/10 focus:border-[#ECA468]/30 transition-all placeholder:text-gray-400 font-medium text-gray-800"
                            />
                        </div>

                        <div className="overflow-x-auto rounded-xl">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#FFF8EA] text-left">
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Goal Title</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">WPM</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Accuracy</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest">Description</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center">
                                                <div className="inline-block w-8 h-8 border-4 border-[#ECA468]/20 border-t-[#ECA468] rounded-full animate-spin" />
                                            </td>
                                        </tr>
                                    ) : goals.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center text-gray-400 font-medium">No goals found</td>
                                        </tr>
                                    ) : goals.map((goal) => (
                                        <tr key={goal._id} className="group hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <Target className="w-5 h-5 text-[#ECA468]" />
                                                    <span className="font-bold text-gray-800 leading-tight">{goal.title}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="flex items-center gap-1.5 mb-0.5">
                                                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                                                        <span className="text-sm font-black text-gray-900">{goal.wpm || "-"}</span>
                                                    </div>
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">WPM</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="flex items-center gap-1.5 mb-0.5">
                                                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                                        <span className="text-sm font-black text-gray-900">{goal.accuracy || "-"}%</span>
                                                    </div>
                                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">ACC</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-gray-600 font-medium text-sm max-w-xs truncate">{goal.description}</td>
                                            <td className="py-5 px-4">
                                                <div className="flex justify-end gap-2 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
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
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                    <div className="mt-12 flex justify-center items-center gap-6">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((prev) => prev - 1)}
                            className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 disabled:opacity-30 hover:border-[#FADDB8] text-[#D0864B] transition-all group"
                        >
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                        </button>

                        <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-gray-900 tracking-tighter w-4 text-center">{page}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#D0864B]/40">of {totalPages}</span>
                        </div>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage((prev) => prev + 1)}
                            className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 disabled:opacity-30 hover:border-[#FADDB8] text-[#D0864B] transition-all group"
                        >
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
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
            {(isCreateOpen || isEditOpen) && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in duration-200 p-4">
                    <div className="relative w-full max-w-lg bg-[#FFF8EA] rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">
                                {isEditOpen ? "Edit Goal" : "Create Goal"}
                            </h2>
                            <button onClick={closeModals} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-5 custom-scrollbar">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-600">Goal Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={values.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 100 WPM & 98% Accuracy"
                                    className="w-full px-4 py-3 bg-white/60 rounded-xl border-transparent focus:bg-white focus:ring-1 focus:ring-[#ECA468]/30 outline-none transition-all text-gray-800 placeholder:text-gray-300 font-medium"
                                />
                                {formErrors.title && <p className="text-red-400 text-xs px-1">{formErrors.title}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-600">WPM</label>
                                    <input
                                        type="number"
                                        name="wpm"
                                        value={values.wpm}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 60"
                                        className="w-full px-4 py-3 bg-white/60 rounded-xl border-transparent focus:bg-white focus:ring-1 focus:ring-[#ECA468]/30 outline-none transition-all text-gray-800 placeholder:text-gray-300 font-medium"
                                    />
                                    {formErrors.wpm && <p className="text-red-400 text-xs px-1">{formErrors.wpm}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-600">Accuracy (%)</label>
                                    <input
                                        type="number"
                                        name="accuracy"
                                        value={values.accuracy}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 95"
                                        className="w-full px-4 py-3 bg-white/60 rounded-xl border-transparent focus:bg-white focus:ring-1 focus:ring-[#ECA468]/30 outline-none transition-all text-gray-800 placeholder:text-gray-300 font-medium"
                                    />
                                    {formErrors.accuracy && <p className="text-red-400 text-xs px-1">{formErrors.accuracy}</p>}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-600">Description</label>
                                <textarea
                                    name="description"
                                    value={values.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    placeholder="Goal description"
                                    className="w-full px-4 py-3 bg-white/60 rounded-xl border-transparent focus:bg-white outline-none transition-all text-gray-800 resize-none placeholder:text-gray-300 font-medium leading-relaxed"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button onClick={closeModals} className="px-6 py-2.5 rounded-lg bg-[#E5E7EB] text-gray-700 font-bold text-sm hover:bg-gray-300 transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleSubmit} className="px-6 py-2.5 rounded-lg bg-[#A68F7A] text-white font-bold text-sm hover:bg-[#8D7763] transition-colors shadow-sm">
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
