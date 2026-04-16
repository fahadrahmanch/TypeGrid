import React, { useEffect, useState } from "react";
import CompanyUserNavbar from "../../components/companyUser/layout/companyUserNavbar";
import { Bell, Search, Trash2, Eye, Clock, User, Info, Calendar, CheckCircle2 } from "lucide-react";
import { fetchUserNotifications, markNotificationAsRead } from "../../api/companyUser/notifications";
import { toast } from "react-toastify";

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  sender?: {
    name: string;
    role: string;
  };
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      try {
        const response = await fetchUserNotifications();
        if (response.data.success) {
          setNotifications(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        // toast.error("Failed to fetch notifications");
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const filteredNotifications = notifications.filter(
    (n) =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const markAsRead = async (id: string) => {
    try {
      const response = await markNotificationAsRead(id);
      if (response.data.success) {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FFF8EA] pt-20">
      <CompanyUserNavbar />

      <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="bg-[#B09886] p-2 rounded-xl">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 font-jaini tracking-wide">Notifications</h1>
            </div>
            <p className="text-sm text-gray-500 ml-12">Stay updated with your latest alerts and messages</p>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#E6DCC3] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#B09886]/20 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#B09886]"></div>
              <p className="mt-4 text-gray-500 font-medium">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`group relative bg-white rounded-2xl p-5 border transition-all duration-300 hover:shadow-lg hover:shadow-[#B09886]/5 cursor-pointer
                  ${notification.isRead ? "border-[#E6DCC3] opacity-80" : "border-pink-200 bg-pink-50/10 shadow-sm"}`}
              >
                {!notification.isRead && (
                  <div className="absolute top-5 right-5 w-2.5 h-2.5 bg-pink-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(236,72,153,0.5)]"></div>
                )}

                <div className="flex gap-4">
                  <div
                    className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                    ${notification.isRead ? "bg-gray-100 text-gray-400" : "bg-pink-100 text-pink-600"}`}
                  >
                    {notification.title.includes("Lesson") ? (
                      <BookOpenIcon className="w-6 h-6" />
                    ) : notification.title.includes("Contest") ? (
                      <Calendar className="w-6 h-6" />
                    ) : (
                      <Info className="w-6 h-6" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={`font-bold text-lg leading-tight truncate pr-8
                        ${notification.isRead ? "text-gray-700" : "text-gray-900"}`}
                      >
                        {notification.title}
                      </h3>
                    </div>

                    <p
                      className={`text-sm leading-relaxed mb-4 line-clamp-2
                      ${notification.isRead ? "text-gray-500" : "text-gray-600 font-medium"}`}
                    >
                      {notification.message}
                    </p>

                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#B09886]" />
                        <span>{formatDate(notification.createdAt)}</span>
                      </div>

                      {notification.isRead && (
                        <div className="flex items-center gap-1.5 text-emerald-500">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                          >
                            READ
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-2 text-gray-400 hover:text-[#B09886] hover:bg-orange-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl border border-dashed border-[#E6DCC3] py-20 flex flex-col items-center justify-center text-center px-4">
              <div className="bg-gray-50 p-6 rounded-full mb-6">
                <Bell className="w-12 h-12 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No notifications yet</h3>
              <p className="text-gray-500 max-w-sm">
                When you receive messages from your administrator or the system, they'll appear here.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Helper for Lucide icons that aren't imported but used as components
const BookOpenIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
      .format(date)
      .replace(",", " •");
  } catch (e) {
    return dateString;
  }
};

export default Notifications;
