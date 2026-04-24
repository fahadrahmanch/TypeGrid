import React, { useEffect,useState } from "react";
import { Users, Check } from "lucide-react";

export interface Group {
  _id?: string;
  id?: string;
  name: string;
  members: string[];
  avgProgress?: number;
}

interface GroupSelectionListProps {
  groups: Group[];
  selectedGroups: string[];
  onToggleGroup: (groupId: string) => void;
}

const GroupSelectionList: React.FC<GroupSelectionListProps> = ({ groups, selectedGroups, onToggleGroup }) => {

  return (
    <div className="flex flex-col h-full bg-white/40 backdrop-blur-md rounded-3xl border border-[#ECA468]/10 overflow-hidden">
      <div className="p-6 border-b border-gray-50 bg-white/40">
        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest pl-2">Available Company Groups</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar min-h-[400px]">
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60 py-12">
            <Users size={48} className="mb-4" />
            <p className="font-bold text-sm uppercase tracking-widest">No groups found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
            {groups.map((group) => {
              const groupId = group._id || group.id || "";
              const isSelected = selectedGroups.includes(groupId);

              return (
                <button
                  key={groupId}
                  onClick={() => onToggleGroup(groupId)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 text-left group overflow-hidden relative ${
                    isSelected
                      ? "bg-[#D0864B] border-[#D0864B] shadow-lg shadow-[#D0864B]/20"
                      : "bg-white border-gray-100 hover:border-[#ECA468] hover:shadow-md"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 text-white">
                      <div className="bg-white/20 rounded-full p-1 backdrop-blur-md">
                        <Check size={12} strokeWidth={4} />
                      </div>
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-xl transition-colors ${
                      isSelected ? "bg-white/20 text-white" : "bg-[#ECA468]/10 text-[#D0864B]"
                    }`}
                  >
                    <Users size={20} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-black text-sm transition-colors ${isSelected ? "text-white" : "text-gray-800"}`}
                    >
                      {group.name}
                    </h4>
                    <p
                      className={`text-[10px] uppercase font-bold tracking-widest transition-colors ${
                        isSelected ? "text-white/70" : "text-gray-400"
                      }`}
                    >
                      {group.members?.length || 0} Members
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupSelectionList;

