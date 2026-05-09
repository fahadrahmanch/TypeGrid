import React, { useEffect, useState } from "react";
import CompanyUserNavbar from "../../components/companyUser/layout/companyUserNavbar";
import { BookOpen, Calendar, Clock, Trophy, CheckCircle2, PlayCircle, Circle } from "lucide-react";
// import StreakModal from "../../components/companyUser/lessons/StreakModal";
import { toast } from "react-toastify";
import { myLessons } from "../../api/companyUser/lessons";
import { useNavigate } from "react-router-dom";
interface Lesson {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  assignedDate: string;
  targetWpm: number;
  time: string;
  status: "Completed" | "In Progress" | "Not Started";
}

// types/MyLessons.ts
export interface MyLessons {
  lessons: any[];
  completed: number;
  total: number;
}

const MyLessons: React.FC = () => {
  // const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [MyLessons, setMyLessons] = useState<MyLessons>({
    lessons: [],
    completed: 0,
    total: 0,
  });
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const navigate = useNavigate();

  const completed = MyLessons.completed;
  const total = MyLessons.total;

  const remaining = total - completed;

  const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "In Progress":
        return <PlayCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-emerald-100 text-emerald-700";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "Advanced":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  useEffect(() => {
    async function fetchMyLessons() {
      try {
        const response = await myLessons();

        const data = response.data.data;

        const mappedLessons: Lesson[] = data.lessons
          .filter((item: any) => item.lesson !== null)
          .map((item: any) => ({
            id: item.assignmentId,
            title: item.lesson.title,
            level:
              item.lesson.level === "beginner"
                ? "Beginner"
                : item.lesson.level === "intermediate"
                  ? "Intermediate"
                  : "Advanced",
            assignedDate: new Date(item.assignedAt).toLocaleDateString(),
            targetWpm: item.lesson.wpm,
            time: "5 min",
            status:
              item.status === "completed" ? "Completed" : item.status === "progress" ? "In Progress" : "Not Started",
          }));

        const filtered = mappedLessons.filter((lesson) => {
          const levelOk = selectedLevel === "All" || lesson.level.toLowerCase() === selectedLevel.toLowerCase();

          const statusOk = selectedStatus === "All" || lesson.status.toLowerCase() === selectedStatus.toLowerCase();

          return levelOk && statusOk;
        });

        setMyLessons({
          lessons: filtered,
          completed: data.completed,
          total: data.total,
        });

        setFilteredLessons(filtered);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    }

    fetchMyLessons();
  }, [selectedLevel, selectedStatus]);

  async function handleLessonClick(assignedId: string) {
    navigate(`/company/user/assigned-lessons/${assignedId}`);
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF8EA] pt-16 md:pt-20">
      <CompanyUserNavbar />

      <main className="flex-1 p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-6 sm:mb-8 gap-4 text-center sm:text-left pt-4 md:pt-0">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 md:gap-3 mb-1">
              <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
              <h1 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">My Lessons</h1>
            </div>
            <p className="text-[10px] md:text-sm text-gray-500 font-bold uppercase tracking-widest sm:ml-9 opacity-70">
              {MyLessons?.total} lessons assigned
            </p>
          </div>
        </div>

        {/* Progress Bar Section */}
        <div className="bg-[#96705B] rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-8 text-white mb-6 md:mb-8 relative overflow-hidden shadow-lg shadow-[#96705B]/20 mx-1 md:mx-0">
          <div className="flex justify-between items-center mb-3 md:mb-4 relative z-10">
            <span className="text-[8px] md:text-xs font-black uppercase tracking-[0.2em] opacity-80">Progress</span>
            <span className="text-xs md:text-base font-black">{progressPercent}%</span>
          </div>

          {/* Progress bar */}
          <div className="h-2.5 md:h-4 bg-black/10 rounded-full mb-4 md:mb-6 relative z-10 overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-white rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 md:gap-6 text-[8px] md:text-xs relative z-10">
            <div className="flex items-center gap-1.5 bg-white/10 px-2 md:px-3 py-1 md:py-1.5 rounded-full backdrop-blur-sm border border-white/10">
              <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-emerald-400"></div>
              <span className="font-black uppercase tracking-widest">{completed} done</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-2 md:px-3 py-1 md:py-1.5 rounded-full backdrop-blur-sm border border-white/10">
              <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-white/40"></div>
              <span className="font-black uppercase tracking-widest">{remaining} left</span>
            </div>
          </div>

          {/* Decoration */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-black/5 rounded-full blur-2xl"></div>
        </div>

        {/* Decorator */}
        <div className="flex justify-center mb-10">
          <div className="w-12 h-1 bg-pink-500 rounded-full opacity-20"></div>
        </div>

        {/* Filters */}
        <div className="flex flex-row gap-2 md:gap-4 mb-6 md:mb-8 px-1 md:px-0">
          <div className="relative flex-1">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as "All" | "Beginner" | "Intermediate" | "Advanced")}
              className="w-full bg-white border-2 border-transparent hover:border-[#96705B]/20 px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-[9px] md:text-xs font-black uppercase tracking-widest text-gray-700 transition-all outline-none cursor-pointer appearance-none shadow-sm"
            >
              <option value="All">Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-1 h-1 border-r-2 border-b-2 border-gray-400 rotate-45"></div>
            </div>
          </div>

          <div className="relative flex-1">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as "All" | "Completed" | "In Progress" | "Not Started")}
              className="w-full bg-white border-2 border-transparent hover:border-[#96705B]/20 px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-[9px] md:text-xs font-black uppercase tracking-widest text-gray-700 transition-all outline-none cursor-pointer appearance-none shadow-sm"
            >
              <option value="All">Status</option>
              <option value="Completed">Done</option>
              <option value="In Progress">Working</option>
              <option value="Not Started">New</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-1 h-1 border-r-2 border-b-2 border-gray-400 rotate-45"></div>
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6 px-1 md:px-0">
          {filteredLessons.map((lesson) => (
            <div
              onClick={() => handleLessonClick(lesson.id)}
              key={lesson.id}
              className="bg-[#FFFDF9] rounded-xl md:rounded-[2rem] p-2.5 md:p-6 border border-[#F5EBD8] hover:border-[#96705B] hover:shadow-xl hover:shadow-[#96705B]/5 transition-all duration-300 group cursor-pointer relative flex flex-col h-full"
            >
              <div className="flex flex-col md:flex-row justify-between items-start mb-2 md:mb-6 gap-1.5">
                <h3 className="font-black text-gray-900 text-[10px] md:text-lg leading-tight group-hover:text-[#96705B] transition-colors line-clamp-2 pr-1">
                  {lesson.title}
                </h3>
                <span
                  className={`text-[7px] md:text-[9px] uppercase font-black tracking-widest px-1.5 md:px-2.5 py-0.5 md:py-1 rounded md:rounded-lg shrink-0 ${getLevelColor(lesson.level)}`}
                >
                  {lesson.level.slice(0, 3)}
                </span>
              </div>

              <div className="space-y-1.5 md:space-y-3 mb-3 md:mb-8 flex-1">
                <div className="flex items-center gap-1.5 md:gap-3 text-[8px] md:text-xs font-bold text-gray-500">
                  <Calendar className="w-2.5 md:w-3.5 h-2.5 md:h-3.5 text-[#96705B]" />
                  <span className="truncate">{lesson.assignedDate}</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-3 text-[8px] md:text-xs font-bold text-gray-500">
                  <Trophy className="w-2.5 md:w-3.5 h-2.5 md:h-3.5 text-[#96705B]" />
                  <span>{lesson.targetWpm} WPM</span>
                </div>
                <div className="flex items-center gap-1.5 md:gap-3 text-[8px] md:text-xs font-bold text-gray-500">
                  <Clock className="w-2.5 md:w-3.5 h-2.5 md:h-3.5 text-[#96705B]" />
                  <span>{lesson.time}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 md:pt-6 border-t border-[#F5EBD8]">
                <div className="flex items-center gap-1">
                  <div className="shrink-0">
                    {React.cloneElement(getStatusIcon(lesson.status) as React.ReactElement<any>, {
                      className: "w-3 h-3 md:w-5 md:h-5",
                    })}
                  </div>
                  <span
                    className={`text-[7px] md:text-[10px] font-black uppercase tracking-widest hidden xs:inline ${
                      lesson.status === "Completed"
                        ? "text-emerald-600"
                        : lesson.status === "In Progress"
                          ? "text-blue-600"
                          : "text-gray-400"
                    }`}
                  >
                    {lesson.status.split(" ")[0]}
                  </span>
                </div>
                <div className="w-5 h-5 md:w-8 md:h-8 rounded-full bg-[#FAF3E6] flex items-center justify-center group-hover:bg-[#96705B] transition-colors group-hover:translate-x-0.5 transition-transform duration-300">
                  <PlayCircle className={`w-3 h-3 md:w-4 md:h-4 ${lesson.status === "Not Started" ? "text-gray-400" : "text-[#96705B]"} group-hover:text-white`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Streak Modal */}
      {/* <StreakModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
      /> */}
    </div>
  );
};
export default MyLessons;
