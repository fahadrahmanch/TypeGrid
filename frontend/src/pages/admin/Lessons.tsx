import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import SideNavbar from "../../components/admin/layout/Navbar/SideNabar";
import { toast } from "react-toastify";
import { Search, Filter, Plus, Edit2, Trash2,X } from "lucide-react";
import ReusableTable from "../../components/common/ReusableTable";
import {  
  titleValidation,
  LevelValidation,
  WpmValidation,
  accuracyValidation,
  CategoryValidation,
  textValidation,
} from "../../validations/lessonValidation";
import { createLesson, LessonsAPI, fetchLesson, updateLesson, deleteLesson } from "../../api/admin/lessons";
const Lessons: React.FC = () => {
  const [isOpen, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchText);
  const [filter, setFilter] = useState("All");
  const [limit] = useState(5);
  const [page, setPage] = useState(1);
  const [values, setValues] = useState({
    title: "",
    level: "",
    category: "",
    wpm: "",
    accuracy: "",
    text: "",
  });
  const [editValues, setEditValues] = useState({
    id: "",
    title: "",
    level: "",
    category: "",
    wpm: "",
    accuracy: "",
    text: "",
  });

  const [formErrors, setFormErrors] = useState({
    title: "",
    level: "",
    category: "",
    wpm: "",
    accuracy: "",
    text: "",
  });

  const [editFormErrors, setEditFormErrors] = useState({
    title: "",
    level: "",
    category: "",
    wpm: "",
    accuracy: "",
    text: "",
  });

  const [lessons, setLessons] = useState<any[]>([]);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);
  useEffect(() => {
    fetchLessons();
  }, [debouncedSearch, page, filter]);
  const fetchLessons = async () => {
    try {
      const response = await LessonsAPI(debouncedSearch, filter, limit, page);
      if (response && response.data.data) {
        setLessons(response.data.data);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error fetching lessons");
    }
  };

  function handleChange(e: any) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    // Real-time validation
    let err = "";
    if (name === "title") err = titleValidation(value);
    if (name === "level") err = LevelValidation(value);
    if (name === "category") err = CategoryValidation(value);
    if (name === "wpm") err = WpmValidation(value);
    if (name === "accuracy") err = accuracyValidation(value);
    if (name === "text") err = textValidation(value);

    setFormErrors((prev) => ({ ...prev, [name]: err }));
  }

  function handleEdiChange(e: any) {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));

    // Real-time validation
    let err = "";
    if (name === "title") err = titleValidation(value);
    if (name === "level") err = LevelValidation(value);
    if (name === "category") err = CategoryValidation(value);
    if (name === "wpm") err = WpmValidation(value);
    if (name === "accuracy") err = accuracyValidation(value);
    if (name === "text") err = textValidation(value);

    setEditFormErrors((prev) => ({ ...prev, [name]: err }));
    fetchLessons();
  }

  async function handleSubmit() {
    const titleError = titleValidation(String(values.title || ""));
    const levelError = LevelValidation(String(values.level || ""));
    const categoryError = CategoryValidation(String(values.category || ""));
    const wpmError = WpmValidation(String(values.wpm || ""));
    const accuracyError = accuracyValidation(String(values.accuracy || ""));
    const textError = textValidation(String(values.text || ""));

    setFormErrors({
      title: titleError,
      level: levelError,
      category: categoryError,
      wpm: wpmError,
      accuracy: accuracyError,
      text: textError,
    });

    if (titleError || levelError || categoryError || wpmError || accuracyError || textError) {
      return;
    }

    try {
      await createLesson(values);
      setOpen(false);
      setValues({
        title: "",
        level: "",
        category: "",
        wpm: "",
        accuracy: "",
        text: "",
      });
      setFormErrors({
        title: "",
        level: "",
        category: "",
        wpm: "",
        accuracy: "",
        text: "",
      });
      toast.success("Lesson created successfully");
      fetchLessons();
      // const fetchResponse = await getAllLessons();
      // if (fetchResponse && fetchResponse.data.lessons) {
      //   setLessons(fetchResponse.data.lessons);
      // }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error creating lesson");
    }
  }

  function handleDeleteLesson(lessonId: string) {
    setLessonToDelete(lessonId);
    setDeleteOpen(true);
  }

  async function confirmDeleteLesson() {
    if (!lessonToDelete) return;
    try {
      const response = await deleteLesson(lessonToDelete);
      if (!response) return;
      setLessons((prev) => prev.filter((lesson) => lesson.id !== lessonToDelete));
      toast.success("Lesson deleted successfully");
      setDeleteOpen(false);
      setLessonToDelete(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error deleting lesson");
      console.log(error);
    }
  }

  async function fetch(lessonId: string) {
    try {
      const response = await fetchLesson(lessonId);
      if (!response) return;
      const data = response.data.data;
      setEditValues({
        id: data.id,
        title: data.title,
        level: data.level,
        category: data.category,
        wpm: data.targetWpm,
        accuracy: data.targetAccuracy,
        text: data.text,
      });
      setEditOpen(true);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error fetching lesson details");
      console.log(error);
    }
  }

  async function handleEditSubmit(lessonId: string) {
    const titleError = titleValidation(String(editValues.title || ""));
    const levelError = LevelValidation(String(editValues.level || ""));
    const categoryError = CategoryValidation(String(editValues.category || ""));
    const wpmError = WpmValidation(String(editValues.wpm || ""));
    const accuracyError = accuracyValidation(String(editValues.accuracy || ""));
    const textError = textValidation(String(editValues.text || ""));

    setEditFormErrors({
      title: titleError,
      level: levelError,
      category: categoryError,
      wpm: wpmError,
      accuracy: accuracyError,
      text: textError,
    });

    if (titleError || levelError || categoryError || wpmError || accuracyError || textError) {
      return;
    }

    try {
      const response = await updateLesson(lessonId, editValues);
      if (response?.data?.data) {
        setLessons((prev) => prev.map((lesson) => (lesson.id === lessonId ? response.data.data : lesson)));
      }
      setEditOpen(false);
      toast.success("Lesson updated successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error updating lesson");
      console.log(error);
    }
  }

  return (
    <>
      <SideNavbar />

      <div className="md:ml-64 p-4 md:p-8 min-h-screen bg-[#FFF8EA] pt-24 md:pt-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-10">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-1 md:mb-2">Lesson Management</h1>
              <p className="text-xs md:text-sm text-gray-500 font-medium">
                Manage typing content for all game modes.
              </p>
            </div>

            <button
              onClick={() => setOpen(true)}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#ECA468] text-white px-6 py-3 rounded-xl md:rounded-[1.25rem] font-bold shadow-lg shadow-[#ECA468]/20 hover:bg-[#D0864B] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 uppercase text-[10px] md:text-xs tracking-widest"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5]" />
              Add Lesson
            </button>
          </div>

          {/* Search & Filters */}
          <div className="bg-[#fff8ea]/60 backdrop-blur-xl rounded-2xl md:rounded-[2rem] p-4 md:p-6 shadow-sm border border-[#ECA468]/10 mb-6 md:mb-8 flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                type="text"
                placeholder="Search lessons..."
                className="w-full pl-11 md:pl-12 pr-4 py-2.5 md:py-3 bg-white/70 rounded-xl md:rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all placeholder:text-gray-400 font-medium text-sm md:text-base text-gray-800"
              />
            </div>

            <div className="relative min-w-0 md:min-w-[160px]">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D0864B]" />
              <select
                onChange={(e) => setFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-white/70 rounded-xl border border-gray-100 text-xs md:text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] appearance-none cursor-pointer"
              >
                <option value="">All Difficulty</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Lesson List Section */}
          <div className="bg-[#fff8ea]/60 backdrop-blur-xl rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 shadow-sm border border-[#ECA468]/10 overflow-hidden">
            <div className="flex justify-between items-center mb-6 md:mb-8 px-1 md:px-2">
              <div>
                <h3 className="text-lg md:text-xl font-black text-gray-900 leading-tight">Lessons List</h3>
                <p className="text-[10px] text-[#D0864B] font-bold uppercase tracking-widest mt-1">
                  {lessons.length} lessons available
                </p>
              </div>
            </div>

            {/* Lesson List Table */}
            <div className="overflow-x-auto">
              <ReusableTable
                columns={[
                  {
                    header: "Lesson Title",
                    key: "title",
                    render: (lesson) => (
                      <span className="font-bold text-gray-800 whitespace-nowrap">{lesson.title}</span>
                    )
                  },
                  {
                    header: "Difficulty",
                    key: "level",
                    render: (lesson) => (
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border
                      ${
                        lesson.level === "beginner" || lesson.level === "easy"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : lesson.level === "intermediate" || lesson.level === "medium"
                            ? "bg-amber-50 text-amber-600 border-amber-100"
                            : "bg-orange-50 text-[#D0864B] border-orange-100"
                      }`}
                      >
                        {lesson.level}
                      </span>
                    ),
                  },
                  {
                    header: "Preview",
                    key: "text",
                    render: (lesson) => (
                      <p className="text-sm font-medium text-gray-500 max-w-[200px] truncate whitespace-nowrap">
                        {lesson.text}
                      </p>
                    ),
                  },
                  {
                    header: "Stats",
                    key: "stats",
                    headerClassName: "text-center",
                    className: "text-center",
                    render: (lesson) => (
                      <div className="flex items-center justify-center gap-3 whitespace-nowrap">
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-gray-800 font-bold uppercase">{lesson.targetWpm || "-"}</span>
                          <span className="text-[9px] text-[#D0864B] font-bold uppercase">WPM</span>
                        </div>
                        <div className="w-[1px] h-4 bg-gray-100"></div>
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-gray-800 font-bold uppercase">{lesson.targetAccuracy || "-"}%</span>
                          <span className="text-[9px] text-emerald-500 font-bold uppercase">ACC</span>
                        </div>
                      </div>
                    ),
                  },
                  {
                    header: "Actions",
                    key: "actions",
                    headerClassName: "text-right",
                    className: "text-right",
                    render: (lesson) => (
                      <div className="flex justify-end gap-2 md:translate-x-2 md:opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all whitespace-nowrap">
                        <button
                          onClick={() => fetch(lesson.id)}
                          className="p-2 text-gray-400 hover:text-[#ECA468] bg-white rounded-lg shadow-sm border border-gray-50 hover:border-[#FADDB8] transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(lesson.id)}
                          className="p-2 text-gray-400 hover:text-red-500 bg-white rounded-lg shadow-sm border border-gray-50 hover:border-red-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ),
                  },
                ]}
                data={lessons}
                emptyMessage="No lessons found"
                headerClassName="bg-[#FFF8EA] text-left"
                columnHeaderClassName="py-4 px-6 text-[10px] font-black text-[#D0864B] uppercase tracking-widest border-b border-[#ECA468]/10"
              />
            </div>
          </div>
        </div>
      </div>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 p-4">
            <div className="relative w-full max-w-4xl bg-[#FFF8EA] rounded-2xl md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] md:max-h-[90vh] animate-in zoom-in-95 duration-300">
              {/* Header */}
              <div className="px-5 md:px-10 py-4 md:py-8 border-b border-[#ECA468]/10 bg-white/40 flex justify-between items-center">
                <div>
                  <h2 className="text-lg md:text-2xl font-black text-gray-900 leading-tight">Create New Lesson</h2>
                  <p className="text-[8px] md:text-xs text-[#D0864B] font-bold uppercase tracking-widest mt-0.5">Add a new typing lesson</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-white rounded-lg transition-all"
                >
                  <Plus className="w-4 h-4 md:w-6 md:h-6 rotate-45" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 md:p-10 custom-scrollbar bg-white/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-1.5 block px-1">
                      Lesson Title
                    </label>
                    <input
                      type="text"
                      value={values.title}
                      name="title"
                      onChange={handleChange}
                      placeholder="Enter title..."
                      className="w-full px-4 md:px-6 py-2.5 md:py-4 bg-white rounded-xl md:rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-xs md:text-base text-gray-800 placeholder:text-gray-300 shadow-sm"
                    />
                    {formErrors.title && (
                      <p className="text-red-500 text-[8px] md:text-[10px] font-bold mt-1 px-1">
                        {formErrors.title}
                      </p>
                    )}
                  </div>

                  {/* Level */}
                  <div>
                    <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-1.5 block px-1">
                      Difficulty Level
                    </label>
                    <select
                      value={values.level}
                      onChange={handleChange}
                      name="level"
                      className="w-full px-4 md:px-6 py-2.5 md:py-4 bg-white rounded-xl md:rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-xs md:text-base text-gray-800 appearance-none cursor-pointer shadow-sm"
                    >
                      <option value="">Select level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                    {formErrors.level && (
                      <p className="text-red-500 text-[8px] md:text-[10px] font-bold mt-1 px-1">
                        {formErrors.level}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-1.5 block px-1">
                      Category
                    </label>
                    <select
                      value={values.category}
                      name="category"
                      onChange={handleChange}
                      className="w-full px-4 md:px-6 py-2.5 md:py-4 bg-white rounded-xl md:rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-xs md:text-base text-gray-800 appearance-none cursor-pointer shadow-sm"
                    >
                      <option value="" disabled>
                        Select category
                      </option>
                      <option value="sentence">Sentence</option>
                      <option value="paragraph">Paragraph</option>
                    </select>
                    {formErrors.category && (
                      <p className="text-red-500 text-[8px] md:text-[10px] font-bold mt-1 px-1">
                        {formErrors.category}
                      </p>
                    )}
                  </div>

                  {/* WPM */}
                  <div>
                    <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-1.5 block px-1">
                      Target WPM
                    </label>
                    <input
                      type="number"
                      value={values.wpm}
                      name="wpm"
                      onChange={handleChange}
                      placeholder="e.g. 60"
                      className="w-full px-4 md:px-6 py-2.5 md:py-4 bg-white rounded-xl md:rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-xs md:text-base text-gray-800 placeholder:text-gray-300 shadow-sm"
                    />
                    {formErrors.wpm && (
                      <p className="text-red-500 text-[8px] md:text-[10px] font-bold mt-1 px-1">
                        {formErrors.wpm}
                      </p>
                    )}
                  </div>

                  {/* Accuracy */}
                  <div>
                    <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-1.5 block px-1">
                      Target Acc (%)
                    </label>
                    <input
                      type="number"
                      name="accuracy"
                      onChange={handleChange}
                      value={values.accuracy}
                      placeholder="e.g. 90"
                      className="w-full px-4 md:px-6 py-2.5 md:py-4 bg-white rounded-xl md:rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-xs md:text-base text-gray-800 placeholder:text-gray-300 shadow-sm"
                    />
                    {formErrors.accuracy && (
                      <p className="text-red-500 text-[8px] md:text-[10px] font-bold mt-1 px-1">
                        {formErrors.accuracy}
                      </p>
                    )}
                  </div>

                  {/* Practice Text */}
                  <div className="md:col-span-2">
                    <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-1.5 block px-1">
                      Practice Text
                    </label>
                    <textarea
                      rows={4}
                      value={values.text}
                      name="text"
                      onChange={handleChange}
                      placeholder="Enter the practice text..."
                      className="w-full px-4 md:px-6 py-3 md:py-5 bg-white rounded-xl md:rounded-[2rem] border border-gray-100 outline-none resize-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-medium text-xs md:text-base text-gray-700 leading-relaxed placeholder:text-gray-300 shadow-sm"
                    />
                    {formErrors.text && (
                      <p className="text-red-500 text-[8px] md:text-[10px] font-bold mt-1 px-1">
                        {formErrors.text}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="px-5 md:px-10 py-4 md:py-8 border-t border-[#ECA468]/5 bg-white/40 flex flex-row justify-end gap-2 md:gap-4">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 md:px-8 py-2 md:py-4 rounded-xl md:rounded-2xl bg-white text-gray-500 font-black text-[8px] md:text-xs uppercase tracking-widest border border-gray-100 hover:bg-gray-50 transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-5 md:px-10 py-2 md:py-4 rounded-xl md:rounded-2xl bg-[#ECA468] text-white font-black text-[8px] md:text-xs uppercase tracking-widest hover:bg-[#D0864B] shadow-lg shadow-[#ECA468]/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  Create
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {isDeleteOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 p-4">
            <div className="w-full max-w-sm md:max-w-md bg-white rounded-2xl md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-[#ECA468]/10 animate-in zoom-in-95 duration-300">
              <div className="px-6 md:px-8 py-6 md:py-8 flex flex-col items-center text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 md:mb-6">
                  <Trash2 className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-tight mb-2">Delete Lesson?</h2>
                <p className="text-xs md:text-sm text-gray-500 font-medium">
                  This action cannot be undone.
                </p>
              </div>
              <div className="px-6 md:px-8 py-4 md:py-6 bg-gray-50/50 border-t border-gray-100 flex flex-row justify-end gap-2 md:gap-3">
                <button
                  onClick={() => {
                    setDeleteOpen(false);
                    setLessonToDelete(null);
                  }}
                  className="flex-1 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl text-[8px] md:text-xs font-black uppercase tracking-widest text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteLesson}
                  className="flex-1 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl bg-red-500 text-white text-[8px] md:text-xs font-black uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {isEditOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 p-4">
            <div className="relative w-full max-w-4xl bg-[#FFF8EA] rounded-2xl md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] md:max-h-[90vh] animate-in zoom-in-95 duration-300">
              {/* Header */}
              <div className="px-5 md:px-10 py-4 md:py-8 border-b border-[#ECA468]/10 bg-white/40 flex justify-between items-center">
                <div>
                  <h2 className="text-lg md:text-2xl font-black text-gray-900 leading-tight">Edit Lesson</h2>
                  <p className="text-[8px] md:text-xs text-[#D0864B] font-bold uppercase tracking-widest mt-0.5">Update lesson details</p>
                </div>
                <button
                  onClick={() => setEditOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-white rounded-lg transition-all"
                >
                  <X className="w-4 h-4 md:w-6 md:h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 md:p-10 custom-scrollbar bg-white/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-1.5 block px-1">
                      Lesson Title
                    </label>
                    <input
                      type="text"
                      value={editValues.title}
                      name="title"
                      onChange={handleEdiChange}
                      placeholder="Enter title..."
                      className="w-full px-4 md:px-6 py-2.5 md:py-4 bg-white rounded-xl md:rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-xs md:text-base text-gray-800 placeholder:text-gray-300 shadow-sm"
                    />
                    {editFormErrors.title && (
                      <p className="text-red-500 text-[8px] md:text-[10px] font-bold mt-1 px-1">
                        {editFormErrors.title}
                      </p>
                    )}
                  </div>

                  {/* Level */}
                  <div>
                    <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-1.5 block px-1">
                      Difficulty Level
                    </label>
                    <select
                      value={editValues.level}
                      onChange={handleEdiChange}
                      name="level"
                      className="w-full px-4 md:px-6 py-2.5 md:py-4 bg-white rounded-xl md:rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-xs md:text-base text-gray-800 appearance-none cursor-pointer shadow-sm"
                    >
                      <option value="">Select level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                    {editFormErrors.level && (
                      <p className="text-red-500 text-[8px] md:text-[10px] font-bold mt-1 px-1">
                        {editFormErrors.level}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-1.5 block px-1">
                      Category
                    </label>
                    <select
                      value={editValues.category}
                      name="category"
                      onChange={handleEdiChange}
                      className="w-full px-4 md:px-6 py-2.5 md:py-4 bg-white rounded-xl md:rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-xs md:text-base text-gray-800 appearance-none cursor-pointer shadow-sm"
                    >
                      <option value="" disabled>
                        Select category
                      </option>
                      <option value="sentence">Sentence</option>
                      <option value="paragraph">Paragraph</option>
                    </select>
                    {editFormErrors.category && (
                      <p className="text-red-500 text-[8px] md:text-[10px] font-bold mt-1 px-1">
                        {editFormErrors.category}
                      </p>
                    )}
                  </div>

                  {/* WPM */}
                  <div>
                    <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-1.5 block px-1">
                      Target WPM
                    </label>
                    <input
                      type="number"
                      value={editValues.wpm}
                      name="wpm"
                      onChange={handleEdiChange}
                      placeholder="e.g. 60"
                      className="w-full px-4 md:px-6 py-2.5 md:py-4 bg-white rounded-xl md:rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-xs md:text-base text-gray-800 placeholder:text-gray-300 shadow-sm"
                    />
                    {editFormErrors.wpm && (
                      <p className="text-red-500 text-[8px] md:text-[10px] font-bold mt-1 px-1">
                        {editFormErrors.wpm}
                      </p>
                    )}
                  </div>

                  {/* Accuracy */}
                  <div>
                    <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-1.5 block px-1">
                      Target Acc (%)
                    </label>
                    <input
                      type="number"
                      name="accuracy"
                      onChange={handleEdiChange}
                      value={editValues.accuracy}
                      placeholder="e.g. 90"
                      className="w-full px-4 md:px-6 py-2.5 md:py-4 bg-white rounded-xl md:rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-xs md:text-base text-gray-800 placeholder:text-gray-300 shadow-sm"
                    />
                    {editFormErrors.accuracy && (
                      <p className="text-red-500 text-[8px] md:text-[10px] font-bold mt-1 px-1">
                        {editFormErrors.accuracy}
                      </p>
                    )}
                  </div>

                  {/* Practice Text */}
                  <div className="md:col-span-2">
                    <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-1.5 block px-1">
                      Practice Text
                    </label>
                    <textarea
                      rows={4}
                      value={editValues.text}
                      name="text"
                      onChange={handleEdiChange}
                      placeholder="Enter the practice text..."
                      className="w-full px-4 md:px-6 py-3 md:py-5 bg-white rounded-xl md:rounded-[2rem] border border-gray-100 outline-none resize-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-medium text-xs md:text-base text-gray-700 leading-relaxed placeholder:text-gray-300 shadow-sm"
                    />
                    {editFormErrors.text && (
                      <p className="text-red-500 text-[8px] md:text-[10px] font-bold mt-1 px-1">
                        {editFormErrors.text}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="px-5 md:px-10 py-4 md:py-8 border-t border-[#ECA468]/5 bg-white/40 flex flex-row justify-end gap-2 md:gap-4">
                <button
                  onClick={() => setEditOpen(false)}
                  className="px-4 md:px-8 py-2 md:py-4 rounded-xl md:rounded-2xl bg-white text-gray-500 font-black text-[8px] md:text-xs uppercase tracking-widest border border-gray-100 hover:bg-gray-50 transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleEditSubmit(editValues.id)}
                  className="px-5 md:px-10 py-2 md:py-4 rounded-xl md:rounded-2xl bg-[#ECA468] text-white font-black text-[8px] md:text-xs uppercase tracking-widest hover:bg-[#D0864B] shadow-lg shadow-[#ECA468]/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  Update
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
export default Lessons;
