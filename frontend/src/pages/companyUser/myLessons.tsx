import React, { useEffect, useState } from 'react';
import CompanyUserNavbar from "../../components/companyUser/layout/companyUserNavbar";
import { BookOpen, Calendar, Clock, Trophy, ChevronDown, CheckCircle2, PlayCircle, Circle } from 'lucide-react';
import StreakModal from '../../components/companyUser/lessons/StreakModal';
import { toast } from 'react-toastify';
import { myLessons } from '../../api/companyUser/lessons';
import { useNavigate } from 'react-router-dom';
interface Lesson {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  assignedDate: string;
  targetWpm: number;
  time: string;
  status: 'Completed' | 'In Progress' | 'Not Started';
}

// types/MyLessons.ts
export interface MyLessons {
  lessons: any[];
  completed: number;
  total: number;
}

const MyLessons: React.FC = () => {
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [MyLessons, setMyLessons] = useState<MyLessons>({
    lessons: [],
    completed: 0,
    total: 0,
  })
  const [filteredLessons, setFilteredLessons] = useState<Lesson[]>([]);
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const navigate = useNavigate();

  // Mock Data
  const completed = MyLessons.completed;
  const total = MyLessons.total;

  const remaining = total - completed;

  const progressPercent =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'In Progress': return <PlayCircle className="w-5 h-5 text-blue-500" />;
      default: return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-emerald-100 text-emerald-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };


  useEffect(() => {
    async function fetchMyLessons() {
      try {
        const response = await myLessons();
        const data = response.data.data;
        console.log("data here",data)

        const mappedLessons: Lesson[] = data.lessons.map((item: any) => ({
          id: item._id,
          title: item.lessonId.title,
          level:
            item.lessonId.level === 'beginner'
              ? 'Beginner'
              : item.lessonId.level === 'intermediate'
                ? 'Intermediate'
                : 'Advanced',
          assignedDate: new Date(item.assignedAt).toLocaleDateString(),
          targetWpm: item.lessonId.wpm,
          time: '5 min', // you can calculate later
          status:
            item.status === 'completed'
              ? 'Completed'
              : item.status === 'progress'
                ? 'In Progress'
                : 'Not Started',
        }));

        const filtered = mappedLessons.filter((lesson) => {
          const levelOk =
            selectedLevel === 'All' || lesson.level.toLowerCase() === selectedLevel.toLowerCase();

          const statusOk =
            selectedStatus === 'All' || lesson.status.toLowerCase() === selectedStatus.toLowerCase();

          return levelOk && statusOk;
        });


        setMyLessons({
          lessons: mappedLessons,
          completed: data.completed,
          total: data.total,
        });

        setFilteredLessons(filtered);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Something went wrong');
      }
    }

    fetchMyLessons();
  }, [selectedLevel, selectedStatus]);



async function handleLessonClick(assignedId: string) {
 navigate(`/company/user/assigned-lessons/${assignedId}`)
 
}



  return (
    <div className="flex min-h-screen bg-[#FFF8EA] pt-20">
      <CompanyUserNavbar />

      <main className="flex-1 p-6 w-full">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <BookOpen className="w-6 h-6 text-gray-700" />
              <h1 className="text-2xl font-bold text-gray-900">My Lessons</h1>
            </div>
            <p className="text-sm text-gray-500 ml-9">{MyLessons?.total} lessons assigned</p>
          </div>
          <button
            onClick={() => setIsStreakModalOpen(true)}
            className="flex items-center gap-2 bg-[#B09886] hover:bg-[#967d6c] text-white px-5 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <Trophy className="w-4 h-4" />
            <span className="text-sm font-semibold">View Streak</span>
          </button>
        </div>

        {/* Progress Bar Section */}
        <div className="bg-[#B09886] rounded-2xl p-6 text-white mb-8 relative overflow-hidden">
          <div className="flex justify-between items-center mb-4 relative z-10">
            <span className="text-xs font-semibold tracking-wide opacity-90">
              Overall Progress
            </span>



            <span className="text-xs font-bold opacity-90">
              {progressPercent} %
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-4 bg-[#967d6c]/40 rounded-full mb-4 relative z-10 overflow-hidden">
            <div
              className="h-full bg-white/90 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Stats */}
          <div className="flex items-center gap-2 text-xs relative z-10 opacity-90">
            <span className="flex items-center gap-1">
              <svg
                width="10"
                height="8"
                viewBox="0 0 10 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 4L3.5 6.5L9 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {completed} completed
            </span>
            <span>•</span>
            <span>{remaining} remaining</span>
          </div>

          {/* Decoration */}
          <div className="absolute top-[40%] left-[50%] w-6 h-0.5 bg-pink-400 opacity-50"></div>
        </div>

        {/* Decorator under progress bar like in screenshot */}
        <div className="flex justify-center mb-8">
          <div className="w-6 h-0.5 bg-pink-500"></div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          {/* Level Filter */}
          <div className="relative">
            <select
              value={selectedLevel}
              onChange={(e) =>
                setSelectedLevel(e.target.value as 'All' | 'Beginner' | 'Intermediate' | 'Advanced')
              }
              className="bg-[#FFF8EA] px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-orange-50 transition-colors outline-none cursor-pointer"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value as 'All' | 'Completed' | 'In Progress' | 'Not Started')
              }
              className="bg-[#FFF8EA] px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-orange-50 transition-colors outline-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Not Started">Not Started</option>
            </select>
          </div>
        </div>


        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredLessons.map((lesson) => (
            <div
            onClick={() => handleLessonClick(lesson.id)}
              key={lesson.id}
              className="bg-[#FFF3DB] rounded-2xl p-6 border border-orange-50 hover:bg-[#FFF3E0]/50 transition-all duration-300 hover:scale-105 cursor-pointer group relative"
            >
              <div className="bg-[#FEFCE8]/50 absolute inset-0 rounded-2xl -z-10"></div>

              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-gray-900 text-lg leading-tight w-[70%]">
                  {lesson.title}
                </h3>
                <span
                  className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${getLevelColor(
                    lesson.level
                  )}`}
                >
                  {lesson.level}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Assigned: {lesson.assignedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Target: {lesson.targetWpm} WPM</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Time: {lesson.time}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getStatusIcon(lesson.status)}
                <span
                  className={`text-xs font-semibold ${lesson.status === 'Completed'
                      ? 'text-emerald-600'
                      : lesson.status === 'In Progress'
                        ? 'text-blue-600'
                        : 'text-gray-500'
                    }`}
                >
                  {lesson.status}
                </span>
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* Streak Modal */}
      <StreakModal isOpen={isStreakModalOpen} onClose={() => setIsStreakModalOpen(false)} />
    </div >
  );
};
export default MyLessons;