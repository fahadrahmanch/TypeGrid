import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import SideNavbar from "../../components/admin/layout/Navbar/SideNabar";
import { toast } from "react-toastify";
import { Search, Plus, Edit2, Trash2, X } from "lucide-react";
import ReusableTable from "../../components/common/ReusableTable";
import Pagination from "../../components/common/Pagination";
import ConfirmModal from "../../components/common/ConfirmModal";
import { xpPointsValidation, rewardDescriptionValidation } from "../../validations/rewardValidation";
import { fetchRewards, createReward, updateReward, deleteReward, fetchRewardById } from "../../api/admin/rewards";

const Reward: React.FC = () => {
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [selectedRewardId, setSelectedRewardId] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(searchText);
  const [totalRewards, setTotalRewards] = useState(0);

  // Deletion Modal states
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [rewardToDelete, setRewardToDelete] = useState<string | null>(null);

  // Form states
  const [values, setValues] = useState({
    xp: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState({
    xp: "",
    description: "",
  });
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);
  useEffect(() => {
    loadRewards();
  }, [debouncedSearch, page]);

  const loadRewards = async () => {
    try {
      setLoading(true);
      const response = await fetchRewards(debouncedSearch, limit, page);
      if (response && response.data) {
        setRewards(response.data.rewards.rewards || []);
        setTotalPages(response.data.rewards.totalPages || 1);
        setTotalRewards(response.data.rewards.totalRewards || 0);
      }
    } catch (err: any) {
      console.error("Error fetching rewards:", err);
      toast.error(err?.response?.data?.message || "Failed to load rewards");
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
    if (name === "xpPoints") err = xpPointsValidation(value);
    if (name === "description") err = rewardDescriptionValidation(value);

    setFormErrors((prev) => ({ ...prev, [name]: err }));
  };

  const validateForm = () => {
    const errors = {
      xp: xpPointsValidation(values.xp),
      description: rewardDescriptionValidation(values.description),
    };

    setFormErrors(errors);
    return !Object.values(errors).some((err) => err !== "");
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (isEditOpen && selectedRewardId) {
        const response = await updateReward(selectedRewardId, values);
        setRewards((prev) => prev.map((reward) => (reward._id === selectedRewardId ? response.data.reward : reward)));
        toast.success("Reward updated successfully");
      } else {
        const response = await createReward({
          xp: Number(values.xp),
          description: values.description,
        });
        setRewards((prev) => [...prev, response.data.reward]);
        toast.success("Reward created successfully");
      }
      closeModals();
      loadRewards();
    } catch (err: any) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = async (_id: string) => {
    try {
      const response = await fetchRewardById(_id);
      if (response && response.data) {
        const data = response.data.reward;
        setValues({
          xp: data.xp.toString(),
          description: data.description,
        });
        setSelectedRewardId(_id);
        setEditOpen(true);
      }
    } catch (err) {
      toast.error("Failed to fetch reward details");
    }
  };

  const handleDelete = (id: string) => {
    setRewardToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!rewardToDelete) return;
    try {
      await deleteReward(rewardToDelete);
      setRewards((prev) => prev.filter((reward) => reward._id !== rewardToDelete));
      toast.success("Reward deleted successfully");
      loadRewards();
    } catch (err) {
      toast.error("Failed to delete reward");
    } finally {
      setDeleteConfirmOpen(false);
      setRewardToDelete(null);
    }
  };

  const closeModals = () => {
    setCreateOpen(false);
    setEditOpen(false);
    setSelectedRewardId(null);
    setValues({
      xp: "",
      description: "",
    });
    setFormErrors({
      xp: "",
      description: "",
    });
  };

  return (
    <div className="md:ml-64 p-8 min-h-screen bg-[#FFF8EA] font-sans">
      <SideNavbar />

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Rewards</h1>
            <p className="text-gray-500 font-medium">Manage rewards for your typing challenges</p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 bg-[#A68F7A] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#8D7763] transition-all shadow-md active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Create Reward</span>
          </button>
        </div>

        {/* Search & Content Bar */}
        <div className="bg-[#FFFDF9] rounded-[2rem] p-8 shadow-sm border border-[#ECA468]/5 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search rewards..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-12 pr-6 py-3 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/10 focus:border-[#ECA468]/30 transition-all placeholder:text-gray-400 font-medium text-gray-800"
              />
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Rewards</p>
              <p className="text-xl font-black text-gray-900">{totalRewards}</p>
            </div>
          </div>

            <ReusableTable
              columns={[
                {
                  header: "XP Points",
                  key: "xp",
                  className: "py-4 px-6 font-bold text-gray-700",
                },
                {
                  header: "Description",
                  key: "description",
                  className: "py-4 px-6 text-gray-600 font-medium",
                },
                {
                  header: "Actions",
                  key: "actions",
                  headerClassName: "text-right",
                  className: "py-4 px-6",
                  render: (reward) => (
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleEdit(reward._id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#F3F4F6] text-[#4B5563] rounded-lg font-bold text-xs hover:bg-gray-200 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(reward._id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#EF4444] text-white rounded-lg font-bold text-xs hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  ),
                },
              ]}
              data={rewards}
              loading={loading}
              emptyMessage="No rewards found"
              headerClassName="bg-[#FFF8EA] text-left"
              columnHeaderClassName="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest"
            />

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          {/* )} */}
        </div>
      </div>

      {/* Modal - Matching Screenshot Styling */}
      {(isCreateOpen || isEditOpen) &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="relative w-full max-w-lg bg-[#FFF8EA] rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="px-8 py-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">{isEditOpen ? "Edit Reward" : "Create Reward"}</h2>
                <button onClick={closeModals} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-5 custom-scrollbar">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-600">XP Points</label>
                  <input
                    type="text"
                    name="xp"
                    value={values.xp}
                    onChange={handleInputChange}
                    placeholder="e.g. 100"
                    className="w-full px-4 py-3 bg-white/60 rounded-xl border-transparent focus:bg-white focus:ring-1 focus:ring-[#ECA468]/30 outline-none transition-all text-gray-800 placeholder:text-gray-300 font-medium"
                  />
                  {formErrors.xp && <p className="text-red-400 text-xs px-1">{formErrors.xp}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-600">Description</label>
                  <textarea
                    name="description"
                    value={values.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Reward description"
                    className="w-full px-4 py-3 bg-white/60 rounded-xl border-transparent focus:bg-white outline-none transition-all text-gray-800 resize-none placeholder:text-gray-300 font-medium leading-relaxed"
                  />
                  {formErrors.description && <p className="text-red-400 text-xs px-1">{formErrors.description}</p>}
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={closeModals}
                    className="px-6 py-2.5 rounded-lg bg-[#E5E7EB] text-gray-700 font-bold text-sm hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2.5 rounded-lg bg-[#A68F7A] text-white font-bold text-sm hover:bg-[#8D7763] transition-colors shadow-sm"
                  >
                    {isEditOpen ? "Edit" : "Create"}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        title="Delete Reward"
        message="Are you sure you want to delete this reward? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setRewardToDelete(null);
        }}
        confirmText="Delete"
      />

      <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #ECA468; border-radius: 10px; }
            `}</style>
    </div>
  );
};

export default Reward;
