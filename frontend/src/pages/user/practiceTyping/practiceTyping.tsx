import Navbar from "../../../components/user/Navbar";
import TypingKid from "../../../assets/images/typingImages/PracticeTyping.png";
import { useState } from "react";
import { getTypingPracticeContent } from "../../../api/user/typingPracticeService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const PracticeTyping: React.FC = () => {
  type Difficulty = "beginner"|"intermediate"| "advanced"
  type Category = "sentence" | "paragraph"

  const [difficulty, setDifficulty] = useState<Difficulty>("beginner");
  const [category, setCategory] = useState<Category>("sentence");

  const navigate=useNavigate();
  const handleStart = async () => {
    try{
      const fetchLesson=await getTypingPracticeContent(difficulty,category);
      const lesson=fetchLesson.data.lesson;
      if(!lesson){
        toast.error("No lesson found for the selected options.");
        return;
      }
      
      navigate(`/typing/practice/${lesson.id}`);
      
    }
    catch(error: any){
      console.error("Error fetching lesson:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
    
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#FFF6E8] flex items-center justify-center">
        <div className="w-full max-w-5xl px-6 py-10 text-center">

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            TypeGrid Practice
          </h1>
          <p className="text-gray-600 mb-10">
            Improve your typing speed and accuracy with our comprehensive
            practice system. Choose your difficulty level and practice category
            to start practicing.
          </p>

          {/* Illustration */}
          <div className="flex justify-center mb-12">
            <img src={TypingKid} alt="Typing Illustration" className="w-64" />
          </div>

          {/* Difficulty Section */}
          <div className="text-left mb-10">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              🏆 Choose Difficulty Level
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Easy */}
              <div
                onClick={() => setDifficulty("beginner")}
                className={`rounded-xl p-6 cursor-pointer transition
                  ${difficulty === "beginner"
                    ? "border-2 border-orange-400 bg-[#FFF1DC] shadow-md"
                    : "border hover:shadow-md"}
                `}
              >
                <h3 className="font-semibold text-gray-900 mb-1">Easy</h3>
                <p className="text-sm text-gray-600">
                  Perfect for beginners
                </p>
              </div>

              {/* Medium */}
              <div
                onClick={() => setDifficulty("intermediate")}
                className={`rounded-xl p-6 cursor-pointer transition
                  ${difficulty === "intermediate"
                    ? "border-2 border-orange-400 bg-[#FFF1DC] shadow-md"
                    : "border hover:shadow-md"}
                `}
              >
                <h3 className="font-semibold text-gray-900 mb-1">Medium</h3>
                <p className="text-sm text-gray-600">
                  Intermediate challenge
                </p>
              </div>

              {/* Hard */}
              <div
                onClick={() => setDifficulty("advanced")}
                className={`rounded-xl p-6 cursor-pointer transition
                  ${difficulty === "advanced"
                    ? "border-2 border-orange-400 bg-[#FFF1DC] shadow-md"
                    : "border hover:shadow-md"}
                `}
              >
                <h3 className="font-semibold text-gray-900 mb-1">Hard</h3>
                <p className="text-sm text-gray-600">
                  Expert level typing
                </p>
              </div>

            </div>
          </div>

          {/* Practice Category */}
          <div className="text-left mb-12">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              📘 Practice Categories
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Paragraphs */}
              <div
                onClick={() => setCategory("paragraph")}
                className={`rounded-xl p-6 cursor-pointer transition
                  ${category === "paragraph"
                    ? "border-2 border-orange-400 bg-[#FFF1DC] shadow-md"
                    : "border hover:shadow-md"}
                `}
              >
                <h3 className="font-semibold text-gray-900 mb-1">Paragraphs</h3>
                <p className="text-sm text-gray-600">
                  Practice typing longer paragraphs
                </p>
              </div>

              {/* Sentences */}
              <div
                onClick={() => setCategory("sentence")}
                className={`rounded-xl p-6 cursor-pointer transition
                  ${category === "sentence"
                    ? "border-2 border-orange-400 bg-[#FFF1DC] shadow-md"
                    : "border hover:shadow-md"}
                `}
              >
                <h3 className="font-semibold text-gray-900 mb-1">Sentences</h3>
                <p className="text-sm text-gray-600">
                  Practice typing full sentences
                </p>
              </div>

            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            className="bg-orange-300 hover:bg-orange-400 text-gray-900 font-semibold px-10 py-3 rounded-full transition"
          >
            ▶ Start Practicing
          </button>

        </div>
      </div>
    </>
  );
  };

export default PracticeTyping;
