import React, { useState, useEffect } from "react";
import CompanyAdminSidebar from "../../components/companyAdmin/layout/CompanyAdminSideNavbar";
import {
  individualNotification,
  groupNotification,
  allNotification,
  getNotificationHistory,
} from "../../api/companyAdmin/notification";
import { Send, Users, UsersRound, Bell, LayoutGrid, Eye, Search, ChevronDown, Info, Clock, X, ChevronRight } from "lucide-react";
import { fetchCompanyUsers } from "../../api/companyAdmin/companyAdminService";
import { getCompanyGroups } from "../../api/companyAdmin/companyGroup";
import { GroupMember, Group } from "../../types/group";
import { toast } from "react-toastify";

type NotificationType = "individual" | "group" | "all";

interface NotificationHistoryItem {
  id: string;
  title: string;
  message: string;
  target: string;
  timestamp: string;
}

const NotificationPage: React.FC = () => {
  const [notificationType, setNotificationType] = useState<NotificationType>("individual");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  // Data State
  const [users, setUsers] = useState<GroupMember[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Selection State
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);
  const [notificationHistory, setNotificationHistory] = useState<NotificationHistoryItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      try {
        const [usersRes, groupsRes] = await Promise.all([fetchCompanyUsers(), getCompanyGroups()]);

        setUsers(usersRes.data.data || []);
        setGroups(groupsRes.data.groups || []);
      } catch (error) {
        toast.error("Failed to load users or groups");
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, []);

  const handleSend = async () => {
    const newErrors: Record<string, string> = {};

    // Basic Validation
    if (!title.trim()) {
      newErrors.title = "Please enter a notification title";
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
    }

    if (!message.trim()) {
      newErrors.message = "Please enter a notification message";
    } else if (message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    if (notificationType === "individual" && selectedUsers.length === 0) {
      newErrors.selection = "Please select at least one user";
    } else if (notificationType === "group" && !selectedGroup) {
      newErrors.selection = "Please select a group";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSending(true);
    try {
      let res;
      if (notificationType === "individual") {
        res = await individualNotification({ title, message, selectedUsers });
      } else if (notificationType === "group") {
        res = await groupNotification({ title, message, selectedGroup });
      } else if (notificationType === "all") {
        res = await allNotification({ title, message });
      }

      if (res?.data?.success) {
        toast.success(res.data.message);
        // Clear form
        setTitle("");
        setMessage("");
        setSelectedUsers([]);
        setSelectedGroup("");
        
        // Refresh history
        const historyRes = await getNotificationHistory();
        if (historyRes.data.success) {
          setNotificationHistory(historyRes.data.data);
        }
      } else {
        toast.error(res?.data?.message || "Failed to send notification");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred while sending the notification");
    } finally {
      setSending(false);
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  useEffect(() => {
    const loadHistory = async () => {
      const res = await getNotificationHistory();
      if (res.data.success) {
        setNotificationHistory(res.data.data);
      }
    };
    loadHistory();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#FFF8EA]">
      <CompanyAdminSidebar />

      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 overflow-y-auto pt-20 md:pt-12 flex flex-col xl:flex-row gap-8">
        {/* Left Section: Form */}
        <div className="flex-1 space-y-6 md:space-y-8 max-w-4xl">
          <header className="space-y-1 md:space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Send Notification</h1>
            <p className="text-gray-500 font-medium text-xs md:text-sm">
              Send messages directly to individual users, groups, or all users at once.
            </p>
          </header>

          <div className="bg-white rounded-2xl shadow-sm border border-[#E6DCC3] overflow-hidden">
            <div className="p-5 md:p-8 space-y-6 md:space-y-8">
              {/* Notification Type Selector */}
              <section className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Notification Type</label>
                <div className="flex flex-col sm:flex-row p-1 bg-gray-50 rounded-xl md:rounded-2xl border border-gray-100 gap-1">
                  {(["individual", "group", "all"] as NotificationType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setNotificationType(type)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg md:rounded-xl transition-all duration-200 text-sm font-bold
                        ${
                          notificationType === type
                            ? "bg-white text-[#B99F8D] shadow-sm border border-[#B99F8D]/10"
                            : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      {type === "individual" && <Users className="w-4 h-4" />}
                      {type === "group" && <UsersRound className="w-4 h-4" />}
                      {type === "all" && <LayoutGrid className="w-4 h-4" />}
                      <span className="capitalize">
                        {type === "individual" ? "User" : type === "group" ? "Group" : "All Users"}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Dynamic Selection Area */}
              <div className="min-h-[140px] animate-in fade-in duration-500">
                {notificationType === "all" && (
                  <div className="flex gap-4 items-center bg-[#B99F8D]/5 border border-[#B99F8D]/10 p-5 rounded-2xl text-[#B99F8D]">
                    <div className="bg-[#B99F8D]/10 p-2.5 rounded-xl">
                      <Info className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-bold tracking-tight leading-relaxed">
                      This notification will be sent to <span className="font-black underline uppercase tracking-wider">all users</span> in the
                      system.
                    </p>
                  </div>
                )}

                {notificationType === "individual" && (
                  <section className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Users</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border rounded-xl md:rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-[#B99F8D]/10 transition-all ${
                        errors.selection ? "border-red-500 focus:border-red-500" : "border-gray-100 focus:border-[#B99F8D]"
                      }`}
                      />
                    </div>
                    {errors.selection && (
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-2 ml-2">
                      {errors.selection}
                    </p>
                  )}
                  <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                      {loadingData ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#B99F8D]"></div>
                        </div>
                      ) : filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <label
                            key={user._id}
                            className={`flex items-center justify-between gap-3 p-4 rounded-2xl cursor-pointer transition-all border
                              ${selectedUsers.includes(user._id) ? "bg-[#B99F8D]/5 border-[#B99F8D]/20 shadow-sm" : "bg-white border-gray-50 hover:border-[#B99F8D]/10"}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                                selectedUsers.includes(user._id) ? "bg-[#B99F8D] text-white" : "bg-gray-100 text-gray-400"
                              }`}>
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-900">{user.name}</span>
                                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{user.email}</span>
                              </div>
                            </div>
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                              selectedUsers.includes(user._id) ? "bg-[#B99F8D] border-[#B99F8D] shadow-sm" : "border-gray-200"
                            }`}>
                              {selectedUsers.includes(user._id) && <X size={14} className="text-white rotate-45" />}
                              <input
                                type="checkbox"
                                className="hidden"
                                checked={selectedUsers.includes(user._id)}
                                onChange={() => {
                                  toggleUserSelection(user._id);
                                  if (errors.selection) setErrors((prev) => ({ ...prev, selection: "" }));
                                }}
                              />
                            </div>
                          </label>
                        ))
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                          <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">No users found</p>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {notificationType === "group" && (
                  <section className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Group</label>
                    <div className="relative">
                      <button
                        onClick={() => setIsGroupDropdownOpen(!isGroupDropdownOpen)}
                        className={`w-full flex items-center justify-between p-4 md:p-5 bg-gray-50 border rounded-xl md:rounded-2xl text-sm font-bold transition-all
                          ${
                            errors.selection
                              ? "border-red-500 text-red-500"
                              : "border-gray-100 text-gray-700 hover:border-[#B99F8D]/20"
                          }`}
                      >
                        <span className={selectedGroup ? "text-gray-900" : "text-gray-400"}>
                          {selectedGroup ? groups.find((g) => g._id === selectedGroup)?.groupName : "Choose a targeted group..."}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-300 ${isGroupDropdownOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      {isGroupDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-2xl shadow-2xl z-20 py-3 max-h-60 overflow-y-auto custom-scrollbar animate-in slide-in-from-top-4 duration-300">
                          {groups.map((group) => (
                            <button
                              key={group._id}
                              onClick={() => {
                                setSelectedGroup(group._id);
                                setIsGroupDropdownOpen(false);
                                if (errors.selection) setErrors((prev) => ({ ...prev, selection: "" }));
                              }}
                              className="w-full text-left px-6 py-4 text-sm hover:bg-[#B99F8D]/5 transition-colors font-bold border-l-4 border-transparent hover:border-[#B99F8D] flex items-center justify-between group"
                            >
                              <span>{group.groupName}</span>
                              <ChevronRight size={14} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.selection && (
                      <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-2 mt-2">
                        {errors.selection}
                      </p>
                    )}
                  </section>
                )}
              </div>

              {/* Title and Message */}
              <div className="space-y-6 pt-4">
                <section className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                    Notification Title
                  </label>
                  <input
                    type="text"
                    placeholder="E.g., System Maintenance Update"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
                    }}
                    className={`w-full px-5 py-4 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-[#B99F8D]/10 focus:bg-white transition-all text-sm font-bold shadow-sm
                      ${
                        errors.title
                          ? "bg-red-50/30 border border-red-500 focus:border-red-500"
                          : "bg-gray-50 border border-gray-100 focus:border-[#B99F8D]"
                      }`}
                  />
                  {errors.title && (
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-2">{errors.title}</p>
                  )}
                </section>

                <section className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Message Content</label>
                  <textarea
                    placeholder="Write your message here..."
                    rows={5}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message) setErrors((prev) => ({ ...prev, message: "" }));
                    }}
                    className={`w-full px-5 py-5 rounded-xl md:rounded-2xl outline-none focus:ring-4 focus:ring-[#B99F8D]/10 focus:bg-white transition-all text-sm font-medium resize-none shadow-sm leading-relaxed
                      ${
                        errors.message
                          ? "bg-red-50/30 border border-red-500 focus:border-red-500"
                          : "bg-gray-50 border border-gray-100 focus:border-[#B99F8D]"
                      }`}
                  ></textarea>
                  {errors.message && (
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider ml-2">{errors.message}</p>
                  )}
                </section>
              </div>

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={sending}
                className={`w-full flex items-center justify-center gap-3 py-5 rounded-xl md:rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-500
                  ${
                    sending
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-[#B99F8D] hover:bg-[#a88a75] text-white shadow-xl shadow-[#B99F8D]/20 hover:-translate-y-1 active:scale-[0.98]"
                  }`}
              >
                <Send className={`w-4 h-4 ${sending ? "animate-pulse" : ""}`} />
                {sending ? "Sending..." : "Blast Notification"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Section: History */}
        <aside className="w-full xl:w-96 space-y-6 md:space-y-8">
          <header className="flex items-center justify-between px-1">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <div className="w-2 h-8 bg-[#B99F8D] rounded-full" />
              Recent Broadcasts
            </h2>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1.5 rounded-full">
              {notificationHistory.length} Total
            </span>
          </header>

          <div className="space-y-4 max-h-[1000px] xl:max-h-none overflow-y-auto xl:overflow-visible pr-1 custom-scrollbar">
            {notificationHistory.length === 0 ? (
              <div className="py-20 text-center bg-white/50 rounded-3xl border-2 border-dashed border-gray-100">
                <Bell className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">No history found</p>
              </div>
            ) : (
              notificationHistory.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-6 rounded-3xl border border-[#E6DCC3] shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#B99F8D]/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                  
                  <div className="relative space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-gray-50 p-3 rounded-2xl group-hover:bg-[#B99F8D]/10 transition-colors">
                          <Users className="w-5 h-5 text-gray-400 group-hover:text-[#B99F8D]" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <h4 className="font-bold text-sm text-gray-900 truncate group-hover:text-[#B99F8D] transition-colors">{item.title}</h4>
                          <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">{item.message}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-200 rounded-full" />
                        <div className="flex items-center gap-1 text-[10px] font-black text-[#B99F8D] uppercase tracking-wider bg-[#B99F8D]/5 px-2 py-0.5 rounded-md">
                          <span>{item.target}</span>
                        </div>
                      </div>
                      <button className="p-2 text-gray-300 hover:text-[#B99F8D] hover:bg-[#B99F8D]/5 rounded-xl transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </main>
    </div>

  );
};

export default NotificationPage;
