import { Lesson } from "../../../types/lesson";
import ReusableTable from "../../common/ReusableTable";
import Pagination from "../../common/Pagination";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { Edit3, Trash2 } from "lucide-react";
import EditLessonModal from "./EditLessonModal";
import { deleteLesson } from "../../../api/companyAdmin/lessons";
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
        setLessons((prev: any) => prev.filter((lesson: any) => lesson.id !== id));
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
          <h3 className="text-xl font-black text-gray-900 leading-tight">All Lessons</h3>
          <p className="text-xs text-[#D0864B] font-bold uppercase tracking-widest mt-1">
            {lessons.length} total lessons available
          </p>
        </div>
      </div>

      <ReusableTable
        columns={[
          {
            header: "Lesson Details",
            key: "title",
            className: "py-5 px-6 font-bold text-gray-800 text-sm flex",
          },
          {
            header: "Difficulty",
            key: "level",
            headerClassName: "text-center",
            className: "py-5 px-4 text-center",
            render: (lesson) => (
              <span
                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getDifficultyColor(lesson?.level || "")}`}
              >
                {lesson?.level}
              </span>
            ),
          },
          {
            header: "Assigned",
            key: "assigned",
            headerClassName: "text-center",
            className: "py-5 px-4 text-center font-bold text-gray-600 text-sm",
            render: (lesson) => lesson.assigned || 0,
          },
          {
            header: "Actions",
            key: "actions",
            headerClassName: "text-right",
            className: "py-5 px-4",
            render: (lesson) => (
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
            ),
          },
        ]}
        data={filteredLessons}
      />

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
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
