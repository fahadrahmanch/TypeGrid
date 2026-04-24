import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DiscussionsHeader from "../../../components/user/discussions/DiscussionsHeader";
import DiscussionCard from "../../../components/user/discussions/DiscussionCard";
import CreatePostModal from "../../../components/user/discussions/CreatePostModal";
import Navbar from "../../../components/user/Navbar";
import { createPost } from "../../../api/user/disscussions";
import { getAllDiscussions } from "../../../api/user/disscussions";
interface IDiscussion {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorAvatar?: string;
  postedAt: string;
  commentCount: number;
}

const DiscussionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<IDiscussion[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const LIMIT = 5;

  const fetchPosts = async (currentPage: number, append: boolean = false) => {
    try {
      if (append) setIsLoadingMore(true);
      const response = await getAllDiscussions(currentPage, LIMIT);
      const newPosts = response.data.data;
      
      if (newPosts) {
        if (append) {
          setPosts(prev => [...prev, ...newPosts]);
        } else {
          setPosts(newPosts);
        }
        
        if (newPosts.length < LIMIT) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch discussions:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, true);
  };

  const handleCreatePost = async (data: { title: string; content: string }) => {
    try {
      await createPost(data);
      setIsModalOpen(false);
      // Refresh to show the new post at the top
      setPage(1);
      setHasMore(true);
      fetchPosts(1);
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const handleCardClick = (id: string) => {
    navigate(`/discussions/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#FFF8EA]/50">
      <Navbar />
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#D0864B]/3 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#ECA468]/3 blur-[120px] rounded-full" />
      </div>

      <div className="pt-16">
        <DiscussionsHeader onCreatePost={() => setIsModalOpen(true)} />
      </div>
      
      <main className="relative z-10 max-w-4xl mx-auto px-6 pb-24 pt-8">
        <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {posts.map((post) => (
            <DiscussionCard 
              key={post.id} 
              post={post} 
              onClick={handleCardClick} 
            />
          ))}
        </div>

        {/* Premium Load More Interaction */}
        {hasMore && (
          <div className="mt-16 flex flex-col items-center gap-4">
              <div className="h-12 w-[1px] bg-gradient-to-b from-[#ECA468]/20 to-transparent" />
              <button 
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="relative group px-12 py-5 bg-white rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] text-[#D0864B] shadow-[0_10px_40px_-10px_rgba(208,134,75,0.15)] border border-white hover:border-[#ECA468]/20 transition-all duration-500 overflow-hidden disabled:opacity-50"
              >
                  <div className="absolute inset-0 bg-[#D0864B] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                    {isLoadingMore ? 'Loading...' : 'Load Older Stories'}
                  </span>
              </button>
          </div>
        )}
      </main>

      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreatePost} 
      />
    </div>
  );
};

export default DiscussionsPage;
