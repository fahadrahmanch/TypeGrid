import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Target, Zap, Layers, Type, AlertCircle } from "lucide-react";
import {
  titleValidation,
  LevelValidation,
  WpmValidation,
  accuracyValidation,
  CategoryValidation,
  textValidation,
} from "../../../validations/lessonValidation";
import { getLessonById, updateLesson } from "../../../api/companyAdmin/lessons";
import { toast } from "react-toastify";

interface EditLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: string;
  setLessons: any;
}

const EditLessonModal: React.FC<EditLessonModalProps> = React.memo(({ isOpen, onClose, lessonId, setLessons }) => {
  const [values, setValues] = useState({
    title: "",
    // description: "",
    level: "",
    wpm: "",
    text: "",
    accuracy: "",
    category: "",
  });
  const [error, setError] = useState({
    title: "",
    level: "",
    wpm: "",
    accuracy: "",
    category: "",
    text: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchLesson() {
      if (!lessonId || !isOpen) return;
      setIsLoading(true);
      try {
        const response = await getLessonById(lessonId);
        const lessonData = response.data.lesson || response.data;
        setValues({
          title: lessonData.title || "",
          level: lessonData.level || "",
          wpm: lessonData.wpm?.toString() || "",
          text: lessonData.text || "",
          accuracy: lessonData.accuracy?.toString() || "",
          category: lessonData.category || "",
        });
      } catch (error) {
        console.error("Error fetching lesson:", error);
        toast.error("Failed to load lesson details");
      } finally {
        setIsLoading(false);
      }
    }
    fetchLesson();
  }, [lessonId, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "title") setError({ ...error, title: titleValidation(value) });
    if (name === "level") setError({ ...error, level: LevelValidation(value) });
    if (name === "wpm") setError({ ...error, wpm: WpmValidation(value) });
    if (name === "accuracy") setError({ ...error, accuracy: accuracyValidation(value) });
    if (name === "category") setError({ ...error, category: CategoryValidation(value) });
    if (name === "text") setError({ ...error, text: textValidation(value) });

    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const titleErr = titleValidation(values.title);
    const levelErr = LevelValidation(values.level);
    const wpmErr = WpmValidation(values.wpm);
    const accuracyErr = accuracyValidation(values.accuracy);
    const categoryErr = CategoryValidation(values.category);
    const textErr = textValidation(values.text);

    setError({
      title: titleErr,
      level: levelErr,
      wpm: wpmErr,
      accuracy: accuracyErr,
      category: categoryErr,
      text: textErr,
    });

    if (titleErr || levelErr || wpmErr || accuracyErr || categoryErr || textErr) return;

    setIsSubmitting(true);
    try {
      const response = await updateLesson(lessonId, values);
      const updatedLesson = response.data.lesson;
      setLessons((prev: any) => prev.map((lesson: any) => (lesson.id === updatedLesson.id ? updatedLesson : lesson)));

      toast.success("Lesson updated successfully");
      onClose();
    } catch (error: any) {
      console.log("error", error);
      toast.error(error.response?.data?.message || "Failed to update lesson");
    } finally {
      setIsSubmitting(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1A1512]/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-[#FFF8EA] rounded-3xl md:rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] overflow-hidden border border-white/50 animate-in zoom-in-95 duration-300 flex flex-col">
        {/* Decorative Header */}
        <div className="h-24 md:h-32 bg-gradient-to-br from-[#ECA468] to-[#D0864B] relative overflow-hidden shrink-0">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,#fff_0%,transparent_50%)]" />

          <div className="relative h-full px-6 md:px-10 flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4 text-white">
              <div className="p-2 md:p-3 bg-white/20 rounded-xl md:rounded-2xl backdrop-blur-md">
                <Zap size={24} className="md:w-7 md:h-7" />
              </div>
              <div>
                <h2 className="text-xl md:text-3xl font-black tracking-tight uppercase">Edit Lesson</h2>
                <p className="text-white/70 text-[10px] md:text-sm font-bold uppercase tracking-widest mt-0.5 md:mt-1">Update Material</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 md:p-3 hover:bg-white/20 rounded-xl md:rounded-2xl transition-all text-white/80 hover:text-white"
            >
              <X size={20} className="md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar flex-1 bg-white/40">
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-[#D0864B]"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
                <div className="space-y-4 md:space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-2 md:mb-3 ml-1">
                      <Layers size={14} className="text-[#D0864B]" />
                      Lesson Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={values.title}
                      onChange={handleInputChange}
                      className="w-full px-5 md:px-6 py-3 md:py-4 bg-white rounded-xl md:rounded-2xl border border-gray-100 outline-none focus:ring-4 focus:ring-[#ECA468]/10 focus:border-[#ECA468] transition-all font-bold text-sm md:text-base text-gray-800 shadow-sm"
                    />
                    {error.title && (
                      <div className="flex items-center gap-1.5 mt-2 ml-2 text-red-500">
                        <AlertCircle size={12} />
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider">{error.title}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-2 md:mb-3 ml-1">
                        <Zap size={14} className="text-[#D0864B]" />
                        Level
                      </label>
                      <select
                        name="level"
                        value={values.level}
                        onChange={handleInputChange}
                        className="w-full px-4 md:px-6 py-3 md:py-4 bg-white rounded-xl md:rounded-2xl border border-gray-100 outline-none focus:ring-4 focus:ring-[#ECA468]/10 focus:border-[#ECA468] transition-all font-bold text-xs md:text-sm text-gray-700 appearance-none shadow-sm cursor-pointer"
                      >
                        <option value="">Level</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                      {error.level && <span className="text-[8px] md:text-[9px] font-bold text-red-500 ml-1">{error.level}</span>}
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-2 md:mb-3 ml-1">
                        <Type size={14} className="text-[#D0864B]" />
                        Category
                      </label>
                      <select
                        name="category"
                        value={values.category}
                        onChange={handleInputChange}
                        className="w-full px-4 md:px-6 py-3 md:py-4 bg-white rounded-xl md:rounded-2xl border border-gray-100 outline-none focus:ring-4 focus:ring-[#ECA468]/10 focus:border-[#ECA468] transition-all font-bold text-xs md:text-sm text-gray-700 appearance-none shadow-sm cursor-pointer"
                      >
                        <option value="">Category</option>
                        <option value="paragraph">Paragraph</option>
                        <option value="sentence">Sentence</option>
                      </select>
                      {error.category && (
                        <span className="text-[8px] md:text-[9px] font-bold text-red-500 ml-1">{error.category}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-[#FFF8EA] rounded-2xl md:rounded-3xl p-5 md:p-6 border border-[#ECA468]/20 relative overflow-hidden group">
                    <h4 className="text-[10px] md:text-sm font-black text-[#D0864B] uppercase tracking-[0.2em] mb-4 md:mb-6 flex items-center gap-2">
                      <Target size={18} className="md:w-5 md:h-5" /> Settings Review
                    </h4>

                    <div className="space-y-4 md:space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-1.5 md:mb-2">
                          <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Min. WPM
                          </span>
                          <span className="text-[10px] md:text-xs font-black text-[#D0864B] px-1.5 py-0.5 bg-[#D0864B]/10 rounded-md">
                            {values.wpm} WPM
                          </span>
                        </div>
                        <input
                          type="number"
                          name="wpm"
                          value={values.wpm}
                          onChange={handleInputChange}
                          className="w-full px-5 md:px-6 py-2.5 md:py-3 bg-white rounded-lg md:rounded-xl border border-gray-100 outline-none focus:border-[#D0864B] transition-all font-bold text-sm md:text-base text-gray-800"
                        />
                        {error.wpm && <span className="text-[8px] md:text-[9px] font-bold text-red-500 ml-1">{error.wpm}</span>}
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1.5 md:mb-2">
                          <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Accuracy %
                          </span>
                          <span className="text-[10px] md:text-xs font-black text-[#D0864B] px-1.5 py-0.5 bg-[#D0864B]/10 rounded-md">
                            {values.accuracy}%
                          </span>
                        </div>
                        <input
                          type="number"
                          name="accuracy"
                          value={values.accuracy}
                          onChange={handleInputChange}
                          className="w-full px-5 md:px-6 py-2.5 md:py-3 bg-white rounded-lg md:rounded-xl border border-gray-100 outline-none focus:border-[#D0864B] transition-all font-bold text-sm md:text-base text-gray-800"
                        />
                        {error.accuracy && (
                          <span className="text-[8px] md:text-[9px] font-bold text-red-500 ml-1">{error.accuracy}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mb-2 md:mb-3 ml-1">
                  Lesson Content
                </label>
                <textarea
                  name="text"
                  rows={5}
                  value={values.text}
                  onChange={handleInputChange}
                  className="w-full px-6 md:px-8 py-4 md:py-6 bg-white rounded-2xl md:rounded-3xl border border-gray-100 outline-none focus:ring-4 focus:ring-[#ECA468]/10 focus:border-[#ECA468] transition-all font-medium text-sm md:text-base text-gray-800 shadow-sm resize-none leading-relaxed"
                />
                {error.text && (
                  <div className="flex items-center gap-1.5 mt-2 md:mt-3 ml-2 text-red-500">
                    <AlertCircle size={12} />
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider">{error.text}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse md:flex-row items-stretch md:items-center gap-3 md:gap-4 pt-6 border-t border-gray-50">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all uppercase tracking-widest text-[10px] md:text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] py-4 md:py-5 bg-[#D0864B] hover:bg-[#B36E39] text-white rounded-xl md:rounded-2xl font-black shadow-lg shadow-[#D0864B]/20 transition-all uppercase tracking-widest text-[10px] md:text-xs disabled:opacity-50"
                >
                  {isSubmitting ? "Updating..." : "Update Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
});

export default EditLessonModal;
