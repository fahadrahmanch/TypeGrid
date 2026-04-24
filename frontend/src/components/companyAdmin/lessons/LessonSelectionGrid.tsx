import React from "react";
import { Check, BookOpen, Clock, FileText, Target } from "lucide-react";
import { Lesson } from "./LessonTable";

interface LessonSelectionGridProps {
  lessons: (Partial<Lesson> & {
    is_admin?: boolean;
    _id?: string;
    description?: string;
    duration?: number;
    word_count?: number;
    accuracy_required?: number;
  })[];
  selectedLessons: string[];
  onToggleLesson: (lessonId: string) => void;
  isGroupMode?: boolean;
}

const LessonSelectionGrid: React.FC<LessonSelectionGridProps> = ({
  lessons,
  selectedLessons,
  onToggleLesson,
  isGroupMode = false,
}) => {
  const [filter, setFilter] = React.useState<"all" | "company" | "admin">("all");

  const filteredLessons = lessons.filter((lesson) => {
    if (filter === "all") return true;
    if (filter === "company") return !lesson.is_admin;
    if (filter === "admin") return lesson.is_admin;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-10">
        <div className="bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-[#ECA468]/20 flex gap-1 shadow-sm">
          {[
            { id: "all", label: "All Material" },
            { id: "company", label: "My Lessons" },
            { id: "admin", label: "TypeGrid Library" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === tab.id
                  ? "bg-[#D0864B] text-white shadow-md shadow-[#D0864B]/20"
                  : "text-gray-400 hover:text-gray-600 hover:bg-white/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 text-left">
        {filteredLessons.map((lesson) => {
          const lessonId = (lesson._id || lesson.id || "") as string;
          const isSelected = selectedLessons.includes(lessonId);

          return (
            <button
              key={lessonId}
              onClick={() => onToggleLesson(lessonId)}
              className={`relative p-5 rounded-2xl border transition-all duration-300 text-left group overflow-hidden ${
                isSelected
                  ? "bg-[#D0864B] border-[#D0864B] shadow-lg shadow-[#D0864B]/20"
                  : "bg-white border-gray-100 hover:border-[#ECA468] hover:shadow-md"
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 text-white">
                  <div className="bg-white/20 rounded-full p-1 backdrop-blur-md">
                    <Check size={12} strokeWidth={4} />
                  </div>
                </div>
              )}

              <div
                className={`p-2.5 rounded-xl inline-block mb-4 transition-colors ${
                  isSelected ? "bg-white/20 text-white" : "bg-[#ECA468]/10 text-[#D0864B]"
                }`}
              >
                <BookOpen size={18} />
              </div>

              <h4
                className={`font-black text-sm mb-2 transition-colors ${isSelected ? "text-white" : "text-gray-800"}`}
              >
                {lesson.title}
              </h4>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                    isSelected ? "bg-white/20 text-white" : "bg-gray-50 text-gray-400 border border-gray-100"
                  }`}
                >
                  {lesson.level}
                </span>
                {lesson.is_admin && (
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                      isSelected ? "bg-rose-100/20 text-white" : "bg-rose-50 text-rose-500 border border-rose-100"
                    }`}
                  >
                    Library
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {filteredLessons.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No lessons found in this category</p>
        </div>
      )}
    </div>
  );
};


const Badge: React.FC<{ children: React.ReactNode; color?: "green" | "yellow" | "red" | "gray"; icon?: React.ReactNode }> = ({
  children,
  color = "gray",
  icon,
}) => {
  const colors = {
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-700",
    red: "bg-red-50 text-red-600",
    gray: "bg-gray-50 text-gray-500",
  };

  return (
    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold ${colors[color]}`}>
      {icon}
      {children}
    </span>
  );
};

export default LessonSelectionGrid;

