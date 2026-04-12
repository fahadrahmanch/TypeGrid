import React, { useState, useEffect } from "react";
import CompanyAdminSidebar from "../../components/companyAdmin/layout/CompanyAdminSideNavbar";
import { individualNotification, groupNotification, allNotification ,getNotificationHistory} from "../../api/companyAdmin/notification";
import { 
  Send, 
  Users, 
  UsersRound, 
  Bell, 
  LayoutGrid,
  Eye, 
  Search, 
  ChevronDown,
  Info
} from "lucide-react";
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
  const [notificationHistory,setNotificationHistory] = useState<NotificationHistoryItem[]>([])

  // Mock History
  const [history] = useState<NotificationHistoryItem[]>([
    {
      id: "1",
      title: "k;lk",
      message: "n,mn",
      target: "All Users",
      timestamp: "Oct 28, 2025, 5:12 PM"
    }
  ]);

  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      try {
        const [usersRes, groupsRes] = await Promise.all([
          fetchCompanyUsers(),
          getCompanyGroups()
        ]);
        setUsers(usersRes.data.data || []);
        setGroups(groupsRes.data.groups || []);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load users or groups");
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, []);

  const handleSend = async () => {
  
    if (notificationType === "individual") {
      const data={title,message,selectedUsers}
      const res=await individualNotification(data)
      if(res.data.success){
        toast.success(res.data.message)
      }
      else{
        toast.error(res.data.message)
      }
        
      return;
    }else if(notificationType === "group"){
      const res=await groupNotification({title,message,selectedGroup})
      if(res.data.success){
        toast.success(res.data.message)
      }
      else{
        toast.error(res.data.message)
      }
      return;
    }else if(notificationType === "all"){
      const res=await allNotification({title,message})
      if(res.data.success){
        toast.success(res.data.message)
      }
      else{
        toast.error(res.data.message)
      }
      return;
    }

    setSending(true);
    // Simulate API call
    setTimeout(() => {
      setSending(false);
      toast.success("Notification sent successfully!");
      // Reset form
      setTitle("");
      setMessage("");
      setSelectedUsers([]);
      setSelectedGroup("");
    }, 1500);
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  useEffect(()=>{
    const loadHistory=async()=>{
    const res=await getNotificationHistory()
    console.log(res.data.data)
    if(res.data.success){
      setNotificationHistory(res.data.data)
    }
    }
    loadHistory()
  },[])

  return (
    <div className="flex min-h-screen bg-[#FFF8EA]">
      <CompanyAdminSidebar />
      
      <main className="flex-1 ml-64 p-8 flex gap-8">
        {/* Left Section: Form */}
        <div className="flex-1 space-y-8 max-w-4xl">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-jaini">
              Send Notification
            </h1>
            <p className="text-gray-500 font-medium text-sm">
              Send messages directly to individual users, groups, or all users at once.
            </p>
          </header>

          <div className="bg-white rounded-2xl shadow-sm border border-[#E6DCC3] overflow-hidden">
            <div className="p-8 space-y-8">
              {/* Notification Type Selector */}
              <section className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Notification Type
                </label>
                <div className="flex p-1 bg-gray-50 rounded-xl border border-gray-100 gap-1">
                  {(["individual", "group", "all"] as NotificationType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setNotificationType(type)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all duration-200 text-sm font-semibold
                        ${notificationType === type 
                          ? "bg-white text-blue-600 shadow-sm border border-blue-100" 
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      {type === "individual" && <Users className="w-4 h-4" />}
                      {type === "group" && <UsersRound className="w-4 h-4" />}
                      {type === "all" && <LayoutGrid className="w-4 h-4" />}
                      <span className="capitalize">{type === "individual" ? "Individual User" : type === "group" ? "Group" : "All Users"}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Dynamic Selection Area */}
              <div className="min-h-[140px] animate-in fade-in duration-500">
                {notificationType === "all" && (
                  <div className="flex gap-4 items-center bg-blue-50/50 border border-blue-100 p-5 rounded-xl text-blue-700">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Info className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium tracking-tight">
                      This notification will be sent to <span className="font-bold underline">all users</span> in the system.
                    </p>
                  </div>
                )}

                {notificationType === "individual" && (
                  <section className="space-y-4">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Select Users
                    </label>
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="text"
                        placeholder="Search users..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="max-h-52 overflow-y-auto custom-scrollbar space-y-1 pr-2">
                      {loadingData ? (
                        <div className="text-center py-4 text-gray-400 text-sm">Loading users...</div>
                      ) : filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <label 
                            key={user._id}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border border-transparent
                              ${selectedUsers.includes(user._id) ? "bg-blue-50/50 border-blue-100" : "hover:bg-gray-50"}`}
                          >
                            <input 
                              type="checkbox"
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              checked={selectedUsers.includes(user._id)}
                              onChange={() => toggleUserSelection(user._id)}
                            />
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-gray-900">{user.name}</span>
                              <span className="text-xs text-gray-500">{user.email}</span>
                            </div>
                          </label>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-400 text-sm">No users found.</div>
                      )}
                    </div>
                  </section>
                )}

                {notificationType === "group" && (
                  <section className="space-y-4">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Select Group
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setIsGroupDropdownOpen(!isGroupDropdownOpen)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-700 hover:border-blue-200 transition-all"
                      >
                        <span className={selectedGroup ? "text-gray-900" : "text-gray-400"}>
                          {selectedGroup ? groups.find(g => g.id === selectedGroup)?.name : "Choose a group..."}
                        </span>
                        <ChevronDown className={`w-5 h-5 transition-transform ${isGroupDropdownOpen ? "rotate-180" : ""}`} />
                      </button>

                      {isGroupDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-10 py-2 max-h-48 overflow-y-auto custom-scrollbar animate-in slide-in-from-top-2 duration-200">
                          {groups.map((group) => (
                            <button
                              key={group.id}
                              onClick={() => {
                                setSelectedGroup(group.id);
                                setIsGroupDropdownOpen(false);
                              }}
                              className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition-colors font-medium border-l-2 border-transparent hover:border-blue-500"
                            >
                              {group.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>
                )}
              </div>

              {/* Title and Message */}
              <div className="space-y-6 pt-4">
                <section className="space-y-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Notification Title
                  </label>
                  <input 
                    type="text"
                    placeholder="Enter notification title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500 transition-all text-sm font-medium"
                  />
                </section>

                <section className="space-y-3">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Message Content
                  </label>
                  <textarea 
                    placeholder="Enter your message..."
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white focus:border-blue-500 transition-all text-sm font-medium resize-none"
                  ></textarea>
                </section>
              </div>

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={sending}
                className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl text-sm font-bold tracking-wide transition-all duration-300
                  ${sending 
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                    : "bg-[#B99F8D] hover:bg-[#a88a75] text-white shadow-lg shadow-[#B99F8D]/30 hover:-translate-y-0.5"
                  }`}
              >
                <Send className={`w-4 h-4 ${sending ? "animate-pulse" : ""}`} />
                {sending ? "Sending Notification..." : "Send Notification"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Section: History */}
        <aside className="w-80 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            Notification History
          </h2>
          
          <div className="space-y-4">
            {notificationHistory.map((item) => (
              <div 
                key={item.id}
                className="bg-white p-5 rounded-2xl border border-[#E6DCC3] shadow-sm hover:shadow-md transition-shadow group flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-gray-100 p-2.5 rounded-xl group-hover:bg-blue-50 transition-colors">
                      <Users className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h4 className="font-bold text-sm text-gray-900 truncate">{item.title}</h4>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{item.message}</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded-md transition-colors opacity-0 group-hover:opacity-100 uppercase tracking-tighter">
                    <Eye className="w-3 h-3" />
                    Preview
                  </button>
                </div>
                
                <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-2 border-t border-gray-50">
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-3 h-3" />
                    <span>{item.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                    <span>{item.target}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default NotificationPage;
