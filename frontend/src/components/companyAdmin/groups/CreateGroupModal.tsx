import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { fetchCompanyUsers } from "../../../api/companyAdmin/companyAdminService";
import { createCompanyGroup } from "../../../api/companyAdmin/companyGroup";
interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose }) => {
    const [groupName, setGroupName] = useState("");
    const [groupType, setGroupType] = useState("beginner");
    const [groupingMethod, setGroupingMethod] = useState<"auto" | "manual">("auto"); // 'auto' or 'manual'

    // Auto Criteria State
    const [minWpm, setMinWpm] = useState("0");
    const [maxWpm, setMaxWpm] = useState("50");
    const [minAccuracy, setMinAccuracy] = useState("0");
    const [users, setUsers] = useState<any[]>([]);
    // Manual Selection State
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    
    console.log("values",groupName,groupType,selectedUsers);
     
    const handleUserSelect = (id: string) => {
        setSelectedUsers((prev) =>
            prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetchCompanyUsers();
            console.log("Response", response.data.data);
            setUsers(response.data.data);
        };
        fetchUsers();
    }, []);
    if (!isOpen) return null;
   async function handleSubmit(){
        try{
        const response = await createCompanyGroup({
            groupName,
            groupType,
            // groupingMethod,
            // minWpm,
            // maxWpm,
            // minAccuracy,
            selectedUsers
        });
        console.log("Response", response.data);
        }
        catch(error){
            console.log("Error", error);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl scale-100 transition-all">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Create New Group</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Group Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Group Name</label>
                        <input
                            type="text"
                            placeholder="Enter group name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                        />
                    </div>

                    {/* Group Type */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Group Type</label>
                        <div className="relative">
                            <select
                                value={groupType}
                                onChange={(e) => setGroupType(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm appearance-none cursor-pointer"
                            >
                                <option value="beginner">Beginner Users</option>
                                <option value="intermediate">Intermediate Users</option>
                                <option value="advanced">Advanced Users</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    {/* Grouping Method */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700">Grouping Method</label>
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${groupingMethod === "auto" ? "border-blue-600" : "border-gray-300 group-hover:border-blue-400"}`}>
                                    {groupingMethod === "auto" && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                                </div>
                                <input
                                    type="radio"
                                    name="groupingMethod"
                                    value="auto"
                                    checked={groupingMethod === "auto"}
                                    onChange={() => setGroupingMethod("auto")}
                                    className="hidden"
                                />
                                <span className="text-sm text-gray-700">Auto-group by criteria</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${groupingMethod === "manual" ? "border-blue-600" : "border-gray-300 group-hover:border-blue-400"}`}>
                                    {groupingMethod === "manual" && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                                </div>
                                <input
                                    type="radio"
                                    name="groupingMethod"
                                    value="manual"
                                    checked={groupingMethod === "manual"}
                                    onChange={() => setGroupingMethod("manual")}
                                    className="hidden"
                                />
                                <span className="text-sm text-gray-700">Select users manually</span>
                            </label>
                        </div>
                    </div>

                    {/* Dynamic Content Area */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 transition-all duration-300">
                        {groupingMethod === "auto" ? (
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">Auto-grouping Criteria</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Min WPM</label>
                                        <input
                                            type="number"
                                            value={minWpm}
                                            onChange={(e) => setMinWpm(e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Max WPM</label>
                                        <input
                                            type="number"
                                            value={maxWpm}
                                            onChange={(e) => setMaxWpm(e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Min Accuracy (%)</label>
                                    <input
                                        type="number"
                                        value={minAccuracy}
                                        onChange={(e) => setMinAccuracy(e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-900 mb-2">Select Users</h3>
                                <div className="max-h-48 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                                    {users.map((user: any) => (
                                        <label key={user._id || user.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-200 transition-colors">
                                            <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedUsers.includes(user._id || user.id) ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}>
                                                {selectedUsers.includes(user._id || user.id) && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={selectedUsers.includes(user._id )}
                                                onChange={() => handleUserSelect(user._id)}
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">{user.name}</span>
                                                <span className="text-xs text-gray-500">WPM: {user.wpm || "-"} | Accuracy: {user.accuracy || "-"}%</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                    onClick={handleSubmit}
                    className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:translate-y-px transition-all">
                        Create Group
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateGroupModal;
