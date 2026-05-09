import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import SideNavbar from "../../components/admin/layout/Navbar/SideNabar";
import { toast } from "react-toastify";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Trophy,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import ReusableTable from "../../components/common/ReusableTable";
import Pagination from "../../components/common/Pagination";
import ConfirmModal from "../../components/common/ConfirmModal";
import {
  fetchAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  fetchAchievementById,
} from "../../api/admin/achievements";

const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAchievements, setTotalAchievements] = useState(0);

  // Modal states
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Deletion Modal states
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [isImageProcessing, setIsImageProcessing] = useState(false);
  const [badgeImage, setBadgeImage] = useState<string>("");

  // Form states
  const [values, setValues] = useState({
    title: "",
    description: "",
    minWpm: "",
    minAccuracy: "",
    minGame: "",
    xp: "",
    imageUrl: "",
  });

  const [formErrors, setFormErrors] = useState<any>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    loadAchievements();
  }, [debouncedSearch, page]);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const response = await fetchAchievements(debouncedSearch, limit, page);
      if (response && response.data) {
        const data = response.data.data;
        const list = data.achievements || data.result || (Array.isArray(data) ? data : []);
        setAchievements(list);
        setTotalPages(data.totalPages || 1);
        setTotalAchievements(data.totalAchievements || list.length);
      }
    } catch (err: any) {
      console.error("Error fetching achievements:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev: any) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        toast.error("Image size must be less than 3MB");
        return;
      }

      const toastId = toast.loading("Uploading badge icon...");
      setIsImageProcessing(true);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "UMS-MERN");

        const res = await axios.post("https://api.cloudinary.com/v1_1/dbo7vvi5z/image/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: false,
        });

        const data = res.data;
        const imageUrl = data.secure_url;

        setBadgeImage(imageUrl);
        setValues((prev) => ({ ...prev, imageUrl }));

        toast.update(toastId, {
          render: "Badge uploaded and URL ready",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } catch (err) {
        console.error("Upload error", err);
        toast.update(toastId, {
          render: "Image upload failed",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      } finally {
        setIsImageProcessing(false);
      }
    }
  };

  const validateForm = () => {
    const errors: any = {};
    if (!values.title.trim()) errors.title = "Title is required";
    if (!values.description.trim()) errors.description = "Description is required";
    if (!values.xp) errors.xp = "XP Reward is required";
    if (!values.imageUrl) errors.imageUrl = "Badge icon is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (isImageProcessing) {
      toast.info("Still processing image, please wait...");
      return;
    }

    try {
      const payload = {
        title: values.title.trim(),
        description: values.description.trim(),
        imageUrl: badgeImage || values.imageUrl,
        minWpm: Number(values.minWpm) || 0,
        minAccuracy: Number(values.minAccuracy) || 0,
        minGame: Number(values.minGame) || 0,
        xp: Number(values.xp) || 0,
      };

    

      if (isEditOpen && selectedId) {
        await updateAchievement(selectedId, payload);
        toast.success("Achievement updated successfully");
      } else {
        await createAchievement(payload);
        toast.success("Achievement created successfully");
      }
      closeModals();
      loadAchievements();
    } catch (err: any) {
      console.error("Submission error:", err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const response = await fetchAchievementById(id);
      if (response && response.data) {
        const data = response.data.data;
        setValues({
          title: data.title,
          description: data.description,
          minWpm: data.minWpm?.toString() || "",
          minAccuracy: data.minAccuracy?.toString() || "",
          minGame: data.minGame?.toString() || "",
          xp: data.xp?.toString() || "",
          imageUrl: data.imageUrl || "",
        });
        setBadgeImage(data.imageUrl || "");
        setSelectedId(id);
        setEditOpen(true);
      }
    } catch (err) {
      toast.error("Failed to fetch achievement details");
    }
  };

  const handleDelete = (id: string) => {
    setIdToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!idToDelete) return;
    try {
      await deleteAchievement(idToDelete);
      toast.success("Achievement deleted successfully");
      loadAchievements();
    } catch (err) {
      toast.error("Failed to delete achievement");
    } finally {
      setDeleteConfirmOpen(false);
      setIdToDelete(null);
    }
  };

  const closeModals = () => {
    setCreateOpen(false);
    setEditOpen(false);
    setSelectedId(null);
    setValues({
      title: "",
      description: "",
      minWpm: "",
      minAccuracy: "",
      minGame: "",
      xp: "",
      imageUrl: "",
    });
    setBadgeImage("");
    setFormErrors({});
  };

  return (
    <div className="md:ml-64 p-4 md:p-8 min-h-screen bg-[#FFF8EA] font-sans pt-24 md:pt-8">
      <SideNavbar />

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 md:mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <Trophy className="w-8 h-8 md:w-10 md:h-10 text-[#ECA468]" />
              Achievements
            </h1>
            <p className="text-xs md:text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">Gamification Hub</p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="w-full md:w-auto group flex items-center justify-center gap-2.5 bg-[#ECA468] text-white px-8 py-4 rounded-2xl font-black text-xs md:text-sm hover:bg-[#D0864B] transition-all shadow-lg shadow-[#ECA468]/20 active:scale-95 hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span>CREATE ACHIEVEMENT</span>
          </button>
        </div>

        {/* Search & Stats Bar */}
        <div className="bg-[#fff8ea]/60 backdrop-blur-xl rounded-2xl md:rounded-[2rem] p-4 md:p-8 shadow-sm border border-[#ECA468]/10 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search achievements..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-11 md:pl-14 pr-4 py-2.5 md:py-3 bg-white/70 rounded-xl md:rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all placeholder:text-gray-400 font-medium text-sm md:text-base text-gray-800"
              />
            </div>
            <div className="flex items-center justify-between md:justify-end gap-6 px-1">
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Global Badges</p>
                <p className="text-xl md:text-2xl font-black text-gray-900">{totalAchievements}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-[#fff8ea]/60 backdrop-blur-xl rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 shadow-sm border border-[#ECA468]/10 overflow-hidden">
          <div className="flex justify-between items-center mb-6 md:mb-8 px-1 md:px-2">
            <div>
              <h3 className="text-lg md:text-xl font-black text-gray-900 leading-tight">Achievement tiers</h3>
              <p className="text-[10px] text-[#D0864B] font-bold uppercase tracking-widest mt-1">
                Milestones for player progression
              </p>
            </div>
          </div>

          {/* Achievement List Table */}
          <div className="overflow-x-auto">
            <ReusableTable
              columns={[
                {
                  header: "Badge",
                  key: "imageUrl",
                  render: (item) => (
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#ECA468]/10 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300 whitespace-nowrap">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="Badge" className="w-full h-full object-cover" />
                      ) : (
                        <Trophy className="w-6 h-6 text-[#ECA468]/40" />
                      )}
                    </div>
                  ),
                },
                {
                  header: "Identity",
                  key: "title",
                  render: (item) => (
                    <div className="flex flex-col whitespace-nowrap">
                      <span className="font-black text-gray-800 leading-tight">{item.title}</span>
                      <span className="text-[10px] text-gray-400 font-medium italic mt-0.5 truncate max-w-[150px]">{item.description}</span>
                    </div>
                  )
                },
                {
                  header: "WPM",
                  key: "minWpm",
                  headerClassName: "text-center",
                  className: "text-center whitespace-nowrap",
                  render: (item) => (
                    <span className="text-sm font-black text-gray-900">{item.minWpm || "-"}</span>
                  ),
                },
                {
                  header: "ACC %",
                  key: "minAccuracy",
                  headerClassName: "text-center",
                  className: "text-center whitespace-nowrap",
                  render: (item) => (
                    <span className="text-sm font-black text-gray-900">{item.minAccuracy ? `${item.minAccuracy}%` : "—"}</span>
                  ),
                },
                {
                  header: "Games",
                  key: "minGame",
                  headerClassName: "text-center",
                  className: "text-center whitespace-nowrap",
                  render: (item) => (
                    <span className="text-sm font-black text-gray-900">{item.minGame || "—"}</span>
                  ),
                },
                {
                  header: "Reward",
                  key: "xp",
                  className: "text-nowrap whitespace-nowrap",
                  render: (item) => (
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-black text-[#D0864B]">+{item.xp}</span>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">XP</span>
                    </div>
                  ),
                },
                {
                  header: "Actions",
                  key: "actions",
                  headerClassName: "text-right",
                  className: "py-4 px-6 whitespace-nowrap",
                  render: (item) => (
                    <div className="flex justify-end gap-2 md:translate-x-2 md:opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      <button
                        onClick={() => handleEdit(item.id || item._id)}
                        className="p-2 text-gray-400 hover:text-[#ECA468] bg-white rounded-lg shadow-sm border border-gray-50 hover:border-[#FADDB8] transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id || item._id)}
                        className="p-2 text-gray-400 hover:text-red-500 bg-white rounded-lg shadow-sm border border-gray-50 hover:border-red-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ),
                },
              ]}
              data={achievements}
              isLoading={loading}
              emptyMessage="No achievements found"
              headerClassName="bg-[#FFF8EA] text-left"
              columnHeaderClassName="py-4 px-6 text-[10px] font-black text-[#D0864B] uppercase tracking-widest border-b border-[#ECA468]/10"
            />
          </div>

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      {/* Modal */}
      {(isCreateOpen || isEditOpen) &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 p-4">
            <div className="relative w-full max-w-md bg-[#FFF8EA] rounded-2xl md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] md:max-h-[90vh] animate-in zoom-in-95 duration-300">
              {/* Header */}
              <div className="px-5 md:px-10 py-4 md:py-8 border-b border-[#ECA468]/10 bg-white/40 flex justify-between items-center">
                <div>
                  <h2 className="text-lg md:text-2xl font-black text-gray-900 leading-tight">
                    {isEditOpen ? "Update Badge" : "New Badge"}
                  </h2>
                  <p className="text-[8px] md:text-xs text-[#D0864B] font-bold uppercase tracking-widest mt-0.5">
                    {isEditOpen ? "Modify achievement details" : "Configure player milestone"}
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
                <div className="flex flex-col items-center gap-4 mb-2">
                  <div className="relative group">
                    <label
                      htmlFor="achievement-badge-upload"
                      className="w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl bg-white flex items-center justify-center border-2 border-dashed border-gray-200 hover:border-[#ECA468]/50 transition-all overflow-hidden shadow-inner cursor-pointer relative"
                    >
                      {badgeImage || values.imageUrl ? (
                        <img
                          src={badgeImage || values.imageUrl}
                          alt="Badge Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-6 h-6 md:w-8 md:h-8 text-gray-200" />
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="w-4 h-4 md:w-6 md:h-6 text-white" />
                      </div>
                    </label>
                    <input
                      id="achievement-badge-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                      onClick={(e) => ((e.target as HTMLInputElement).value = "")}
                    />
                  </div>
                  <p className="text-[8px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
                    Badge Icon (512x512)
                  </p>
                  {formErrors.imageUrl && (
                    <p className="text-red-500 text-[8px] md:text-[10px] font-bold text-center uppercase">{formErrors.imageUrl}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] md:text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Achievement Title</label>
                  <input
                    type="text"
                    name="title"
                    value={values.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Speed Demon"
                    className="w-full px-4 py-2.5 md:py-4 bg-white rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all text-gray-800 placeholder:text-gray-300 font-bold text-xs md:text-base shadow-sm"
                  />
                  {formErrors.title && <p className="text-red-500 text-[8px] md:text-[10px] font-bold mt-1 ml-1">{formErrors.title}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] md:text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Description</label>
                  <textarea
                    name="description"
                    value={values.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Briefly explain this achievement..."
                    className="w-full px-4 py-2.5 md:py-4 bg-white rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all text-gray-800 resize-none placeholder:text-gray-300 font-bold text-xs md:text-base leading-relaxed shadow-sm"
                  />
                  {formErrors.description && <p className="text-red-500 text-[8px] md:text-[10px] font-bold mt-1 ml-1">{formErrors.description}</p>}
                </div>

                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[8px] md:text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Min WPM</label>
                    <input
                      type="number"
                      name="minWpm"
                      value={values.minWpm}
                      onChange={handleInputChange}
                      placeholder="80"
                      className="w-full px-4 py-2.5 md:py-4 bg-white rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all text-gray-800 font-bold text-xs md:text-base shadow-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] md:text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Acc %</label>
                    <input
                      type="number"
                      name="minAccuracy"
                      value={values.minAccuracy}
                      onChange={handleInputChange}
                      placeholder="98"
                      className="w-full px-4 py-2.5 md:py-4 bg-white rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all text-gray-800 font-bold text-xs md:text-base shadow-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] md:text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Games</label>
                    <input
                      type="number"
                      name="minGame"
                      value={values.minGame}
                      onChange={handleInputChange}
                      placeholder="10"
                      className="w-full px-4 py-2.5 md:py-4 bg-white rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all text-gray-800 font-bold text-xs md:text-base shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] md:text-xs font-black uppercase tracking-widest text-gray-400 ml-1">XP Reward</label>
                  <input
                    type="number"
                    name="xp"
                    value={values.xp}
                    onChange={handleInputChange}
                    placeholder="500"
                    className="w-full px-4 py-2.5 md:py-4 bg-white rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all text-gray-800 font-bold text-xs md:text-base shadow-sm"
                  />
                  {formErrors.xp && <p className="text-red-500 text-[8px] md:text-[10px] font-bold mt-1 ml-1">{formErrors.xp}</p>}
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
                    disabled={isImageProcessing}
                    className="px-5 md:px-10 py-2 md:py-4 rounded-xl md:rounded-2xl bg-[#ECA468] text-white font-black text-[8px] md:text-xs uppercase tracking-widest hover:bg-[#D0864B] shadow-lg shadow-[#ECA468]/20 active:scale-95 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isImageProcessing ? "Uploading..." : (isEditOpen ? "Update" : "Create")}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        title="Delete Achievement"
        message="Are you sure you want to delete this achievement? Users who earned it will keep it, but it will no longer be available for others."
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setIdToDelete(null);
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

export default Achievements;
