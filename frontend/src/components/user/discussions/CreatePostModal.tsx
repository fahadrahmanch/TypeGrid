import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, Send, AlignLeft } from "lucide-react";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; content: string }) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && content) {
      onSubmit({ title, content });
      setTitle("");
      setContent("");
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
      <div className="relative bg-[#FFF8EA] rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col font-sans">
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Create post</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-[#FAF5E9] p-6 rounded-3xl border border-[#ECA468]/10 shadow-sm">
              <label className="block text-[10px] font-black text-[#D0864B]/60 uppercase tracking-[0.2em] mb-3 ml-1">
                The title of your post
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                placeholder="Give your topic a clear, concise name..."
                className="w-full bg-transparent outline-none font-bold text-[#1A1512] placeholder:text-[#D0864B]/20 transition-all border-b-2 border-[#ECA468]/5 focus:border-[#ECA468] py-2"
              />
            </div>

            <div className="bg-[#FAF5E9] p-6 rounded-[2rem] border border-[#ECA468]/10 shadow-sm min-h-[300px] flex flex-col">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-1">
                <AlignLeft size={12} className="text-[#D0864B]" />
                The content of your posts
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind? Start typing here..."
                className="flex-1 w-full bg-transparent outline-none font-medium text-gray-700 placeholder:text-gray-300 resize-none leading-relaxed text-sm"
              />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={!title || !content}
                className="px-10 py-4 bg-[#8C7B6B] hover:bg-[#736558] text-white rounded-2xl font-black shadow-lg shadow-[#8C7B6B]/20 transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <Send size={14} className="group-hover:translate-x-1 transition-transform" />
                <span>Post</span>
              </button>
              
              <button
                type="button"
                onClick={onClose}
                className="px-10 py-4 bg-[#EBDDC8] hover:bg-[#DBCFB8] text-[#8C7B6B] rounded-2xl font-black transition-all uppercase tracking-widest text-[10px]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CreatePostModal;
