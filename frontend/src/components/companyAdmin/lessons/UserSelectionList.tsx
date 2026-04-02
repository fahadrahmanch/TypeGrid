import React, { useState } from "react";
import { Search, User as UserIcon, Check } from "lucide-react";

export interface User {
  _id?: string;
  id?: string;
  name?: string;
  fullname?: string;
  email?: string;
  progress?: string | number;
  level?: string;
}

interface UserSelectionListProps {
  users: User[];
  selectedUsers: string[];
  onToggleUser: (userId: string) => void;
}

const UserSelectionList: React.FC<UserSelectionListProps> = ({
  users,
  selectedUsers,
  onToggleUser,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter((user) => {
    const name = user.name || user.fullname || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full bg-white/40 backdrop-blur-md rounded-3xl border border-[#ECA468]/10 overflow-hidden">
      <div className="p-6 border-b border-gray-50 bg-white/40">
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D0864B] transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#ECA468]/10 focus:border-[#ECA468] transition-all font-bold text-gray-700 shadow-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar min-h-[400px]">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-60 py-12">
            <UserIcon size={48} className="mb-4" />
            <p className="font-bold text-sm uppercase tracking-widest">
              No users found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
            {filteredUsers.map((user) => {
              const userId = user._id || user.id || "";
              const userName = user.name || user.fullname || "Student";
              const isSelected = selectedUsers.includes(userId);

              return (
                <button
                  key={userId}
                  onClick={() => onToggleUser(userId)}
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
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-[#ECA468]/10 text-[#D0864B]"
                    }`}
                  >
                    <UserIcon size={20} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4
                      className={`font-black text-sm transition-colors ${
                        isSelected ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {userName}
                    </h4>
                    <p
                      className={`text-[10px] uppercase font-bold tracking-widest transition-colors ${
                        isSelected ? "text-white/70" : "text-gray-400"
                      }`}
                    >
                      {user.email ||
                        (typeof user.progress === "string"
                          ? user.progress
                          : "Student")}
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

export default UserSelectionList;
