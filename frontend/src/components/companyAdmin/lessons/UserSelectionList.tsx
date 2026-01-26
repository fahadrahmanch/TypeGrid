import React from 'react';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
export interface User {
    id: number;
    name: string;
    progress: string;
    level: string;
}

interface UserSelectionListProps {
    users: User[];
    selectedUsers: string[];
    onToggleUser: (userId: string) => void;
}

const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
        case 'beginner': return 'bg-green-100 text-green-700';
        case 'intermediate': return 'bg-yellow-100 text-yellow-700';
        case 'advanced': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};


const UserSelectionList: React.FC<UserSelectionListProps> = ({ users, selectedUsers, onToggleUser }) => {
    const [filteredUsers, setFilteredUsers] = React.useState<User[]>(users);
        const [search, setSearch] = useState("");
  useEffect(() => {
        setFilteredUsers(users);
    }, [users]);

         const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);

        const filtered = users.filter(user =>
            user.name.toLowerCase().startsWith(value)
        );

        setFilteredUsers(filtered);
    };


    return (
        <div className="flex-1">
            <h3 className="font-semibold text-gray-800 mb-4">Select Users</h3>
            <div className="relative mb-4">
                 <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                />
                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search users by name..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50"
                />
            </div>

            <div className="space-y-2">
                {filteredUsers.map((user:any) => (
                    <div
                        key={user._id}
                        onClick={() => onToggleUser(user._id)}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${selectedUsers.includes(user._id)
                            ? 'border-blue-500 bg-blue-50/50'
                            : 'border-transparent hover:bg-gray-50'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedUsers.includes(user._id) ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                                }`}>
                                {selectedUsers.includes(user._id) && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.progress}</p>
                            </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase ${getDifficultyColor("beginner")}`}>
                            Beginner
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserSelectionList;
