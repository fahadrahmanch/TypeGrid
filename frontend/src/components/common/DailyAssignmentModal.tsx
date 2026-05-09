import React from "react";
import { X } from "lucide-react";
import CustomCalendar from "./CustomCalendar";

interface DailyAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  mode: "add" | "edit";
  values: {
    date: string;
    challengeId: string;
  };
  challenges: any[];
  onChange: (name: string, value: any) => void;
  onSubmit: () => void;
}

const DailyAssignmentModal: React.FC<DailyAssignmentModalProps> = ({
  isOpen,
  onClose,
  title,
  mode,
  values,
  challenges,
  onChange,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 p-4">
      <div className="relative w-full max-w-md bg-[#FFF8EA] rounded-2xl md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] md:max-h-[90vh] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-5 md:px-10 py-4 md:py-8 border-b border-[#ECA468]/10 bg-white/40 flex justify-between items-center">
          <div>
            <h2 className="text-lg md:text-2xl font-black text-gray-900 leading-tight">{title}</h2>
            <p className="text-[8px] md:text-xs text-[#D0864B] font-bold uppercase tracking-widest mt-0.5">
              {mode === "edit" ? "Modify assignment" : "Schedule new challenge"}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-white rounded-lg transition-all"
          >
            <X className="w-4 h-4 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 md:px-10 py-5 md:py-8 space-y-4 md:space-y-6 custom-scrollbar bg-white/20">
          {/* Date Field */}
          <div className="space-y-1.5">
            <label className="text-[8px] md:text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Select Date</label>
            <CustomCalendar selectedDate={values.date} onSelect={(date) => onChange("date", date)} />
          </div>

          {/* Challenge Selection */}
          <div className="space-y-1.5">
            <label className="text-[8px] md:text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Challenge</label>
            <div className="relative">
              <select
                value={values.challengeId}
                onChange={(e) => onChange("challengeId", e.target.value)}
                className="w-full px-4 py-2.5 md:py-4 bg-white rounded-xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all text-gray-800 appearance-none cursor-pointer font-bold text-xs md:text-base shadow-sm"
              >
                <option value="">Select a Challenge</option>
                {challenges.map((challenge) => (
                  <option key={challenge._id} value={challenge._id}>
                    {challenge.title}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex flex-row justify-end gap-2 md:gap-3 pt-4 md:pt-10 border-t border-[#ECA468]/5">
            <button
              onClick={onClose}
              className="px-4 md:px-8 py-2 md:py-4 rounded-xl md:rounded-2xl bg-white text-gray-500 font-black text-[8px] md:text-xs uppercase tracking-widest border border-gray-100 hover:bg-gray-50 transition-all shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className="px-5 md:px-10 py-2 md:py-4 rounded-xl md:rounded-2xl bg-[#ECA468] text-white font-black text-[8px] md:text-xs uppercase tracking-widest hover:bg-[#D0864B] shadow-lg shadow-[#ECA468]/20 active:scale-95 hover:-translate-y-0.5"
            >
              {mode === "edit" ? "Update" : "Assign"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ECA468/40;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ECA468;
        }
      `}</style>
    </div>
  );
};

export default DailyAssignmentModal;
