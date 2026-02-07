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
    const [adminLessons,setAdminLessons]=useState<Lesson[]>([]);
    const [deadlineAt, setDeadlineAt] = useState<string>("");

   useEffect(()=>{
        async function fetchCompanyUsers(){
            try{
                const response = await getCompanyUsers();
                setCompanyUsers(response.data.data);
            }catch(error){
                console.log(error);
            }
        }
        fetchCompanyUsers();
    },[]);
    const toggleUserSelection = (userId: string) => {
        setSelectedUsers((prev:any) =>
            prev.includes(userId) ? prev.filter((id:string) => id !== userId) : [...prev, userId]
        );
    };

    const toggleLessonSelection = (lessonId: string) => {
        setSelectedLessons((prev:any) =>
            prev.includes(lessonId) ? prev.filter((id:string) => id !== lessonId) : [...prev, lessonId]
        );
    };

    const handleAssign = async () => {
        
        try{
        const response=await assignLesson(selectedUsers,selectedLessons,deadlineAt);
        toast.success(response.data.message);
        }
        catch(error:any){
            toast.error(error.data.message);
        }
    };

    const handleClear = () => {
        setSelectedUsers([]);
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
    
   

   
    useEffect(()=>{
        async function fetchAdminLessons(){
            try{
                const response = await getAdminLessons();
                const adminLessonsData = response.data.lessons;
                setAdminLessons(adminLessonsData);
            }catch(error){
                console.log(error);
            }
        }
        fetchAdminLessons();
    },[]);
    
    return (
        <div className="flex min-h-screen bg-[#fff8ea]">
            <CompanyAdminSidebar />
            <CreateLessonModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} setLessons={setLessons} />

            <div className="flex-1 p-8 overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 font-jaini">Lesson Management</h1>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-md"
                    >
                        <Plus size={20} />
                        <span>Create New Lesson</span>
                    </button>
                </div>

                {/* Lessons List Section */}

                {<LessonTable lessons={lessons} setLessons={setLessons}/>}
                
                {/* Assignment Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex border-b border-gray-100 mb-6">
                        <button className="flex items-center gap-2 px-4 py-2 border-b-2 border-blue-500 text-blue-600 font-medium text-sm">
                            Assign by User
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700 font-medium text-sm">
                            Assign by Group
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700 font-medium text-sm">
                            View Progress
                        </button>
                    </div>
               
                    <div className="flex flex-col lg:flex-row gap-8">
                        <UserSelectionList
                            users={companyUsers}
                            selectedUsers={selectedUsers}
                            onToggleUser={toggleUserSelection}
                        
                            
                            
                            
                        />

                        <AssignmentSummary
                            selectedUserCount={selectedUsers.length}
                            selectedLessonCount={selectedLessons.length}
                            onAssign={handleAssign}
                            onClear={handleClear}
                            deadlineAt={deadlineAt}
                            setDeadlineAt={setDeadlineAt}
                        />
                    </div>

                    <LessonSelectionGrid lessons={lessons.concat(adminLessons)} selectedLessons={selectedLessons} onToggleLesson={toggleLessonSelection} />
                </div>
            </div>
        </div>
    );
};

export default Lessons;