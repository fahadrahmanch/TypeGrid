import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CompanyUserNavbar from "../../components/companyUser/layout/companyUserNavbar";
import { Sparkles } from "lucide-react";
import { generatePracticeText } from "../../api/companyUser/practice";
import { toast } from "react-toastify";

const TypingPracticeLLM: React.FC = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.info("Please enter a prompt first!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await generatePracticeText(prompt);
      const generatedText = response.data?.text || "The quick brown fox jumps over the lazy dog."; // Fallback for mock

      navigate("/company/user/practice-area", {
        state: {
          text: generatedText,
          title: "Custom Practice",
          type: "custom",
        },
      });
    } catch (error) {
      console.error("Failed to generate practice text", error);
      toast.error("Failed to generate practice. Please try again.");

      // For development/demo purposes, navigate anyway if it fails but we want to show the area
      /*
      navigate("/company/user/practice-area", { 
        state: { 
          text: "Typing is an essential skill in the digital age. It allows for efficient communication and productivity.",
          title: "Sample Practice",
          type: "custom"
        } 
      });
      */
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8EA] pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <CompanyUserNavbar />

      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dynamic Practice</h1>
          <p className="text-gray-500">Master your typing with custom AI-generated content or curated collections.</p>
        </div>

        {/* LLM Generator Card */}
        <div className="bg-[#FFF3DB]/50 rounded-3xl p-8 border border-orange-100 shadow-xl shadow-orange-900/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl -mr-20 -mt-20"></div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-400 rounded-2xl shadow-lg shadow-orange-400/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Generate Custom Practice</h2>
            </div>

            <div className="space-y-2">
              <label htmlFor="prompt" className="text-sm font-medium text-gray-600 ml-1">
                Enter Prompt (e.g., 'Generate a sentence about technology')
              </label>
              <textarea
                id="prompt"
                rows={3}
                className="w-full bg-[#FEFCE8] border-2 border-orange-100/50 rounded-2xl p-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-300 transition-all resize-none shadow-sm"
                placeholder="What would you like to type about today?"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className={`flex items-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/25 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              {isLoading ? "Generating..." : "Generate Practice"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingPracticeLLM;
