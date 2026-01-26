import React from 'react';
import { User } from 'lucide-react';

interface AssignmentSummaryProps {
    selectedUserCount: number;
    selectedLessonCount: number; // For now assuming just count, can be complex object later
    onAssign: () => void;
    onClear: () => void;
    setDeadlineAt: React.Dispatch<React.SetStateAction<string>>;
    deadlineAt:string;
}

const AssignmentSummary: React.FC<AssignmentSummaryProps> = ({ selectedUserCount, selectedLessonCount, onAssign, onClear,setDeadlineAt,deadlineAt }) => {
    return (
        <div className="w-full lg:w-80">
            <h3 className="font-semibold text-gray-800 mb-4">Assignment Summary</h3>

            <div className="space-y-6">
                <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Selected Users:</p>
                    {selectedUserCount === 0 ? (
                        <p className="text-sm text-gray-400 italic">No users selected</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            <span className="text-sm text-gray-700">{selectedUserCount} users selected</span>
                        </div>
                    )}
                </div>

                <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Selected Lessons:</p>
                    {selectedLessonCount === 0 ? (
                        <p className="text-sm text-gray-400 italic">No lessons selected</p>
                    ) : (
                        <span className="text-sm text-gray-700">{selectedLessonCount} lessons selected</span>
                    )}

                </div>
<div>
  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
    Deadline
  </p>

  <input
    type="date"
    value={deadlineAt}
    onChange={(e) => setDeadlineAt(e.target.value)}
    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
  />
</div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <button
                        disabled={selectedUserCount === 0}
                        onClick={onAssign}
                        className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                        <User size={16} /> Assign Lessons
                    </button>
                    <button
                        onClick={onClear}
                        className="w-full text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        Clear Selection
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignmentSummary;
