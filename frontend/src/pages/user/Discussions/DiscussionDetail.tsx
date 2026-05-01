import React, { useState,useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MoreHorizontal, User, Sparkles } from "lucide-react";
import CommentItem from "../../../components/user/discussions/CommentItem";
import ReplyModal from "../../../components/user/discussions/ReplyModal";
import Navbar from "../../../components/user/Navbar";
import { getDiscussionById, createComment } from "../../../api/user/disscussions";
import { formatRelativeTime } from "../../../utils/dateFormatter";

interface IComment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  postedAt: string;
  replies?: any[];
}

interface IDiscussionDetail {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorAvatar?: string;
  postedAt: string;
  commentCount: number;
  comments: IComment[];
}

const DiscussionDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState("");
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<{id:string, author:string, content:string, postedAt:string, authorAvatar?: string} | null>(null);
  const [post, setPost] = useState<IDiscussionDetail | null>(null);

  const fetchPost = async () => {
    try {
      const response = await getDiscussionById(id || "");
      if (response.data.data) {
        setPost(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch discussion:", error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleReply = (comment: IComment) => {
    setSelectedParent({ 
      id: comment.id, 
      author: comment.authorName, 
      content: comment.content, 
      postedAt: comment.postedAt,
      authorAvatar: comment.authorAvatar
    });
    setIsReplyModalOpen(true);
  };

  const handlePostComment = async () => {
    try {
      await createComment({ discussionId: id || "", content: commentText });
      setCommentText("");
      fetchPost();
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-[#FFF8EA]/50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D0864B]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8EA]/50 pb-24">
      <Navbar />
      {/* Detail Header - Ultra Glass */}
      <div className="sticky top-16 z-[45] bg-white/40 backdrop-blur-2xl border-b border-[#ECA468]/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
           <button 
             onClick={() => navigate("/discussions")}
             className="flex items-center gap-3 p-2 group"
           >
             <div className="p-2 bg-white rounded-xl shadow-sm border border-[#ECA468]/10 text-[#D0864B] group-hover:-translate-x-1 transition-all">
                <ArrowLeft size={18} strokeWidth={3} />
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D0864B]">All Stories</span>
                <h2 className="text-sm font-black text-[#1A1512] tracking-tight">Full Discussion</h2>
             </div>
           </button>
           
           <div className="p-2.5 bg-[#D0864B]/10 rounded-xl text-[#D0864B]">
              <Sparkles size={18} />
           </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 mt-10">
        {/* Focused Post Container */}
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-[#D0864B]/5 via-transparent to-[#D0864B]/5 blur-3xl opacity-50" />
          
          <article className="relative bg-white rounded-[3.5rem] p-8 md:p-14 shadow-[0_20px_50px_-20px_rgba(208,134,75,0.12)] border border-[#ECA468]/5 space-y-8 overflow-hidden">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden bg-white shadow-lg border-2 border-white ring-1 ring-[#ECA468]/10 group-hover:scale-105 transition-all duration-500">
                      {post.authorAvatar ? (
                        <img src={post.authorAvatar} alt={post.authorName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FAF5E9] to-[#FFF8EA] text-[#D0864B] font-black text-xl">
                          {post.authorName[0]}
                        </div>
                      )}
                   </div>
                   <div className="space-y-1">
                      <h3 className="font-black text-[#1A1512] text-xl leading-none">{post.authorName}</h3>
                      <p className="text-[#D0864B]/60 text-sm font-black uppercase tracking-[0.1em]">@{post.authorName.toLowerCase().replace(/\s+/g, "")}</p>
                   </div>
                </div>
                <button className="p-3 bg-[#FAF5E9] text-[#D0864B] rounded-2xl hover:bg-[#D0864B] hover:text-white transition-all">
                  <MoreHorizontal size={20} strokeWidth={3} />
                </button>
             </div>

             <div className="space-y-6">
                <h1 className="text-3xl md:text-5xl font-black text-[#1A1512] leading-[1.1] tracking-tight">
                  {post.title}
                </h1>
                <div className="h-1.5 w-20 bg-gradient-to-r from-[#D0864B] to-transparent rounded-full" />
                <p className="text-xl text-[#1A1512]/80 font-medium leading-[1.7]">
                  {post.content}
                </p>
             </div>

             <div className="flex items-center gap-4 text-[10px] font-black text-[#D0864B] uppercase tracking-[0.2em] py-8 border-y border-[#ECA468]/5">
                <time className="px-4 py-1.5 bg-[#D0864B]/5 rounded-full">{formatRelativeTime(post.postedAt)} ago</time>
                <div className="w-1 h-1 rounded-full bg-gray-200" />
                <span>{post.commentCount} Comments</span>
             </div>

            {/* Premium Reply Section */}
            <div className="pt-8 space-y-6">
               <div className="flex gap-5">
                  <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FAF5E9] to-white border border-[#ECA468]/10 items-center justify-center shrink-0 shadow-sm">
                     <User size={24} className="text-[#D0864B]/20" strokeWidth={3} />
                  </div>
                  <div className="flex-1 space-y-5">
                     <div className="bg-[#FAF5E9]/50 rounded-[2rem] p-6 focus-within:bg-white focus-within:shadow-xl focus-within:shadow-[#D0864B]/5 transition-all duration-500 border border-[#ECA468]/10">
                        <textarea 
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="What are your thoughts on this?"
                          className="w-full bg-transparent text-lg text-[#1A1512] placeholder:text-[#D0864B]/30 outline-none resize-none min-h-[80px]"
                        />
                     </div>
                     <div className="flex justify-end pr-2">
                        <button 
                          disabled={!commentText}
                          onClick={handlePostComment}
                          className="bg-[#3A2E28] hover:bg-[#1A1512] text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-black/10 transition-all disabled:opacity-30 active:scale-95"
                        >
                          Post Reply
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          </article>
        </div>

        {/* Improved Threaded Comments Rhythm */}
        <div className="mt-16 space-y-4">
           <div className="flex items-center gap-4 px-8 mb-8">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#ECA468]/20" />
              <h4 className="text-[10px] font-black text-[#D0864B] uppercase tracking-[0.3em]">Conversation Thread</h4>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#ECA468]/20" />
           </div>
           
           <div className="space-y-4">
              {post.comments.map((comment) => (
                 <CommentItem 
                   key={comment.id} 
                   comment={comment} 
                   onReply={handleReply}
                 />
              ))}
           </div>
        </div>
      </main>

      <ReplyModal 
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        parentComment={selectedParent}
        onSubmit={() => fetchPost()}
      />
    </div>
  );
};

export default DiscussionDetail;
