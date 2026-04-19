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
    <div className="md:ml-64 p-8 min-h-screen bg-[#FFF8EA] font-sans">
      <SideNavbar />

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              <Trophy className="w-8 h-8 text-[#A68F7A]" />
              Achievements
            </h1>
            <p className="text-gray-500 font-medium">Manage achievements for your typing community</p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 bg-[#A68F7A] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#8D7763] transition-all shadow-md active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Create Achievement</span>
          </button>
        </div>

        {/* Search & Content Bar */}
        <div className="bg-[#FFFDF9] rounded-[2rem] p-8 shadow-sm border border-[#ECA468]/5 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search achievements..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-12 pr-6 py-3 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/10 focus:border-[#ECA468]/30 transition-all placeholder:text-gray-400 font-medium text-gray-800"
              />
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Achievements</p>
              <p className="text-xl font-black text-gray-900">{totalAchievements}</p>
            </div>
          </div>

            <ReusableTable
              columns={[
                {
                  header: "Badge",
                  key: "imageUrl",
                  render: (item) => (
                    <div className="w-10 h-10 rounded-lg bg-white/80 border border-gray-100 flex items-center justify-center overflow-hidden shadow-sm">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="Badge" className="w-full h-full object-cover" />
                      ) : (
                        <Trophy className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                  ),
                },
                {
                  header: "Title",
                  key: "title",
                  className: "font-bold text-gray-700",
                },
                {
                  header: "Description",
                  key: "description",
                  className: "text-gray-600 font-medium truncate max-w-[200px]",
                },
                {
                  header: "Min WPM",
                  key: "minWpm",
                  className: "text-gray-700 font-bold",
                  render: (item) => item.minWpm || "—",
                },
                {
                  header: "Min Accuracy",
                  key: "minAccuracy",
                  className: "text-gray-700 font-bold",
                  render: (item) => (item.minAccuracy ? `${item.minAccuracy}%` : "—"),
                },
                {
                  header: "Min Games",
                  key: "minGame",
                  className: "text-gray-700 font-bold",
                  render: (item) => item.minGame || "—",
                },
                {
                  header: "XP Reward",
                  key: "xp",
                  className: "text-[#D0864B] font-bold text-nowrap",
                  render: (item) => `+${item.xp} XP`,
                },
                {
                  header: "Actions",
                  key: "actions",
                  headerClassName: "text-right",
                  className: "py-4 px-6",
                  render: (item) => (
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleEdit(item.id || item._id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#F3F4F6] text-[#4B5563] rounded-lg font-bold text-xs hover:bg-gray-200 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id || item._id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#EF4444] text-white rounded-lg font-bold text-xs hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  ),
                },
              ]}
              data={achievements}
              loading={loading}
              emptyMessage="No achievements found"
              headerClassName="bg-[#FFF8EA] text-left"
              columnHeaderClassName="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest"
            />

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      {/* Modal */}
      {(isCreateOpen || isEditOpen) &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="relative w-full max-w-lg bg-[#FFF8EA] rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="px-8 py-6 flex justify-between items-center bg-white/40">
                <h2 className="text-xl font-bold text-gray-800">
                  {isEditOpen ? "Edit Achievement" : "Create Achievement"}
                </h2>
                <button onClick={closeModals} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-5 custom-scrollbar">
                <div className="flex flex-col items-center gap-4 mb-2">
                  <label className="text-sm font-semibold text-gray-600 self-start">Achievement Badge</label>
                  <div className="relative group">
                    <label
                      htmlFor="achievement-badge-upload"
                      className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center border-2 border-dashed border-gray-200 hover:border-[#ECA468]/50 transition-all overflow-hidden shadow-inner cursor-pointer relative"
                    >
                      {badgeImage || values.imageUrl ? (
                        <img
                          src={badgeImage || values.imageUrl}
                          alt="Badge Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-200" />
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                    </label>
                    <input
                      id="achievement-badge-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                      // Reset value so same file can be selected again
                      onClick={(e) => ((e.target as HTMLInputElement).value = "")}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium italic">
                    Resolution: 512x512 recommended (PNG or JPG)
                  </p>
                  {formErrors.imageUrl && (
                    <p className="text-red-400 text-[10px] font-bold text-center">{formErrors.imageUrl}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-600">Achievement Title</label>
                  <input
                    type="text"
                    name="title"
                    value={values.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Speed Demon"
                    className="w-full px-4 py-3 bg-white/60 rounded-xl border-transparent focus:bg-white focus:ring-1 focus:ring-[#ECA468]/30 outline-none transition-all text-gray-800 placeholder:text-gray-300 font-medium"
                  />
                  {formErrors.title && <p className="text-red-400 text-xs px-1">{formErrors.title}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-600">Description</label>
                  <textarea
                    name="description"
                    value={values.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="What is this achievement for?"
                    className="w-full px-4 py-3 bg-white/60 rounded-xl border-transparent focus:bg-white outline-none transition-all text-gray-800 resize-none placeholder:text-gray-300 font-medium"
                  />
                  {formErrors.description && <p className="text-red-400 text-xs px-1">{formErrors.description}</p>}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-600">Min WPM</label>
                    <input
                      type="number"
                      name="minWpm"
                      value={values.minWpm}
                      onChange={handleInputChange}
                      placeholder="e.g. 80"
                      className="w-full px-4 py-3 bg-white/60 rounded-xl border-transparent focus:bg-white outline-none transition-all text-gray-800 font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-600">Min Acc %</label>
                    <input
                      type="number"
                      name="minAccuracy"
                      value={values.minAccuracy}
                      onChange={handleInputChange}
                      placeholder="e.g. 98"
                      className="w-full px-4 py-3 bg-white/60 rounded-xl border-transparent focus:bg-white outline-none transition-all text-gray-800 font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-600">Min Games</label>
                    <input
                      type="number"
                      name="minGame"
                      value={values.minGame}
                      onChange={handleInputChange}
                      placeholder="e.g. 10"
                      className="w-full px-4 py-3 bg-white/60 rounded-xl border-transparent focus:bg-white outline-none transition-all text-gray-800 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-600">XP Reward</label>
                  <input
                    type="number"
                    name="xp"
                    value={values.xp}
                    onChange={handleInputChange}
                    placeholder="e.g. 500"
                    className="w-full px-4 py-3 bg-white/60 rounded-xl border-transparent focus:bg-white outline-none transition-all text-gray-800 font-medium"
                  />
                  {formErrors.xp && <p className="text-red-400 text-xs px-1">{formErrors.xp}</p>}
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-6">
                  <button
                    onClick={closeModals}
                    className="px-6 py-2.5 rounded-lg bg-[#E5E7EB] text-gray-700 font-bold text-sm hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isImageProcessing}
                    className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm ${
                      isImageProcessing
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[#A68F7A] text-white hover:bg-[#8D7763]"
                    }`}
                  >
                    {isImageProcessing ? "Processing..." : isEditOpen ? "Update" : "Create"}
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
