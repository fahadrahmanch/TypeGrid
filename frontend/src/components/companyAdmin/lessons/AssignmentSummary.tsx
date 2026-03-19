import React from "react";
import { Calendar, Clock, User } from "lucide-react";

interface AssignmentSummaryProps {
  selectedUserCount: number;
  selectedLessonCount: number;
  onAssign: () => void;
  onClear: () => void;
  deadlineAt: string;
  setDeadlineAt: (date: string) => void;
}

const AssignmentSummary: React.FC<AssignmentSummaryProps> = ({
  selectedUserCount,
  selectedLessonCount,
  onAssign,
  onClear,
  deadlineAt,
  setDeadlineAt,
}) => {
  return (
    <div className="bg-[#FFF8EA] rounded-3xl p-8 border border-[#ECA468]/30 shadow-sm relative overflow-hidden group">
      {/* Decorative background element */}
      <div className="absolute -right-12 -top-12 w-32 h-32 bg-[#ECA468]/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
      
      <h3 className="text-sm font-black text-[#D0864B] uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
        <Calendar size={18} /> Assignment Task
      </h3>

      <div className="space-y-8 relative">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-[#ECA468]/10 shadow-sm">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Students</span>
            <span className="text-2xl font-black text-gray-900">{selectedUserCount}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#ECA468]/10 shadow-sm">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Materials</span>
            <span className="text-2xl font-black text-gray-900">{selectedLessonCount}</span>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3 ml-1">
            Deadline Date
          </label>
          <div className="relative">
            <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D0864B]" />
            <input
              type="date"
              value={deadlineAt}
              onChange={(e) => setDeadlineAt(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white border border-[#ECA468]/20 rounded-2xl outline-none focus:ring-4 focus:ring-[#ECA468]/10 transition-all font-bold text-gray-700 shadow-sm text-sm"
            />
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <button
            onClick={onAssign}
            disabled={selectedUserCount === 0 || selectedLessonCount === 0}
            className="w-full py-5 bg-[#D0864B] hover:bg-[#B36E39] text-white rounded-2xl font-black shadow-lg shadow-[#D0864B]/20 transition-all uppercase tracking-widest text-xs disabled:opacity-30 flex items-center justify-center gap-2 group/btn"
          >
            <User size={16} />
            <span>Deploy Material</span>
          </button>
          
          <button
            onClick={onClear}
            className="w-full py-4 text-gray-400 hover:text-gray-600 font-black transition-all uppercase tracking-widest text-[10px]"
          >
            Clear All Selections
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentSummary;
