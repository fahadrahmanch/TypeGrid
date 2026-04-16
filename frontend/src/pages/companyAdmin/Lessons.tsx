import React, { useState } from "react";
import CompanyAdminSidebar from "../../components/companyAdmin/layout/CompanyAdminSideNavbar";
import { Plus } from "lucide-react";
import LessonTable, { Lesson } from "../../components/companyAdmin/lessons/LessonTable";
import UserSelectionList, { User } from "../../components/companyAdmin/lessons/UserSelectionList";
import AssignmentSummary from "../../components/companyAdmin/lessons/AssignmentSummary";
import LessonSelectionGrid from "../../components/companyAdmin/lessons/LessonSelectionGrid";
import CreateLessonModal from "../../components/companyAdmin/lessons/CreateLessonModal";
import { getLesson } from "../../api/companyAdmin/lessons";
import { useEffect } from "react";
import { getCompanyUsers } from "../../api/companyAdmin/lessons";
import { getAdminLessons } from "../../api/companyAdmin/lessons";
import { assignLesson } from "../../api/companyAdmin/lessons";
import { toast } from "react-toastify";

const Lessons: React.FC = () => {
  const [companyUsers, setCompanyUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);
  const [adminLessons, setAdminLessons] = useState<Lesson[]>([]);
  const [deadlineAt, setDeadlineAt] = useState<string>("");

  useEffect(() => {
    async function fetchCompanyUsers() {
      try {
        const response = await getCompanyUsers();
        const userData = response.data.users || response.data.data || [];
        setCompanyUsers(userData);
      } catch (error) {
        console.log(error);
      }
    }
    fetchCompanyUsers();
  }, []);

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev: any) =>
      prev.includes(userId) ? prev.filter((id: string) => id !== userId) : [...prev, userId]
    );
  };

  const toggleLessonSelection = (lessonId: string) => {
    setSelectedLessons((prev: any) =>
      prev.includes(lessonId) ? prev.filter((id: string) => id !== lessonId) : [...prev, lessonId]
    );
  };

  const handleAssign = async () => {
    try {
      const response = await assignLesson(selectedUsers, selectedLessons, deadlineAt);
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.data.message);
    }
  };

  const handleClear = () => {
    setSelectedUsers([]);
    setSelectedLessons([]);
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await getLesson();
        const lessonsData = response.data.lessons;
        setLessons(lessonsData);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    async function fetchAdminLessons() {
      try {
        const response = await getAdminLessons();
        const adminLessonsData = response.data.lessons.map((lesson: any) => ({
          ...lesson,
          is_admin: true,
        }));
        setAdminLessons(adminLessonsData);
      } catch (error) {
        console.log(error);
      }
    }
    fetchAdminLessons();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#FFF8EA]">
      <CompanyAdminSidebar />
      <CreateLessonModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        setLessons={setLessons}
      />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Lesson Management</h1>
              <p className="text-gray-500 font-medium">Create, manage and assign lessons to your students.</p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 bg-[#D0864B] hover:bg-[#B36E39] text-white px-6 py-3 rounded-2xl transition-all shadow-lg shadow-[#D0864B]/20 font-bold group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              <span>Create New Lesson</span>
            </button>
          </div>

          {/* Lessons List Section */}
          <div className="mb-12">
            <LessonTable lessons={lessons} setLessons={setLessons} />
          </div>

          {/* Assignment Section */}
          <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-sm border border-[#ECA468]/10 p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-[#ECA468]/10 rounded-2xl text-[#D0864B]">
                <Plus size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 leading-tight">Assign Lessons</h2>
                <p className="text-xs text-[#D0864B] font-bold uppercase tracking-widest mt-1">Management Console</p>
              </div>
            </div>

            <div className="flex border-b border-gray-100 mb-8">
              <button className="flex items-center gap-2 px-6 py-3 border-b-2 border-[#D0864B] text-[#D0864B] font-bold text-sm tracking-tight transition-all">
                Assign by User
              </button>
              <button className="flex items-center gap-2 px-6 py-3 text-gray-400 hover:text-gray-600 font-bold text-sm tracking-tight transition-all">
                Assign by Group
              </button>
              <button className="flex items-center gap-2 px-6 py-3 text-gray-400 hover:text-gray-600 font-bold text-sm tracking-tight transition-all ml-auto">
                View Progress
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
              <div className="flex-1">
                <UserSelectionList
                  users={companyUsers}
                  selectedUsers={selectedUsers}
                  onToggleUser={toggleUserSelection}
                />
              </div>

              <div className="lg:w-80 shrink-0">
                <AssignmentSummary
                  selectedUserCount={selectedUsers.length}
                  selectedLessonCount={selectedLessons.length}
                  onAssign={handleAssign}
                  onClear={handleClear}
                  deadlineAt={deadlineAt}
                  setDeadlineAt={setDeadlineAt}
                />
              </div>
            </div>

            <div className="mt-12 pt-12 border-t border-gray-50 text-center">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8">
                Select Practice Material
              </h4>
              <LessonSelectionGrid
                lessons={lessons.concat(adminLessons)}
                selectedLessons={selectedLessons}
                onToggleLesson={toggleLessonSelection}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lessons;
