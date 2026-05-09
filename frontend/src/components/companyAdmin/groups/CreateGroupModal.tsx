import React, { useState, useEffect } from "react";
import { X, Target, Users, Zap, Layers, ChevronRight } from "lucide-react";
import { fetchCompanyUsers } from "../../../api/companyAdmin/companyAdminService";
import { createCompanyGroup, createCompanyGroupAuto } from "../../../api/companyAdmin/companyGroup";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreated?: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose, onGroupCreated }) => {
  const [groupName, setGroupName] = useState("");
  const [groupType, setGroupType] = useState("beginner");
  const [groupingMethod, setGroupingMethod] = useState<"auto" | "manual">("auto");
  const [minWpm, setMinWpm] = useState("0");
  const [maxWpm, setMaxWpm] = useState("50");
  const [minAccuracy, setMinAccuracy] = useState("0");
  const [maxAccuracy, setMaxAccuracy] = useState("100");
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUserSelect = (id: string) => {
    setSelectedUsers((prev) => (prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]));
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetchCompanyUsers();
        setUsers(response.data.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    if (isOpen) fetchUsers();
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!groupName.trim()) {
      newErrors.groupName = "Group name is required";
    } else if (groupName.trim().length < 3) {
      newErrors.groupName = "Group name must be at least 3 characters";
    }

    if (groupingMethod === "auto") {
      if (parseFloat(minWpm) < 0) newErrors.minWpm = "Min WPM cannot be negative";
      if (parseFloat(maxWpm) < parseFloat(minWpm)) newErrors.maxWpm = "Max WPM cannot be less than Min WPM";
      if (parseFloat(minAccuracy) < 0 || parseFloat(minAccuracy) > 100)
        newErrors.minAccuracy = "Accuracy must be between 0 and 100";
      if (parseFloat(maxAccuracy) < parseFloat(minAccuracy))
        newErrors.maxAccuracy = "Max Accuracy cannot be less than Min Accuracy";
      if (parseFloat(maxAccuracy) > 100) newErrors.maxAccuracy = "Accuracy cannot exceed 100";
    } else {
      if (selectedUsers.length === 0) {
        newErrors.users = "Please select at least one user";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit() {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (groupingMethod === "auto") {
        await createCompanyGroupAuto({
          groupName,
          groupType,
          minWpm,
          maxWpm,
          minAccuracy,
          maxAccuracy,
        });
      } else {
        await createCompanyGroup({
          groupName,
          groupType,
          selectedUsers,
        });
      }
      setGroupName("");
      setGroupType("beginner");
      setGroupingMethod("auto");
      setMinWpm("0");
      setMaxWpm("50");
      setMinAccuracy("0");
      setMaxAccuracy("100");
      setSelectedUsers([]);
      if (onGroupCreated) onGroupCreated();
      onClose();
    } catch (error) {
      console.log("Error", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-[#FFF8EA] rounded-3xl md:rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-white/50 animate-in zoom-in-95 duration-300 flex flex-col">
        
        {/* Header */}
        <div className="bg-[#B99F8D] from-blue-600 to-blue-700 p-6 md:p-8 shrink-0 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 " />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4 text-white">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <Users size={24} />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase">Create Group</h2>
                <p className="text-white/70 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">Setup New User Segment</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 md:p-3 hover:bg-white/20 rounded-xl md:rounded-2xl transition-all text-white/80 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar flex-1 bg-white/40 space-y-6 md:space-y-8">
          
          {/* Main Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Group Name */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                <Layers size={14} className="text-blue-600" />
                Group Name
              </label>
              <input
                type="text"
                placeholder="Elite Typists..."
                value={groupName}
                onChange={(e) => {
                  setGroupName(e.target.value);
                  if (errors.groupName) setErrors((prev) => ({ ...prev, groupName: "" }));
                }}
                className={`w-full px-5 py-3.5 md:py-4 bg-white rounded-xl md:rounded-2xl border outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-sm md:text-base text-gray-800 shadow-sm ${
                  errors.groupName ? "border-red-500" : "border-gray-100 focus:border-blue-500"
                }`}
              />
              {errors.groupName && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-2">{errors.groupName}</p>}
            </div>

            {/* Group Type */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                <Zap size={14} className="text-blue-600" />
                Difficulty Level
              </label>
              <div className="relative">
                <select
                  value={groupType}
                  onChange={(e) => setGroupType(e.target.value)}
                  className="w-full px-5 py-3.5 md:py-4 bg-white rounded-xl md:rounded-2xl border border-gray-100 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-sm text-gray-700 appearance-none shadow-sm cursor-pointer"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronRight size={18} className="rotate-90 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Grouping Method Toggle */}
          <div className="bg-[#FFF8EA] rounded-2xl md:rounded-3xl p-4 md:p-6 border border-blue-600/10 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setGroupingMethod("auto")}
                className={`flex-1 p-4 rounded-xl md:rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                  groupingMethod === "auto" 
                    ? "bg-white border-blue-600 text-blue-600 shadow-md" 
                    : "bg-transparent border-gray-100 text-gray-400 hover:border-blue-200"
                }`}
              >
                <Target size={20} />
                <span className="text-xs font-black uppercase tracking-widest text-center">Auto-Criteria</span>
              </button>
              <button
                onClick={() => setGroupingMethod("manual")}
                className={`flex-1 p-4 rounded-xl md:rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                  groupingMethod === "manual" 
                    ? "bg-white border-blue-600 text-blue-600 shadow-md" 
                    : "bg-transparent border-gray-100 text-gray-400 hover:border-blue-200"
                }`}
              >
                <Users size={20} />
                <span className="text-xs font-black uppercase tracking-widest text-center">Manual Select</span>
              </button>
            </div>

            {/* Dynamic Content */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              {groupingMethod === "auto" ? (
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Min WPM</label>
                    <input
                      type="number"
                      value={minWpm}
                      onChange={(e) => setMinWpm(e.target.value)}
                      className="w-full px-4 py-3 bg-white rounded-xl border border-gray-100 outline-none focus:border-blue-500 font-bold text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Max WPM</label>
                    <input
                      type="number"
                      value={maxWpm}
                      onChange={(e) => setMaxWpm(e.target.value)}
                      className="w-full px-4 py-3 bg-white rounded-xl border border-gray-100 outline-none focus:border-blue-500 font-bold text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Min Accuracy %</label>
                    <input
                      type="number"
                      value={minAccuracy}
                      onChange={(e) => setMinAccuracy(e.target.value)}
                      className="w-full px-4 py-3 bg-white rounded-xl border border-gray-100 outline-none focus:border-blue-500 font-bold text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Max Accuracy %</label>
                    <input
                      type="number"
                      value={maxAccuracy}
                      onChange={(e) => setMaxAccuracy(e.target.value)}
                      className="w-full px-4 py-3 bg-white rounded-xl border border-gray-100 outline-none focus:border-blue-500 font-bold text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-4">Select Members</h4>
                  <div className="max-h-[250px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                    {users.map((user: any) => (
                      <div
                        key={user._id || user.id}
                        onClick={() => handleUserSelect(user._id || user.id)}
                        className={`flex items-center justify-between p-3.5 md:p-4 rounded-2xl border transition-all cursor-pointer ${
                          selectedUsers.includes(user._id || user.id)
                            ? "bg-blue-50 border-blue-200"
                            : "bg-white border-gray-50 hover:border-blue-100"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                            selectedUsers.includes(user._id || user.id) ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"
                          }`}>
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">{user.name}</p>
                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                              WPM: {user.wpm || 0} | ACC: {user.accuracy || 0}%
                            </p>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                          selectedUsers.includes(user._id || user.id) ? "bg-blue-600 border-blue-600 shadow-sm" : "border-gray-200"
                        }`}>
                          {selectedUsers.includes(user._id || user.id) && <X size={14} className="text-white rotate-45" />}
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.users && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider text-center mt-4">{errors.users}</p>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 bg-white/60 border-t border-gray-100 shrink-0">
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-4 rounded-xl md:rounded-2xl font-black text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all uppercase tracking-widest text-[10px]"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-[2] py-4 bg-[#B99F8D] text-white rounded-xl md:rounded-2xl font-black shadow-lg shadow-[#B99F8D]/20 transition-all uppercase tracking-widest text-[10px] disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Group"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;

