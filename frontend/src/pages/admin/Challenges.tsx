import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import SideNavbar from "../../components/admin/layout/Navbar/SideNabar";
import { toast } from "react-toastify";
import { Search, Plus, Edit2, Trash2, X } from "lucide-react";
import ReusableTable from "../../components/common/ReusableTable";
import Pagination from "../../components/common/Pagination";
import { fetchGoals } from "../../api/admin/goals";
import { fetchRewards } from "../../api/admin/rewards";
import {
  titleValidation,
  difficultyValidation,
  goalValidation,
  rewardValidation,
  durationValidation,
  descriptionValidation,
} from "../../validations/challengeValidation";
import {
  fetchChallenges,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  fetchChallengeById,
} from "../../api/admin/challenges";

const Challenges: React.FC = () => {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(searchText);

  // Modal states
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [challengeToDelete, setChallengeToDelete] = useState<string | null>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);
  // Form states
  const [values, setValues] = useState({
    title: "",
    difficulty: "",
    goal: "",
    reward: "",
    duration: "",
    description: "",
    // isActive: true,
  });

  const [formErrors, setFormErrors] = useState({
    title: "",
    difficulty: "",
    goal: "",
    reward: "",
    duration: "",
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
    loadChallenges();
  }, [debouncedSearch, page]);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const response = await fetchChallenges(debouncedSearch, limit, page);
      if (response && response.data) {
        setChallenges(response.data.challenges || []);
        const total = Math.ceil(response.data.total / limit);
        setTotalPages(total || 1);
      }
    } catch (err) {
      console.error("Error fetching challenges:", err);
      toast.error("Failed to load challenges");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    // Real-time validation
    let err = "";
    if (name === "title") err = titleValidation(value);
    if (name === "difficulty") err = difficultyValidation(value);
    if (name === "goal") err = goalValidation(value);
    if (name === "reward") err = rewardValidation(value);
    if (name === "duration") err = durationValidation(value);
    if (name === "description") err = descriptionValidation(value);

    setFormErrors((prev) => ({ ...prev, [name]: err }));
  };

  const validateForm = () => {
    const errors = {
      title: titleValidation(values.title),
      difficulty: difficultyValidation(values.difficulty),
      goal: goalValidation(values.goal),
      reward: rewardValidation(values.reward),
      duration: durationValidation(values.duration),
      description: descriptionValidation(values.description),
    };

    setFormErrors(errors);
    return !Object.values(errors).some((err) => err !== "");
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (isEditOpen && selectedChallengeId) {
        await updateChallenge(selectedChallengeId, values);
        toast.success("Challenge updated successfully");
      } else {
        await createChallenge(values);
        toast.success("Challenge created successfully");
      }
      closeModals();
      loadChallenges();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const response = await fetchChallengeById(id);
      if (response && response.data) {
        const data = response.data.challenge;
        setValues({
          title: data.title,
          difficulty: data.difficulty,
          goal: data.goal,
          reward: data.reward,
          duration: data.duration.toString(),
          description: data.description,
          // isActive: data.isActive,
        });
        setSelectedChallengeId(id);
        setEditOpen(true);
      }
    } catch (err) {
      toast.error("Failed to fetch challenge details");
    }
  };

  const handleDelete = (id: string) => {
    setChallengeToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteChallenge = async () => {
    if (!challengeToDelete) return;
    try {
      await deleteChallenge(challengeToDelete);
      toast.success("Challenge deleted successfully");
      loadChallenges();
      setIsDeleteModalOpen(false);
      setChallengeToDelete(null);
    } catch (err) {
      toast.error("Failed to delete challenge");
    }
  };

  const closeModals = () => {
    setCreateOpen(false);
    setEditOpen(false);
    setSelectedChallengeId(null);
    setValues({
      title: "",
      difficulty: "",
      goal: "",
      reward: "",
      duration: "",
      description: "",
      // isActive: true,
    });
    setFormErrors({
      title: "",
      difficulty: "",
      goal: "",
      reward: "",
      duration: "",
      description: "",
    });
  };

  useEffect(() => {
    const getGoals = async () => {
      const response = await fetchGoals("", Infinity, 1);
      setGoals(response.data.goals);
    };
    getGoals();
  }, []);

  useEffect(() => {
    const getRewards = async () => {
      const response = await fetchRewards("", Infinity, 1);
      setRewards(response.data.rewards.rewards);
    };
    getRewards();
  }, []);
  return (
    <div className="md:ml-64 p-8 min-h-screen bg-[#FFF8EA] font-sans">
      <SideNavbar />

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Challenges Management</h1>
          <p className="text-gray-500 font-medium">
            Design, deploy, and manage typing challenges to drive user engagement and performance excellence.
          </p>
        </div>

        {/* Search & Filters Pill Bar */}
        <div className="bg-[#fff8ea]/60 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-[#ECA468]/10 mb-8 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search the challenge directory..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-14 pr-6 py-3 bg-white/70 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all placeholder:text-gray-400 font-medium text-gray-800"
            />
          </div>

          {/* <div className="relative min-w-[160px]">
                        <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D0864B]" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full pl-10 pr-8 py-2.5 bg-white/70 rounded-xl border border-gray-100 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] appearance-none cursor-pointer"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div> */}

          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 bg-[#ECA468] text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#D0864B] transition-all shadow-lg shadow-[#ECA468]/20 hover:shadow-xl hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create New</span>
          </button>
        </div>

        {/* Table Section Card */}
        <div className="bg-[#fff8ea]/60 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-sm border border-[#ECA468]/10 overflow-hidden">
          <div className="flex justify-between items-center mb-10 px-2">
            <div>
              <h3 className="text-2xl font-black text-gray-900 leading-tight">Active Challenges</h3>
              <p className="text-xs text-[#D0864B] font-bold uppercase tracking-widest mt-1">
                {challenges.length} total modules available
              </p>
            </div>

            <div className="flex gap-8">
              <div className="text-center">
                {/* <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Live
                </p> */}
                {/* <p className="text-xl font-black text-[#BCA38E]">
                  {challenges.filter((c) => c.isActive).length}
                </p> */}
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total</p>
                <p className="text-xl font-black text-gray-900">{challenges.length}</p>
              </div>
            </div>
          </div>

            <ReusableTable
              columns={[
                {
                  header: "Challenge Designation",
                  key: "title",
                  className: "py-6 px-4 align-top",
                  render: (challenge) => (
                    <div className="flex flex-col items-start text-left">
                      <span className="text-base font-black text-gray-800 group-hover:text-[#ECA468] transition-colors leading-tight text-left">
                        {challenge.title}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium mt-1 truncate max-w-[300px]">
                        {challenge.description}
                      </span>
                    </div>
                  ),
                },
                {
                  header: "Complexity",
                  key: "difficulty",
                  headerClassName: "text-center",
                  className: "py-6 px-4 text-center",
                  render: (challenge) => (
                    <span
                      className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg border
                        ${
                          challenge.difficulty === "hard"
                            ? "bg-red-50 text-red-600 border-red-100"
                            : challenge.difficulty === "medium"
                              ? "bg-orange-50 text-orange-600 border-orange-100"
                              : "bg-emerald-50 text-emerald-600 border-emerald-100"
                        }`}
                    >
                      {challenge.difficulty} Tier
                    </span>
                  ),
                },
                {
                  header: "Actions",
                  key: "actions",
                  headerClassName: "text-right",
                  className: "py-6 px-4 text-right",
                  render: (challenge) => (
                    <div className="flex justify-end gap-2 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      <button
                        onClick={() => handleEdit(challenge._id)}
                        className="p-2.5 text-gray-400 hover:text-[#ECA468] bg-white rounded-xl shadow-sm border border-gray-100 hover:border-[#FADDB8] transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(challenge._id)}
                        className="p-2.5 text-red-300 hover:text-red-500 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-red-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ),
                },
              ]}
              data={challenges}
              isLoading={loading}
              emptyMessage="Repository Empty"
            />

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          {/* )} */}
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
                <h2 className="text-2xl font-black text-gray-900 leading-tight mb-2">Delete Challenge?</h2>
                <p className="text-sm text-gray-500 font-medium">
                  Are you sure you want to delete this challenge? This action cannot be undone.
                </p>
              </div>
              <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-3 shadow-inner">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setChallengeToDelete(null);
                  }}
                  className="flex-1 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteChallenge}
                  className="flex-1 px-6 py-3 rounded-2xl bg-red-500 text-white text-xs font-black uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {(isCreateOpen || isEditOpen) &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="relative w-full max-w-lg bg-[#FFF8EA] rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="px-8 py-6 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">
                  {isEditOpen ? "Edit Challenge" : "Create Challenge"}
                </h2>
                <button onClick={closeModals} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-5 custom-scrollbar">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-600">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={values.title}
                    onChange={handleInputChange}
                    placeholder="Challenge title"
                    className="w-full px-4 py-3 bg-white/60 rounded-xl border-transparent focus:bg-white focus:ring-1 focus:ring-[#ECA468]/30 outline-none transition-all text-gray-800 placeholder:text-gray-300 font-medium"
                  />
                  {formErrors.title && <p className="text-red-400 text-xs px-1">{formErrors.title}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-600">Difficulty</label>
                  <div className="relative">
                    <select
                      name="difficulty"
                      value={values.difficulty}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/60 rounded-xl border-transparent focus:bg-white outline-none transition-all text-gray-800 appearance-none cursor-pointer font-medium"
                    >
                      <option value="">Select Difficulty</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {formErrors.difficulty && <p className="text-red-400 text-xs px-1">{formErrors.difficulty}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-600">Goal</label>
                  <div className="relative">
                    <select
                      name="goal"
                      value={values.goal}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/60 rounded-xl border-transparent focus:bg-white outline-none transition-all text-gray-800 appearance-none cursor-pointer font-medium"
                    >
                      <option value="">Select a Goal</option>
                      {goals.map((goal) => (
                        <option key={goal._id} value={goal._id}>
                          {goal.title}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {formErrors.goal && <p className="text-red-400 text-xs px-1">{formErrors.goal}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-600">Reward</label>
                  <div className="relative">
                    <select
                      name="reward"
                      value={values.reward}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/60 rounded-xl border-transparent focus:bg-white outline-none transition-all text-gray-800 appearance-none cursor-pointer font-medium"
                    >
                      <option value="">Select a Reward</option>
                      {rewards.map((reward) => (
                        <option key={reward._id} value={reward._id}>
                          {reward.xp} xp
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {formErrors.reward && <p className="text-red-400 text-xs px-1">{formErrors.reward}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-600">duration time (sec)</label>
                  <div className="relative">
                    <select
                      name="duration"
                      value={values.duration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/60 rounded-xl border-transparent focus:bg-white outline-none transition-all text-gray-800 appearance-none cursor-pointer font-medium"
                    >
                      <option value="">Time</option>
                      <option value="60">60</option>
                      <option value="120">120</option>
                      <option value="180">180</option>
                      <option value="300">300</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {formErrors.duration && <p className="text-red-400 text-xs px-1">{formErrors.duration}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-600">Description</label>
                  <textarea
                    name="description"
                    value={values.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Challenge description"
                    className="w-full px-4 py-3 bg-white/60 rounded-xl border-transparent focus:bg-white outline-none transition-all text-gray-800 resize-none placeholder:text-gray-300 font-medium leading-relaxed"
                  />
                  {formErrors.description && <p className="text-red-400 text-xs px-1">{formErrors.description}</p>}
                </div>

                <div className="flex items-center gap-3 py-2">
                  {/* <div 
                                    onClick={() => setValues(v => ({ ...v, isActive: !v.isActive }))}
                                    className={`w-11 h-6 rounded-full relative transition-all duration-300 cursor-pointer ${values.isActive ? 'bg-[#A68F7A]' : 'bg-gray-300'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 transform ${values.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                </div> */}
                  {/* <span className="text-sm font-semibold text-gray-600">Active</span> */}
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
                    {isEditOpen ? "Update" : "Create"}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #ECA468;
                    border-radius: 20px;
                    border: 2px solid white;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #D0864B;
                }
                @keyframes slide-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slide-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
    </div>
  );
};

export default Challenges;
