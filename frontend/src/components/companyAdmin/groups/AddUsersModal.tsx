import React, { useState } from "react";
import { X, Search } from "lucide-react";

interface AddUsersModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Dummy users to search/add
const dummyUsers = [
    { id: 1, name: "Bob Smith", wpm: 75, accuracy: 95, initial: "B" },
    { id: 2, name: "Carol White", wpm: 95, accuracy: 98, initial: "C" },
    { id: 3, name: "David Brown", wpm: 40, accuracy: 88, initial: "D" },
    { id: 4, name: "Eve Davis", wpm: 60, accuracy: 92, initial: "E" },
];

const AddUsersModal: React.FC<AddUsersModalProps> = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState("");

    if (!isOpen) return null;

    const filteredUsers = dummyUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl scale-100 transition-all">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Add Users to Group</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                        />
                    </div>

                    {/* Users List */}
                    <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                        {filteredUsers.map(user => (
                            <div key={user.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold border border-pink-200">
                                        {user.initial}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-900 text-sm">{user.name}</span>
                                        <span className="text-xs text-gray-500 font-medium">WPM: <span className="text-gray-700">{user.wpm}</span> <span className="mx-1">|</span> Accuracy: <span className="text-gray-700">{user.accuracy}%</span></span>
                                    </div>
                                </div>
                                <button className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg shadow-sm shadow-blue-200 hover:bg-blue-700 hover:shadow-md transition-all">
                                    Add
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddUsersModal;
