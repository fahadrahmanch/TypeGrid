import React, { useState } from "react";
import CompanyAdminSidebar from "../../components/companyAdmin/layout/CompanyAdminSideNavbar";
import { Plus, Users, User as UserIcon } from "lucide-react";
import LessonTable, { Lesson } from "../../components/companyAdmin/lessons/LessonTable";
import UserSelectionList, { User } from "../../components/companyAdmin/lessons/UserSelectionList";
import GroupSelectionList, { Group } from "../../components/companyAdmin/lessons/GroupSelectionList";
import AssignmentSummary from "../../components/companyAdmin/lessons/AssignmentSummary";
import LessonSelectionGrid from "../../components/companyAdmin/lessons/LessonSelectionGrid";
import CreateLessonModal from "../../components/companyAdmin/lessons/CreateLessonModal";
import PendingAssignments from "../../components/companyAdmin/lessons/PendingAssignments";
import {  getLesson } from "../../api/companyAdmin/lessons";
import { useEffect } from "react";
import { getCompanyUsers } from "../../api/companyAdmin/lessons";
import { getAdminLessons } from "../../api/companyAdmin/lessons";
import { assignLesson, assignLessonToGroup } from "../../api/companyAdmin/lessons";
import { getCompanyGroups } from "../../api/companyAdmin/companyGroup";
import { toast } from "react-toastify";

const Lessons: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"user" | "group">("user");
  const [companyUsers, setCompanyUsers] = useState<User[]>([]);
  const [companyGroups, setCompanyGroups] = useState<Group[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);
  const [adminLessons, setAdminLessons] = useState<Lesson[]>([]);
  const [deadlineAt, setDeadlineAt] = useState<string>("");
  const [userSearch, setUserSearch] = useState("");
  
  const isGroupMode = activeTab === "group";

  useEffect(() => {
    async function fetchCompanyUsers() {
      try {
        const response = await getCompanyUsers(userSearch);
        const userData = response.data.users || response.data.data || [];
        setCompanyUsers(userData);
      } catch (error) {
        console.log(error);
      }
    }
    fetchCompanyUsers();
  }, [userSearch]);

  useEffect(() => {
    async function fetchGroups() {
      try {
        const response = await getCompanyGroups();

        const groupsData = response.data.groups || response.data.data || [];
        console.log("groupsData", groupsData);
        setCompanyGroups(groupsData);
      } catch (error) {
        console.log(error);
      }
    }
    fetchGroups();
  }, [activeTab]);
  

  const toggleUserSelection = (userId: string) => {
    if (!userId) return;
    setSelectedUsers((prev: any) =>
      prev.includes(userId) ? prev.filter((id: string) => id !== userId) : [...prev, userId]
    );
  };

  const toggleGroupSelection = (groupId: string) => {
    if (!groupId) return;
    setSelectedGroups((prev: any) =>
      prev.includes(groupId) ? prev.filter((id: string) => id !== groupId) : [...prev, groupId]
    );
  };

  const toggleLessonSelection = (lessonId: string) => {
    if (!lessonId) return;
    setSelectedLessons((prev: any) =>
      prev.includes(lessonId) ? prev.filter((id: string) => id !== lessonId) : [...prev, lessonId]
    );
  };

  const handleAssign = async () => {
    try {
      let response;
      if(isGroupMode){
        response = await assignLessonToGroup(
          selectedGroups,
          selectedLessons,
          deadlineAt
        );
      }else{
        response = await assignLesson(
          selectedUsers,
          selectedLessons,
          deadlineAt
        );
      }
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to assign lesson");
    }
  };

  const handleClear = () => {
    setSelectedUsers([]);
    setSelectedGroups([]);
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

  const allAvailableLessons = lessons.concat(adminLessons);
  const selectedLessonsData = allAvailableLessons.filter((l) => selectedLessons.includes((l._id || l.id) as string));

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

            <div className="flex border-b border-gray-100 mb-10">
              <button
                onClick={() => setActiveTab("user")}
                className={`flex items-center gap-2 px-6 py-3 font-bold text-sm tracking-tight transition-all border-b-2 ${
                  activeTab === "user"
                    ? "border-[#D0864B] text-[#D0864B]"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                <UserIcon size={18} />
                Assign by User
              </button>
              <button
                onClick={() => setActiveTab("group")}
                className={`flex items-center gap-2 px-6 py-3 font-bold text-sm tracking-tight transition-all border-b-2 ${
                  activeTab === "group"
                    ? "border-[#D0864B] text-[#D0864B]"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                <Users size={18} />
                Assign by Group
              </button>
            </div>


            <div className="flex flex-col lg:flex-row gap-12">
              <div className="flex-1">
                {activeTab === "user" ? (
                  <UserSelectionList
                    users={companyUsers}
                    selectedUsers={selectedUsers}
                    onToggleUser={toggleUserSelection}
                    onSearch={setUserSearch}
                  />
                ) : (
                  <GroupSelectionList
                    groups={companyGroups}
                    selectedGroups={selectedGroups}
                    onToggleGroup={toggleGroupSelection}
                  />
                )}
              </div>

              <div className={isGroupMode ? "lg:w-96 shrink-0" : "lg:w-80 shrink-0"}>
                <AssignmentSummary
                  key={activeTab}
                  selectedUserCount={isGroupMode ? selectedGroups.length : selectedUsers.length}
                  selectedLessonCount={selectedLessons.length}
                  onAssign={handleAssign}
                  onClear={handleClear}
                  deadlineAt={deadlineAt}
                  setDeadlineAt={setDeadlineAt}
                  isGroupMode={isGroupMode}
                  selectedLessonsData={selectedLessonsData}
                />
              </div>
            </div>

            <div className="mt-12 pt-12 border-t border-gray-50">
              <h4 className={`text-sm font-black uppercase tracking-widest mb-8 ${isGroupMode ? "text-gray-900" : "text-gray-900 text-center"}`}>
                {isGroupMode ? "Select Lessons to Assign" : "Select Practice Material"}
              </h4>
              <LessonSelectionGrid
                key={activeTab}
                lessons={allAvailableLessons}
                selectedLessons={selectedLessons}
                onToggleLesson={toggleLessonSelection}
                isGroupMode={isGroupMode}
              />
            </div>
          </div>

          {/* Progress Tracking Section */}
          <div className="mt-12">
            <PendingAssignments />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lessons;

