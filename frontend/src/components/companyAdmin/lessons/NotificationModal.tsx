import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, Bell, User, MessageSquare, Send } from "lucide-react";
import { individualNotification } from "../../../api/companyAdmin/notification";
import { toast } from "react-toastify";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: { id: string; name: string; email: string }[];
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, recipients }) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const userIds = recipients.map(r => r.id);
     const response = await individualNotification({
        title,
        message,
        selectedUsers: userIds
      });

      setIsSubmitting(false);

      onClose();
      setTitle("");
      setMessage("");
      if(response.data.success){
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Failed to send notification:", error);
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1A1512]/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-[#FFF8EA] rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-white/50 animate-in zoom-in-95 duration-300 flex flex-col font-sans">
        {/* Decorative Header */}
        <div className="h-28 bg-gradient-to-br from-[#ECA468] to-[#D0864B] relative overflow-hidden shrink-0">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,#fff_0%,transparent_50%)]" />
          
          <div className="relative h-full px-8 flex items-center justify-between">
            <div className="flex items-center gap-4 text-white">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <Bell size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">Send Notification</h2>
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-1">Direct Student Outreach</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white/20 rounded-2xl transition-all text-white/80 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-white/40">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Recipients Summary */}
            <div className="bg-white/60 p-4 rounded-2xl border border-[#ECA468]/10 shadow-sm">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                <User size={12} className="text-[#D0864B]" />
                Recipients ({recipients.length})
              </label>
              <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-1">
                {recipients.map((r, i) => (
                  <span key={i} className="px-3 py-1 bg-[#D0864B]/10 text-[#D0864B] rounded-lg text-[10px] font-black uppercase tracking-wider border border-[#ECA468]/20">
                    {r.name}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                Notification Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Action Required: Lesson Deadline Approaching"
                className="w-full px-6 py-4 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-4 focus:ring-[#ECA468]/10 focus:border-[#ECA468] transition-all font-bold text-gray-800 shadow-sm text-sm"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                <MessageSquare size={12} className="text-[#D0864B]" />
                Personal Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Write your message here..."
                className="w-full px-6 py-4 bg-white rounded-3xl border border-gray-100 outline-none focus:ring-4 focus:ring-[#ECA468]/10 focus:border-[#ECA468] transition-all font-medium text-gray-800 shadow-sm resize-none leading-relaxed text-sm"
              />
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-50">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 rounded-xl font-black text-gray-400 hover:text-gray-600 transition-all uppercase tracking-widest text-[10px]"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !title || !message}
                className="flex-[2] py-4 bg-[#D0864B] hover:bg-[#B36E39] text-white rounded-xl font-black shadow-lg shadow-[#D0864B]/20 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send size={14} />
                    <span>Send Notification</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default NotificationModal;
