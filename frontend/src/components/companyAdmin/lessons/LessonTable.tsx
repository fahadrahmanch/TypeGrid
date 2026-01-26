import React, { useEffect, useState } from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import EditLessonModal from './EditLessonModal';
import { deleteLesson } from '../../../api/companyAdmin/lessons';
import { toast } from 'react-toastify';
export interface Lesson {
    id: string;
    title: string;
    difficulty: string;
    assigned?: number;
    completed?: number;
    avgWpm?: number;
    level?: string;
    completionRate: number;
}



const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
        case 'beginner': return 'bg-green-100 text-green-700';
        case 'intermediate': return 'bg-yellow-100 text-yellow-700';
        case 'advanced': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};

const LessonTable: React.FC<{ lessons: Partial<Lesson>[],setLessons:any }> = ({ lessons,setLessons }) => {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [limit] = useState(5);

    const [filteredLessons, setFilteredLessons] = useState(lessons);
    const [isOpenEditModal, setOpenEditModal] = useState(false);
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

    useEffect(() => {
        const total = Math.ceil(lessons.length / limit);
        setTotalPages(total);

        const start = (page - 1) * limit;
        const paginated = lessons.slice(start, start + limit);

        setFilteredLessons(paginated);

    }, [page, lessons]);
    async function handleDeleteLesson(id:string){
        try {
            const response = await deleteLesson(id)
            if(response){
                setLessons((prev: any) =>
  prev.filter((lesson: any) => lesson.id !== id)
);
            toast.success("Lesson deleted successfully")
            }
            
            
        } catch (error) {
            console.log("error",error)
            toast.error("Failed to delete lesson")
        }
    }       
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">All Lessons</h2>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-left border-b border-gray-100">
                            <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lesson</th>
                            <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Difficulty</th>
                            <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned</th>
                            <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Completed</th>
                            <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg WPM</th>
                            <th className="pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredLessons?.map((lesson) => (
                            <tr key={lesson.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="py-4 text-sm font-medium text-gray-900">{lesson.title}</td>
                                <td className="py-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(lesson?.level || '')}`}>
                                        {lesson?.level}
                                    </span>
                                </td>
                                <td className="py-4 text-sm text-gray-600">{lesson.assigned}</td>
                                <td className="py-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <span>{lesson.completed}</span>
                                        <span className="text-xs text-gray-400">({lesson.completionRate}%)</span>
                                    </div>
                                </td>
                                <td className="py-4 text-sm text-gray-600 font-semibold">{lesson.avgWpm} WPM</td>
                                <td className="py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                setSelectedLessonId(lesson.id as string);
                                                setOpenEditModal(true);
                                            }}
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors border border-blue-200">
                                            <Edit3 size={16} />

                                        </button>
                                        <button 
                                        onClick={()=>handleDeleteLesson(lesson.id as string)}
                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors border border-red-200">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center items-center gap-4 mt-4 flex-wrap">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                    Prev
                </button>
                <span className="tlesson}ext-sm sm:text-base">
                    Page {page} of {totalPages}
                </span>
                <button
                    disabled={page === totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
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
