import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, User } from "lucide-react";
import { formatRelativeTime } from "../../../utils/dateFormatter";
import { createReply } from "../../../api/user/disscussions";
interface ReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentComment: {
    id: string;
    author: string;
    content: string;
    postedAt: string;
    authorAvatar?: string;
  } | null;
  onSubmit: (data: { content: string }) => void;
}

const ReplyModal: React.FC<ReplyModalProps> = ({ isOpen, onClose, parentComment, onSubmit }) => {
  const [content, setContent] = useState("");

  if (!isOpen || !parentComment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content) {
      try {
        await createReply({ commentId: parentComment.id, content });
        setContent("");
        onSubmit({ content });
        onClose();
      } catch (error) {
        console.error("Failed to post reply:", error);
      }
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#1A1512]/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-[#FFF8EA] rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ECA468]/5">
           <button onClick={onClose} className="p-2 hover:bg-[#ECA468]/5 rounded-full transition-all">
             <X size={20} className="text-gray-800" />
           </button>
           <button 
             onClick={handleSubmit}
             disabled={!content}
             className="bg-[#D0864B] hover:bg-[#B36E39] text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50"
           >
              Reply
           </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Parent Context */}
          <div className="flex gap-4">
             <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-2xl bg-white/40 shadow-sm shrink-0 overflow-hidden">
                   {parentComment.authorAvatar ? (
                      <img src={parentComment.authorAvatar} alt="" className="w-full h-full object-cover" />
                   ) : (
                      <User size={20} className="m-2.5 text-gray-400" />
                   )}
                </div>
                <div className="w-0.5 flex-1 bg-gray-100 min-h-[20px]" />
             </div>
             <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                   <span className="font-black text-gray-900 text-sm">{parentComment.author}</span>
                   <span className="text-gray-400 text-sm font-medium">@{parentComment.author.toLowerCase()}</span>
                   <span className="text-gray-300">·</span>
                   <span className="text-gray-400 text-sm font-medium">{formatRelativeTime(parentComment.postedAt)} ago</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{parentComment.content}</p>
             </div>
          </div>

          {/* Reply Input */}
          <div className="flex gap-4">
             <div className="w-10 h-10 rounded-2xl bg-[#D0864B]/5 flex items-center justify-center shrink-0">
                <User size={20} className="text-[#D0864B]/30" />
             </div>
             <div className="flex-1">
                 <p className="text-xs text-gray-400 mb-2 font-medium">
                    Replying to <span className="text-[#D0864B] font-black">@{parentComment.author.toLowerCase()}</span>
                 </p>
                 <textarea
                   value={content}
                   onChange={(e) => setContent(e.target.value)}
                   autoFocus
                   placeholder="Post your reply"
                   className="w-full bg-transparent text-lg text-gray-800 placeholder:text-gray-300 outline-none resize-none min-h-[120px] pt-1"
                 />
             </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ReplyModal;
