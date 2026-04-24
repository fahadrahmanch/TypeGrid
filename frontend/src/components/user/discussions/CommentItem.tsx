import React, { useState } from "react";
import { MessageCircle, MoreHorizontal, User, Reply, ChevronDown, ChevronUp } from "lucide-react";
import { formatRelativeTime } from "../../../utils/dateFormatter";

interface CommentItem {
  id: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  postedAt: string;
  replies?: any[];
}

interface CommentItemProps {
  comment: CommentItem;
  isReply?: boolean;
  onReply: (comment: CommentItem) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, isReply = false, onReply }) => {
  const [showReplies, setShowReplies] = useState(false);
  const hasReplies = comment.replies && comment.replies.length > 0;
  return (
    <div className={`w-full group ${isReply ? "ml-8 md:ml-20" : ""}`}>
      <div className="relative flex gap-5 p-6 md:p-8 hover:bg-white/40 transition-all rounded-[2.5rem] group/card duration-500">
        {/* Thread Line - Refined with Gradient */}
        {!isReply && (
           <div className="absolute left-[44px] md:left-[52px] top-[85px] bottom-0 w-[1.5px] bg-gradient-to-b from-[#ECA468]/20 via-[#ECA468]/10 to-transparent group-last:hidden" />
        )}

        {/* Avatar Section */}
        <div className="shrink-0 relative z-10">
          <div className={`${isReply ? "w-10 h-10" : "w-12 h-12 md:w-14 md:h-14"} rounded-2xl overflow-hidden bg-white border-2 border-white shadow-md transition-transform duration-500 group-hover:scale-110`}>
            {comment.authorAvatar ? (
              <img src={comment.authorAvatar} alt={comment.authorName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FAF5E9] to-[#FFF8EA] text-[#D0864B]">
                <User size={isReply ? 18 : 24} strokeWidth={2.5} />
              </div>
            )}
          </div>
          
          {isReply && (
             <div className="absolute -top-2 -left-2 p-1.5 bg-white rounded-lg shadow-sm border border-[#ECA468]/10 text-[#D0864B]">
                <Reply size={10} strokeWidth={3} className="rotate-180" />
             </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#3A2E28] block truncate">
                {comment.authorName}
              </span>
              <span className="text-[#D0864B]/30 font-bold">·</span>
              <span className="text-[9px] font-black tracking-[0.15em] uppercase text-[#D0864B]/60">
                {formatRelativeTime(comment.postedAt)} ago
              </span>
            </div>
            <button className="text-[#D0864B]/20 hover:text-[#D0864B] transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>

          <p className="text-base text-[#1A1512]/90 font-medium leading-[1.6]">
            {comment.content}
          </p>

          {/* Action Row - Refined */}
          <div className="flex items-center gap-6 pt-4">
            {!isReply && (
              <button 
                onClick={() => onReply(comment)}
                className="group/btn flex items-center gap-2 text-[#D0864B]/60 hover:text-[#D0864B] transition-all"
              >
                <div className="p-2 rounded-xl bg-white/50 border border-[#ECA468]/5 group-hover/btn:bg-[#D0864B] group-hover/btn:text-white group-hover/btn:shadow-lg group-hover/btn:shadow-[#D0864B]/10 transition-all duration-300">
                  <MessageCircle size={14} strokeWidth={2.5} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">reply</span>
              </button>
            )}

            {hasReplies && (
              <button 
                onClick={() => setShowReplies(!showReplies)}
                className="group/btn flex items-center gap-2 text-[#D0864B]/60 hover:text-[#D0864B] transition-all"
              >
                <div className="p-2 rounded-xl bg-white/50 border border-[#ECA468]/5 group-hover/btn:bg-[#D0864B] group-hover/btn:text-white transition-all duration-300">
                  {showReplies ? <ChevronUp size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />}
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                  {showReplies ? `Hide ${comment.replies?.length} Replies` : `View ${comment.replies?.length} Replies`}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Replies Section */}
      {hasReplies && showReplies && (
        <div className="space-y-4 mt-2">
          {comment.replies?.map((reply) => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              isReply={true} 
              onReply={onReply} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
