import React, { useEffect, useState } from "react";
import { Edit3, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import EditLessonModal from "./EditLessonModal";
import { deleteLesson } from "../../../api/companyAdmin/lessons";
import { toast } from "react-toastify";
import { Lesson } from "../../../types/lesson";

export type { Lesson };

const getDifficultyColor = (level: string) => {
  switch (level.toLowerCase()) {
    case "beginner":
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    case "intermediate":
      return "bg-amber-50 text-amber-600 border-amber-100";
    case "advanced":
      return "bg-rose-50 text-rose-600 border-rose-100";
    default:
      return "bg-gray-50 text-gray-600 border-gray-100";
  }
};

const LessonTable: React.FC<{
  lessons: Partial<Lesson>[];
  setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>;
}> = ({ lessons, setLessons }) => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);
  const [filteredLessons, setFilteredLessons] = useState(lessons);
  const [isOpenEditModal, setOpenEditModal] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  useEffect(() => {
    const total = Math.ceil(lessons.length / limit);
    setTotalPages(Math.max(1, total));

    const start = (page - 1) * limit;
    const paginated = lessons.slice(start, start + limit);

    setFilteredLessons(paginated);
  }, [page, lessons, limit]);

  async function handleDeleteLesson(id: string) {
    try {
      const response = await deleteLesson(id);
      if (response) {
        setLessons((prev: any) =>
          prev.filter((lesson: any) => lesson.id !== id),
        );
        toast.success("Lesson deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete lesson");
    }
  }

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-sm border border-[#ECA468]/10 overflow-hidden">
      <div className="flex justify-between items-center mb-8 px-2">
        <div>
          <h3 className="text-xl font-black text-gray-900 leading-tight">
            All Lessons
          </h3>
          <p className="text-xs text-[#D0864B] font-bold uppercase tracking-widest mt-1">
            {lessons.length} total lessons available
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left font-black text-[10px] uppercase tracking-widest text-gray-400">
              <th className="pb-4 px-4">Lesson Details</th>
              <th className="pb-4 px-4 text-center">Difficulty</th>
              {/* <th className="pb-4 px-4 text-center">Engagement</th> */}
              {/* <th className="pb-4 px-4 text-center font-bold text-[#D0864B]">
                Avg Performance
              </th> */}
              <th className="pb-4 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredLessons?.map((lesson) => (
              <tr
                key={lesson.id}
                className="group hover:bg-white/40 transition-all duration-300"
              >
                <td className="py-5 px-6 font-bold text-gray-800 text-sm flex">
                  {lesson.title}
                </td>
                <td className="py-5 px-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getDifficultyColor(lesson?.level || "")}`}
                  >
                    {lesson?.level}
                  </span>
                </td>
                {/* <td className="py-5 px-4 text-center">
                  <div className="inline-flex flex-col items-center">
                    <span className="text-xs font-bold text-gray-700">
                      {lesson.assigned} Assigned
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {lesson.completed} Completed ({lesson.completionRate}%)
                    </span>
                  </div>
                </td> */}
                {/* <td className="py-5 px-4 text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF8EA] rounded-lg text-xs font-black text-[#D0864B] border border-[#ECA468]/20">
                    {lesson.avgWpm} WPM
                  </div>
                </td> */}
                <td className="py-5 px-4">
                  <div className="flex justify-end gap-2 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                    <button
                      onClick={() => {
                        setSelectedLessonId(lesson.id as string);
                        setOpenEditModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-[#D0864B] bg-white rounded-lg shadow-sm border border-gray-50 hover:border-[#ECA468]/30 transition-all"
                      title="Edit Lesson"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteLesson(lesson.id as string)}
                      className="p-2 text-gray-400 hover:text-red-500 bg-white rounded-lg shadow-sm border border-gray-50 hover:border-red-100 transition-all"
                      title="Delete Lesson"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* {totalPages > 1 && ( */}
        <div className="mt-10 flex justify-center items-center gap-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="p-3 bg-white rounded-xl shadow-sm border border-gray-50 disabled:opacity-30 hover:border-[#FADDB8] text-[#D0864B] transition-all group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-gray-900 tracking-tighter w-4 text-center">
              {page}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#D0864B]/40">
              of {totalPages}
            </span>
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="p-3 bg-white rounded-xl shadow-sm border border-gray-50 disabled:opacity-30 hover:border-[#FADDB8] text-[#D0864B] transition-all group"
          >
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      {/* )} */}

      <EditLessonModal
        isOpen={isOpenEditModal}
        onClose={() => setOpenEditModal(false)}
        lessonId={selectedLessonId as string}
        setLessons={setLessons}
      />
    </div>
  );
};

export default LessonTable;
