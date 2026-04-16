import React, { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { addMemberToGroup, getCompanyUsersWithStatus } from "../../../api/companyAdmin/companyGroup";
import { GroupMember } from "../../../types/group";
import { toast } from "react-toastify";

interface AddUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  onUserAdded?: () => void;
}

// Users list will be fetched from the backend

const AddUsersModal: React.FC<AddUsersModalProps> = ({ isOpen, onClose, groupId, onUserAdded }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<GroupMember[]>([]);
  const [addingUser, setAddingUser] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isOpen) return;
      try {
        const response = await getCompanyUsersWithStatus();
        setUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [isOpen]);

  const handleAddUser = async (userId: string) => {
    try {
      setAddingUser(userId);
      await addMemberToGroup(groupId, userId);
      toast.success("User added to group");
      if (onUserAdded) onUserAdded();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add user");
    } finally {
      setAddingUser(null);
    }
  };

  if (!isOpen) return null;

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold border border-pink-200">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 text-sm">{user.name}</span>
                      <span className="text-xs text-gray-500 font-medium">
                        WPM: <span className="text-gray-700">{user.wpm || 0}</span> <span className="mx-1">|</span>{" "}
                        Accuracy: <span className="text-gray-700">{user.accuracy || 0}%</span>
                      </span>
                    </div>
                  </div>
                  <button
                    disabled={addingUser === user._id}
                    onClick={() => handleAddUser(user._id)}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg shadow-sm shadow-blue-200 hover:bg-blue-700 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingUser === user._id ? "Adding..." : "Add"}
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm font-medium">No users found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUsersModal;
