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
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="relative w-full max-w-lg bg-[#FFF8EA] rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-8 py-6 flex justify-between items-center bg-white/40">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6 custom-scrollbar">
          {/* Date Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Date</label>
            <CustomCalendar 
              selectedDate={values.date}
              onSelect={(date) => onChange("date", date)}
            />
          </div>

          {/* Challenge Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Challenge</label>
            <div className="relative">
              <select
                value={values.challengeId}
                onChange={(e) => onChange("challengeId", e.target.value)}
                className="w-full px-4 py-3 bg-white/60 rounded-xl border border-transparent focus:bg-white outline-none transition-all text-gray-800 appearance-none cursor-pointer font-medium"
              >
                <option value="">Select a Challenge</option>
                {challenges.map((challenge) => (
                  <option key={challenge._id} value={challenge._id}>
                    {challenge.title}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-4 py-2">
            {/* <div 
              onClick={() => onChange('isActive', !values.isActive)}
              className={`w-12 h-6 rounded-full relative transition-all duration-300 cursor-pointer ${values.isActive ? 'bg-[#ECA468]' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 transform ${values.isActive ? 'translate-x-7' : 'translate-x-1'}`} />
            </div> */}  
            {/* <span className="text-xs font-black uppercase tracking-widest text-gray-500">
              {values.isActive ? 'Active' : 'Inactive'}
            </span> */}
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-6">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-white/50 text-gray-500 font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-gray-700 transition-all border border-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className="px-8 py-2.5 rounded-xl bg-[#ECA468] text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#D0864B] transition-all shadow-lg shadow-[#ECA468]/20"
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
