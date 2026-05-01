import React, { useEffect, useState } from "react";
import { Search, Eye, Trash2, ChevronLeft } from "lucide-react";
import Navbar from "../../../components/user/Navbar";
import { useNavigate } from "react-router-dom";
import { myDiscussions } from "../../../api/user/disscussions";
import { deleteDiscussion } from "../../../api/user/disscussions";
const MyPosts: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  interface Discussion {
    id: string;
    title: string;
    content: string;
    authorName: string;
    authorAvatar: string;
    postedAt: string;
    commentCount: number;
  }

  const [posts, setPosts] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMyDiscussions = async () => {
    try {
      const response = await myDiscussions();
      if (response.data && response.data.data) {
        setPosts(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getMyDiscussions();
  }, []);

    const handleDelete=async(id:string)=>{
      try {
        const response = await deleteDiscussion(id);

        if (response) {
          getMyDiscussions();
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };



  return (
    <div className="min-h-screen bg-[#FFF8EA]/50">
      <Navbar />
      
      <div className="pt-24 pb-12 max-w-6xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <h1 className="text-3xl font-black text-[#1A1512] tracking-tight">
            My <span className="text-[#D0864B]">Posts</span>
          </h1>
{/*           
          <button 
            className="flex items-center gap-2 bg-[#4285F4] hover:bg-[#3367D6] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Plus size={18} strokeWidth={3} />
            <span>New Post</span>
          </button> */}
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mb-8">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input 
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FFF8EA] border border-[#ECA468]/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#D0864B]/20 transition-all shadow-sm placeholder:text-gray-400"
          />
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-[2rem] border border-[#ECA468]/10 shadow-xl shadow-[#D0864B]/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFF8EA]">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Title</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-[#D0864B] transition-colors">
                      Date <ChevronLeft size={10} className="-rotate-90" />
                    </div>
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Comments</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECA468]/5">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-10 text-center text-gray-400 font-medium">
                      Loading posts...
                    </td>
                  </tr>
                ) : filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-10 text-center text-gray-400 font-medium">
                      No posts found.
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => (
                    <tr key={post.id} className="group hover:bg-[#FFF8EA]/30 transition-colors">
                      <td className="px-8 py-6">
                        <span className="text-sm font-bold text-[#1A1512] group-hover:text-[#D0864B] transition-colors cursor-pointer">
                          {post.title}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm text-gray-500 font-medium">{new Date(post.postedAt).toLocaleDateString()}</td>
                      <td className="px-8 py-6 text-sm text-gray-500 font-medium">{post.commentCount}</td>
                      <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => navigate(`/discussions/${post.id}`)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                        onClick={() => handleDelete(post.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-12">
          <button className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30">
            <span className="text-xs font-bold uppercase tracking-widest mr-4">Prev</span>
          </button>
          
          <button className="w-8 h-8 rounded-lg bg-[#FFF8EA] border border-[#ECA468]/20 flex items-center justify-center text-xs font-black text-[#D0864B] shadow-sm">
            1
          </button>
          <button className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center text-xs font-bold text-gray-400 transition-colors">
            2
          </button>
          <button className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center text-xs font-bold text-gray-400 transition-colors">
            3
          </button>
          <span className="text-gray-300 mx-1">...</span>
          <button className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center text-xs font-bold text-gray-400 transition-colors">
            10
          </button>

          <button className="p-2 text-gray-400 hover:text-gray-800 transition-colors">
            <span className="text-xs font-bold uppercase tracking-widest ml-4">Next</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyPosts;
