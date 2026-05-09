import React from "react";
import { Plus, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import illustration from "../../../assets/images/discussions_illustration.png";

interface DiscussionsHeaderProps {
  onCreatePost: () => void;
}

const DiscussionsHeader: React.FC<DiscussionsHeaderProps> = ({ onCreatePost }) => {
  return (
    <header className="sticky top-16 z-[45] w-full px-4 md:px-6 py-4 transition-all duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/40 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] border border-white/60 p-3 md:p-6 shadow-[0_8px_32px_0_rgba(208,134,75,0.08)] flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6">
          {/* Brand/Title Section */}
          <div className="flex items-center gap-3 md:gap-5 w-full sm:w-auto">
            <div className="relative hidden md:block w-14 h-14 bg-gradient-to-br from-[#FFF8EA] to-white rounded-2xl shadow-inner border border-white p-2 shrink-0">
               <img 
                 src={illustration} 
                 alt="" 
                 className="w-full h-full object-contain animate-float"
               />
               <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#D0864B] rounded-lg flex items-center justify-center text-white shadow-lg border-2 border-white">
                  <Compass size={10} strokeWidth={3} />
               </div>
            </div>
            
            <div className="space-y-0.5 md:space-y-1">
              <h1 className="text-xl md:text-2xl font-black text-[#1A1512] tracking-tighter leading-none">
                Community <span className="text-[#D0864B]">Feed</span>
              </h1>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <p className="text-[8px] md:text-[9px] font-black text-[#D0864B]/60 uppercase tracking-[0.2em]">
                  Discussions & Updates
                </p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <Link 
              to="/discussions/my"
              className="flex-1 sm:flex-none text-center flex items-center justify-center gap-2 bg-white/60 hover:bg-white text-[#D0864B] px-4 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[11px] uppercase tracking-widest border border-[#ECA468]/10 transition-all hover:shadow-md active:scale-95"
            >
               My Posts
            </Link>
            <button 
              onClick={onCreatePost}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#D0864B] hover:bg-[#B36E39] text-white px-4 md:pl-4 md:pr-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[11px] uppercase tracking-widest shadow-xl shadow-[#D0864B]/20 transition-all hover:scale-[1.02] active:scale-[0.98] group"
            >
              <div className="hidden xs:block p-1 bg-white/20 rounded-lg group-hover:rotate-90 transition-transform duration-500">
                <Plus size={14} strokeWidth={3} />
              </div>
              <span>New Topic</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DiscussionsHeader;
