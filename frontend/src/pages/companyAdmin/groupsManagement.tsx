import React, { useState, useEffect } from "react";
import CompanyAdminSidebar from "../../components/companyAdmin/layout/CompanyAdminSideNavbar";
import { Plus } from "lucide-react";
import GroupListTable from "../../components/companyAdmin/groups/GroupListTable";
import { Group } from "../../types/group";
import CreateGroupModal from "../../components/companyAdmin/groups/CreateGroupModal";
import { getCompanyGroups } from "../../api/companyAdmin/companyGroup";
import Pagination from "../../components/common/Pagination";

const GroupsManagement: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [groups, setGroups] = useState<Group[]>([]);
   const [limit] = useState(5);
    const [page, setPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
 useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);
    useEffect(() => {
      fetchGroups();
    }, [debouncedSearch, page]);
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await getCompanyGroups(debouncedSearch, limit, page);
      setGroups(response.data.groups || []);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen bg-[#FFF8EA]">
      <CompanyAdminSidebar />
      <div className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 overflow-y-auto pt-20 md:pt-12">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          {/* Header */}
          <div className="flex flex-col gap-1 md:gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">User Group Management</h1>
            <p className="text-xs md:text-sm text-gray-500 font-medium">Organize and track user performance groups</p>
          </div>

          {/* Search and Action Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search groups..."
                className="w-full px-4 py-3 bg-white border-transparent rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B99F8D]/20 text-sm placeholder-gray-400"
              />
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#B99F8D] text-white font-semibold rounded-xl shadow-lg shadow-[#B99F8D]/20 hover:bg-[#B99F8D]/80 hover:-translate-y-0.5 transition-all text-sm md:text-base whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Create Group
            </button>
          </div>

          {/* Tabs */}
          {/* <div className="flex items-center gap-2">
            {["All Groups", "Beginner", "Intermediate", "Advanced"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-transparent"
                }`}
              >
                {tab}
              </button>
            ))}
          </div> */}

          {/* Groups List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B99F8D]"></div>
            </div>
          ) : (
            <>
              <GroupListTable groups={groups} onDeleteSuccess={fetchGroups} />
              <Pagination
                currentPage={page}
                totalPages={total}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </>
          )}
        </div>

        {/* Create Group Modal */}
        <CreateGroupModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onGroupCreated={fetchGroups}
        />
      </div>
    </div>
  );
};

export default GroupsManagement;
