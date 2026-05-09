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
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to fetch reward details");
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
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete reward");
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
    <div className="md:ml-64 p-4 md:p-8 min-h-screen bg-[#FFF8EA] font-sans pt-24 md:pt-8">
      <SideNavbar />

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-1 md:mb-2">Rewards Management</h1>
            <p className="text-xs md:text-sm text-gray-500 font-medium">Manage XP rewards for platform engagement.</p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#ECA468] text-white px-6 py-3 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-[#D0864B] transition-all shadow-lg shadow-[#ECA468]/20 hover:shadow-xl hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            <span>Create Reward</span>
          </button>
        </div>

        {/* Search & Statistics */}
        <div className="bg-[#fff8ea]/60 backdrop-blur-xl rounded-2xl md:rounded-[2rem] p-4 md:p-8 shadow-sm border border-[#ECA468]/10 mb-6 md:mb-8 flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search rewards..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-11 md:pl-14 pr-4 py-2.5 md:py-3 bg-white/70 rounded-xl md:rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all placeholder:text-gray-400 font-medium text-sm md:text-base text-gray-800"
            />
          </div>
          <div className="flex justify-between md:block px-1">
            <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Rewards</p>
            <p className="text-lg md:text-xl font-black text-gray-900">{totalRewards}</p>
          </div>
        </div>

        {/* Rewards List Section */}
        <div className="bg-[#fff8ea]/60 backdrop-blur-xl rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 shadow-sm border border-[#ECA468]/10 overflow-hidden">
          <div className="flex justify-between items-center mb-6 md:mb-8 px-1 md:px-2">
            <div>
              <h3 className="text-lg md:text-xl font-black text-gray-900 leading-tight">Reward Inventory</h3>
              <p className="text-[10px] text-[#D0864B] font-bold uppercase tracking-widest mt-1">
                {rewards.length} configurations available
              </p>
            </div>
          </div>

          {/* Rewards List Table */}
          <div className="overflow-x-auto">
            <ReusableTable
              columns={[
                {
                  header: "XP Points",
                  key: "xp",
                  className: "py-4 px-6 font-bold text-gray-800 whitespace-nowrap",
                },
                {
                  header: "Description",
                  key: "description",
                  className: "py-4 px-6 text-gray-500 italic text-sm whitespace-nowrap",
                },
                {
                  header: "Actions",
                  key: "actions",
                  headerClassName: "text-right",
                  className: "py-4 px-6 whitespace-nowrap",
                  render: (reward) => (
                    <div className="flex justify-end gap-2 md:translate-x-2 md:opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      <button
                        onClick={() => handleEdit(reward._id)}
                        className="p-2 text-gray-400 hover:text-[#ECA468] bg-white rounded-lg shadow-sm border border-gray-50 hover:border-[#FADDB8] transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(reward._id)}
                        className="p-2 text-gray-400 hover:text-red-500 bg-white rounded-lg shadow-sm border border-gray-50 hover:border-red-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ),
                },
              ]}
              data={rewards}
              isLoading={loading}
              emptyMessage="No rewards found"
              headerClassName="bg-[#FFF8EA] text-left"
              columnHeaderClassName="py-4 px-6 text-[10px] font-black text-[#D0864B] uppercase tracking-widest border-b border-[#ECA468]/10"
            />
          </div>

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      {/* Modal - Matching Screenshot Styling */}
      {(isCreateOpen || isEditOpen) &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 p-4">
            <div className="relative w-full max-w-md bg-[#FFF8EA] rounded-2xl md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] md:max-h-[90vh] animate-in zoom-in-95 duration-300">
              {/* Header */}
              <div className="px-5 md:px-10 py-4 md:py-8 border-b border-[#ECA468]/10 bg-white/40 flex justify-between items-center">
                <div>
                  <h2 className="text-lg md:text-2xl font-black text-gray-900 leading-tight">
                    {isEditOpen ? "Update Reward" : "New Reward"}
                  </h2>
                  <p className="text-[8px] md:text-xs text-[#D0864B] font-bold uppercase tracking-widest mt-0.5">
                    {isEditOpen ? "Modify reward details" : "Configure XP reward"}
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
                  <label className="text-[8px] md:text-xs font-black text-gray-400 uppercase tracking-widest ml-1">XP Points</label>
                  <input
                    type="text"
                    name="xp"
                    value={values.xp}
                    onChange={handleInputChange}
                    placeholder="e.g. 100"
                    className="w-full px-4 py-2.5 md:py-4 bg-white rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all text-gray-800 placeholder:text-gray-300 font-bold text-xs md:text-base shadow-sm"
                  />
                  {formErrors.xp && <p className="text-red-500 text-[8px] md:text-[10px] font-bold mt-1 ml-1">{formErrors.xp}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] md:text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea
                    name="description"
                    value={values.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Briefly explain the reward..."
                    className="w-full px-4 py-2.5 md:py-4 bg-white rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all text-gray-800 resize-none placeholder:text-gray-300 font-bold text-xs md:text-base leading-relaxed shadow-sm"
                  />
                  {formErrors.description && <p className="text-red-500 text-[8px] md:text-[10px] font-bold mt-1 ml-1">{formErrors.description}</p>}
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
