import React from "react";
import { MessageCircle, MoreHorizontal } from "lucide-react";
import { formatRelativeTime } from "../../../utils/dateFormatter";

interface DiscussionCardProps {
  post: {
    id: string;
    title: string;
    content?: string;
    authorName: string;
    authorAvatar?: string;
    postedAt: string;
    commentCount: number;
  };
  onClick: (id: string) => void;
}

const DiscussionCard: React.FC<DiscussionCardProps> = ({ post, onClick }) => {
  return (
    <div 
      onClick={() => onClick(post.id)}
      className="group relative w-full bg-white/30 backdrop-blur-sm rounded-[2rem] p-6 mb-4 border border-white/40 hover:bg-white/60 hover:shadow-2xl hover:shadow-[#D0864B]/5 transition-all duration-500 cursor-pointer overflow-hidden shadow-sm"
    >
      {/* Subtle Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#D0864B]/0 via-[#D0864B]/5 to-[#D0864B]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />

      <div className="relative flex gap-6">
        {/* Avatar Section */}
        <div className="shrink-0 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white shadow-md border-2 border-white ring-1 ring-[#ECA468]/10 transition-transform duration-500 group-hover:scale-110">
            {post.authorAvatar ? (
              <img src={post.authorAvatar} alt={post.authorName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#D0864B] to-[#ECA468] text-white font-black text-xl">
                {post.authorName[0]}
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Metadata Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black tracking-[0.2em] uppercase text-[#3A2E28] block truncate">
                {post.authorName}
              </span>
              <span className="text-[#D0864B]/30 font-bold">·</span>
              <span className="text-[10px] font-black tracking-widest uppercase text-[#D0864B]/60">
                {formatRelativeTime(post.postedAt)} ago
              </span>
            </div>
            <button className="text-[#D0864B]/20 hover:text-[#D0864B] transition-all hover:rotate-90">
              <MoreHorizontal size={20} />
            </button>
          </div>

          {/* Title & Body */}
          <div className="space-y-3 pr-4">
            <h3 className="text-xl md:text-2xl font-bold text-[#1A1512] leading-[1.2] tracking-tight group-hover:text-[#D0864B] transition-colors">
              {post.title}
            </h3>
            {post.content && (
              <p className="text-[#3A2E28]/60 text-sm line-clamp-2 leading-relaxed">
                {post.content}
              </p>
            )}
          </div>

          {/* Footer Action Row */}
          <div className="flex items-center gap-8 pt-4 border-t border-[#ECA468]/5">
            <div className="flex items-center gap-3 text-[#D0864B]/60 group/btn transition-all">
              <div className="p-2.5 rounded-2xl bg-white/50 border border-[#ECA468]/10 group-hover/btn:bg-[#D0864B] group-hover/btn:text-white group-hover/btn:shadow-lg group-hover/btn:shadow-[#D0864B]/20 transition-all duration-300">
                <MessageCircle size={18} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black tracking-[0.15em] uppercase text-[#D0864B]">
                  {post.commentCount} Comments
                </span>
                <span className="text-[9px] font-bold text-[#D0864B]/40 uppercase tracking-widest mt-0.5">
                  Join Discussion
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionCard;
