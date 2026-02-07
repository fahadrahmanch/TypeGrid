import React from "react";
import { Lesson } from "./LessonTable"; // Reuse existing interface
import { useState, useEffect } from "react";
interface LessonSelectionGridProps {
    lessons: Lesson[];
    selectedLessons: string[];
    onToggleLesson: (lessonId: string) => void;
}

const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
        case "beginner": return "bg-green-100 text-green-700";
        case "intermediate": return "bg-yellow-100 text-yellow-700";
        case "advanced": return "bg-red-100 text-red-700";
        default: return "bg-gray-100 text-gray-700";
    }
};
const LessonSelectionGrid: React.FC<LessonSelectionGridProps> = ({ lessons,selectedLessons,onToggleLesson }) => {
    const [filteredLessons,setFilteredLessons] = useState<any>(lessons);
    const [filter,setFilter] = useState<string>("all");
    useEffect(()=>{
        if(filter === "all"){
            setFilteredLessons(lessons);
        }else if(filter === "company"){
            setFilteredLessons(lessons.filter((lesson:any) => lesson.companyId));
        }else if(filter === "admin"){
            setFilteredLessons(lessons.filter((lesson:any) => !lesson.companyId));
        }
    },[filter,lessons]);
    return (
        <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Select Lessons</h3>
                <div className="flex gap-2">
                    <button onClick={()=>setFilter("all")} className={`px-3 py-1 ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"} text-xs rounded-md transition-colors`}>All Lessons</button>
                    <button onClick={()=>setFilter("company")} className={`px-3 py-1 ${filter === "company" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"} text-xs rounded-md transition-colors`}>Company Lessons</button>
                    <button onClick={()=>setFilter("admin")} className={`px-3 py-1 ${filter === "admin" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"} text-xs rounded-md transition-colors`}>Admin Lessons</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Lesson Cards for Selection */}
                {filteredLessons.slice(0, 4).map((lesson:any) => (
<div
  onClick={() => onToggleLesson(lesson.id)}
  key={`select-${lesson.id}`}
  className={`
    p-4 rounded-lg cursor-pointer transition-all bg-white group
    border
    ${
      selectedLessons.includes(lesson.id)
        ? "border-blue-500 bg-blue-50"
        : "border-gray-100 hover:border-blue-300 hover:shadow-sm"
    }
  `}
>                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">{lesson.title}</h4>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getDifficultyColor(lesson?.level || "")}`}>{lesson.level}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3 text-start">
                            {lesson?.text?.length > 30
                                ? lesson?.text?.slice(0, 30) + "..."
                                : lesson?.text}
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-600">5 min</span>
                            <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-600">{lesson?.text?.split(" ").length} words</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LessonSelectionGrid;
