import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import SideNavbar from "../../components/admin/layout/Navbar/SideNabar";
import { toast } from "react-toastify";
import { Search, Filter, Plus, Edit2, Trash2, BookOpen } from "lucide-react";
import {
  titleValidation,
  LevelValidation,
  WpmValidation,
  accuracyValidation,
  CategoryValidation,
  textValidation,
} from "../../validations/lessonValidation";
import {
  createLesson,
  LessonsAPI,
  fetchLesson,
  updateLesson,
  deleteLesson,
} from "../../api/admin/lessons";
const Lessons: React.FC = () => {
  const [isOpen, setOpen] = useState(false);
  const [searchText,setSearchText]=useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchText);
  const [filter,setFilter]=useState("All");
  const [limit]=useState(5);
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

   useEffect(() => {
          const timer = setTimeout(() => {
              setDebouncedSearch(searchText);
              setPage(1);
          }, 500);
          return () => clearTimeout(timer);
      }, [searchText]);
      useEffect(() => {
          fetchLessons();
      }, [debouncedSearch, page]);
    const fetchLessons = async () => {
      try {
        const response = await LessonsAPI(debouncedSearch,filter,limit,page);
        if (response && response.data.data) {
          setLessons(response.data.data);
        }
      } catch (err) {
        console.log("Error fetching lessons:", err);
      }
    };
    fetchLessons();

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

      // const fetchResponse = await getAllLessons();
      // if (fetchResponse && fetchResponse.data.lessons) {
      //   setLessons(fetchResponse.data.lessons);
      // }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error creating lesson");
      console.log("Error creating lesson:", err);
    }
  }

  async function handleDeleteLesson(lessonId: string) {
    if (!window.confirm("Are you sure you want to delete this lesson?")) {
      return;
    }
    try {
      const response = await deleteLesson(lessonId);
      if (!response) return;
      setLessons((prev) => prev.filter((lesson) => lesson.id !== lessonId));
      toast.success("Lesson deleted successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error deleting lesson");
      console.log(error);
    }
  }

  async function fetch(lessonId: string) {
    try {
      const response = await fetchLesson(lessonId);
      if (!response) return;
      const data=response.data.data;
      setEditValues({id:data.id,title:data.title,level:data.level,category:data.category,wpm:data.targetWpm,accuracy:data.targetAccuracy,text:data.text});
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
        setLessons((prev) =>
          prev.map((lesson) =>
            lesson.id === lessonId ? response.data.data : lesson,
          ),
        );
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

      <div className="flex min-h-screen bg-[#FFF8EA]">
        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-start mb-10">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                  Lesson Management
                </h1>
                <p className="text-gray-500 font-medium">
                  Manage typing content for Practice, Solo Play, Quick Play, and Group Play modes.
                </p>
              </div>

              <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 bg-[#ECA468] text-white px-6 py-3 rounded-[1.25rem] font-bold shadow-lg shadow-[#ECA468]/20 hover:bg-[#D0864B] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 uppercase text-xs tracking-widest"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
                Add New Lesson
              </button>
            </div>

            {/* Search & Filters */}
            <div className="bg-[#fff8ea]/60 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-[#ECA468]/10 mb-8 flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search lessons by title or content..."
                  className="w-full pl-12 pr-4 py-3 bg-white/70 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all placeholder:text-gray-400 font-medium"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D0864B]" />
                  <select onChange={(e)=>setFilter(e.target.value)} className="pl-10 pr-8 py-2.5 bg-white/70 rounded-xl border border-gray-100 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] appearance-none cursor-pointer">
                    <option value="">All Modes</option>
                    <option value="sentence">Sentence</option> 
                    <option value="paragraph">Paragraph</option>
                  </select>
                </div>

                
              </div>
            </div>

            {/* Table Section */}
            <div className="bg-[#fff8ea]/60 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-sm border border-[#ECA468]/10 overflow-hidden">
              <div className="flex justify-between items-center mb-8 px-2">
                <div>
                  <h3 className="text-xl font-black text-gray-900 leading-tight">Lessons List</h3>
                  <p className="text-xs text-[#D0864B] font-bold uppercase tracking-widest mt-1">
                    {lessons.length} total lessons
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Difficulty</th>
                      {/* <th className="pb-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th> */}
                      <th className="pb-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Preview</th>
                      <th className="pb-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Stats</th>
                      <th className="pb-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Created</th>
                      <th className="pb-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-50">
                    {lessons && lessons.map((lesson) => (
                      <tr key={lesson.id} className="group hover:bg-white/40 transition-all">
                        <td className="py-5 px-4">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border
                            ${lesson.level === "beginner" || lesson.level === "easy" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                              lesson.level === "intermediate" || lesson.level === "medium" ? "bg-amber-50 text-amber-600 border-amber-100" : 
                              "bg-orange-50 text-[#D0864B] border-orange-100"}`}>
                            {lesson.level}
                          </span>
                        </td>
                        {/* <td className="py-5 px-4 font-bold text-gray-700 text-xs">
                          {lesson.category}
                        </td> */}
                        <td className="py-5 px-4">
                          <p className="text-sm font-medium text-gray-600 max-w-[200px] truncate leading-relaxed">
                            {lesson.text}
                          </p>
                        </td>
                        <td className="py-5 px-4 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] text-gray-400 font-bold uppercase">{lesson.targetWpm || "-"}</span>
                              <span className="text-[9px] text-[#D0864B] font-bold uppercase tracking-tighter">WPM</span>
                            </div>
                            <div className="w-[1px] h-4 bg-gray-100"></div>
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] text-gray-400 font-bold uppercase">{lesson.targetAccuracy || "-"}%</span>
                              <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-tighter">ACC</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-4 text-xs font-medium text-gray-400">
                          {new Date(lesson.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-5 px-4">
                          <div className="flex justify-end gap-2 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                            <button
                              onClick={() => fetch(lesson.id)}
                              className="p-2 text-gray-400 hover:text-[#ECA468] bg-white rounded-lg shadow-sm border border-gray-50 hover:border-[#FADDB8] transition-all"
                              title="Edit Lesson"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteLesson(lesson.id)}
                              className="p-2 text-gray-400 hover:text-red-500 bg-white rounded-lg shadow-sm border border-gray-50 hover:border-red-100 transition-all"
                              title="Delete Lesson"
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
            </div>
          </div>
        </main>
      </div>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FDFBF7]/90 backdrop-blur-sm animate-in fade-in duration-200 p-4 sm:p-8">
          {/* Modal Container */}
          <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-[#ECA468]/10 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-10 py-8 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-gray-900 leading-tight">Create New Lesson</h2>
                <p className="text-sm text-gray-500 font-medium mt-1">Add a new typing lesson to the database</p>
              </div>
              <button 
                onClick={() => setOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 transition-colors"
                title="Close"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-[#FDFBF7]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2 block px-1">Lesson Title</label>
                  <input
                    type="text"
                    value={values.title}
                    name="title"
                    onChange={handleChange}
                    placeholder="Enter a descriptive title..."
                    className="w-full px-6 py-4 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-gray-800 placeholder:text-gray-300 shadow-sm"
                  />
                  {formErrors.title && (
                    <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider mt-2 px-1">{formErrors.title}</p>
                  )}
                </div>

                {/* Level */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2 block px-1">Difficulty Level</label>
                  <select
                    value={values.level}
                    onChange={handleChange}
                    name="level"
                    className="w-full px-6 py-4 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-gray-800 appearance-none cursor-pointer shadow-sm"
                  >
                    <option value="">Select level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  {formErrors.level && (
                    <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider mt-2 px-1">{formErrors.level}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2 block px-1">Category</label>
                  <select
                    value={values.category}
                    name="category"
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-gray-800 appearance-none cursor-pointer shadow-sm"
                  >
                    <option value="" disabled>Select category</option>
                    <option value="sentence">Sentence</option>
                    <option value="paragraph">Paragraph</option>
                  </select>
                  {formErrors.category && (
                    <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider mt-2 px-1">{formErrors.category}</p>
                  )}
                </div>

                {/* WPM */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2 block px-1">Target WPM</label>
                  <input
                    type="number"
                    value={values.wpm}
                    name="wpm"
                    onChange={handleChange}
                    placeholder="e.g. 60"
                    className="w-full px-6 py-4 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-gray-800 placeholder:text-gray-300 shadow-sm"
                  />
                  {formErrors.wpm && (
                    <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider mt-2 px-1">{formErrors.wpm}</p>
                  )}
                </div>

                {/* Accuracy */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2 block px-1">Target Accuracy (%)</label>
                  <input
                    type="number"
                    name="accuracy"
                    onChange={handleChange}
                    value={values.accuracy}
                    placeholder="e.g. 90"
                    className="w-full px-6 py-4 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-gray-800 placeholder:text-gray-300 shadow-sm"
                  />
                  {formErrors.accuracy && (
                    <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider mt-2 px-1">{formErrors.accuracy}</p>
                  )}
                </div>

                {/* Practice Text */}
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2 block px-1">Practice Text</label>
                  <textarea
                    rows={6}
                    value={values.text}
                    name="text"
                    onChange={handleChange}
                    placeholder="Enter the text students will practice..."
                    className="w-full px-6 py-5 bg-white rounded-[2rem] border border-gray-100 outline-none resize-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-medium text-gray-700 leading-relaxed placeholder:text-gray-300 shadow-sm"
                  />
                  {formErrors.text && (
                    <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider mt-2 px-1">{formErrors.text}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-10 py-8 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-4 shadow-inner">
              <button
                onClick={() => setOpen(false)}
                className="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-10 py-3 rounded-2xl bg-[#ECA468] text-white text-xs font-black uppercase tracking-widest hover:bg-[#D0864B] shadow-lg shadow-[#ECA468]/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                Create Lesson
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* edit lesson */}
      {isEditOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FDFBF7]/90 backdrop-blur-sm animate-in fade-in duration-200 p-4 sm:p-8">
          {/* Modal Container */}
          <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-[#ECA468]/10 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-10 py-8 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-gray-900 leading-tight">Edit Lesson</h2>
                <p className="text-sm text-gray-500 font-medium mt-1">Update existing typing lesson details</p>
              </div>
              <button 
                onClick={() => setEditOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 transition-colors"
                title="Close"
              >
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-[#FDFBF7]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2 block px-1">Lesson Title</label>
                  <input
                    type="text"
                    value={editValues.title}
                    name="title"
                    onChange={handleEdiChange}
                    placeholder="Enter a descriptive title..."
                    className="w-full px-6 py-4 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-gray-800 placeholder:text-gray-300 shadow-sm"
                  />
                  {editFormErrors.title && (
                    <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider mt-2 px-1">{editFormErrors.title}</p>
                  )}
                </div>

                {/* Level */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2 block px-1">Difficulty Level</label>
                  <select
                    value={editValues.level}
                    onChange={handleEdiChange}
                    name="level"
                    className="w-full px-6 py-4 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-gray-800 appearance-none cursor-pointer shadow-sm"
                  >
                    <option value="">Select level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  {editFormErrors.level && (
                    <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider mt-2 px-1">{editFormErrors.level}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2 block px-1">Category</label>
                  <select
                    value={editValues.category}
                    name="category"
                    onChange={handleEdiChange}
                    className="w-full px-6 py-4 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-gray-800 appearance-none cursor-pointer shadow-sm"
                  >
                    <option value="" disabled>Select category</option>
                    <option value="sentence">Sentence</option>
                    <option value="paragraph">Paragraph</option>
                  </select>
                  {editFormErrors.category && (
                    <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider mt-2 px-1">{editFormErrors.category}</p>
                  )}
                </div>

                {/* WPM */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2 block px-1">Target WPM</label>
                  <input
                    type="number"
                    value={editValues.wpm}
                    name="wpm"
                    onChange={handleEdiChange}
                    placeholder="e.g. 60"
                    className="w-full px-6 py-4 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-gray-800 placeholder:text-gray-300 shadow-sm"
                  />
                  {editFormErrors.wpm && (
                    <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider mt-2 px-1">{editFormErrors.wpm}</p>
                  )}
                </div>

                {/* Accuracy */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2 block px-1">Target Accuracy (%)</label>
                  <input
                    type="number"
                    name="accuracy"
                    onChange={handleEdiChange}
                    value={editValues.accuracy}
                    placeholder="e.g. 90"
                    className="w-full px-6 py-4 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-gray-800 placeholder:text-gray-300 shadow-sm"
                  />
                  {editFormErrors.accuracy && (
                    <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider mt-2 px-1">{editFormErrors.accuracy}</p>
                  )}
                </div>

                {/* Practice Text */}
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2 block px-1">Practice Text</label>
                  <textarea
                    rows={6}
                    value={editValues.text}
                    name="text"
                    onChange={handleEdiChange}
                    placeholder="Enter the text students will practice..."
                    className="w-full px-6 py-5 bg-white rounded-[2rem] border border-gray-100 outline-none resize-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-medium text-gray-700 leading-relaxed placeholder:text-gray-300 shadow-sm"
                  />
                  {editFormErrors.text && (
                    <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider mt-2 px-1">{editFormErrors.text}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-10 py-8 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-4 shadow-inner">
              <button
                onClick={() => setEditOpen(false)}
                className="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleEditSubmit(editValues.id)}
                className="px-10 py-3 rounded-2xl bg-[#ECA468] text-white text-xs font-black uppercase tracking-widest hover:bg-[#D0864B] shadow-lg shadow-[#ECA468]/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                Update Lesson
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
