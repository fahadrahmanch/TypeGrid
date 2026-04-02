import { useEffect, useState } from "react";
import { updateUserStatus, filterUsersAPI } from "../../../api/admin/users";
import ConfirmModal from "../../common/ConfirmModal";
import {
  Search,
  Filter,
  Shield,
  ShieldOff,
  User,
  Mail,
  ChevronLeft,
  ChevronRight,
  Hash,
  Trophy,
} from "lucide-react";

const UserList: React.FC = () => {
  const [status, setStatus] = useState("All");
  const [users, setUsers] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [limit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  function openConfirmModal(user: any) {
    setSelectedUser(user);
    setShowModal(true);
  }

  async function confirmBlockAction() {
    if (!selectedUser) return;
    const userId = selectedUser._id;
    try {
      const res = await updateUserStatus(userId);
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId
              ? {
                  ...u,
                  status: u.status === "active" ? "blocked" : "active",
                }
              : u,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
    setShowModal(false);
    setSelectedUser(null);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      search();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText, status, page]);
  const search = async () => {
    const response = await filterUsersAPI(searchText, status, page, limit);
    const users = response?.data?.users;
    const total = response?.data?.total;

    const totalPages = Math.ceil(total / limit);
    setTotalPages(totalPages);
    setUsers(users);
  };

  return (
    <>
      <div className="md:ml-64 p-8 min-h-screen bg-[#FFF8EA]">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
              User Management
            </h1>
            <p className="text-gray-500 font-medium">
              Monitor and manage all TypeGrid platform users.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="bg-[#fff8ea]/60 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-[#ECA468]/10 mb-8 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full pl-12 pr-4 py-3 bg-white/70 rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all placeholder:text-gray-400 font-medium text-gray-800"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="relative min-w-[160px]">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D0864B]" />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-white/70 rounded-xl border border-gray-100 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] appearance-none cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Block">Blocked</option>
              </select>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-[#fff8ea]/60 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-sm border border-[#ECA468]/10 overflow-hidden">
            <div className="flex justify-between items-center mb-8 px-2">
              <div>
                <h3 className="text-xl font-black text-gray-900 leading-tight">
                  Platform Users
                </h3>
                <p className="text-xs text-[#D0864B] font-bold uppercase tracking-widest mt-1">
                  {users.length} total registered users
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left font-black text-[10px] uppercase tracking-widest text-gray-400">
                    <th className="pb-4 px-4">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3" /> User Profile
                      </div>
                    </th>
                    <th className="pb-4 px-4 text-center">Status</th>
                    <th className="pb-4 px-4 text-center hidden sm:table-cell">
                      <div className="flex items-center justify-center gap-2">
                        <Trophy className="w-3 h-3" /> Competitions
                      </div>
                    </th>
                    <th className="pb-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {users.map((user: any) => {
                    const isActive = user.status === "active";

                    return (
                      <tr
                        key={user._id}
                        className="group hover:bg-white/40 transition-all duration-300"
                      >
                        <td className="py-5 px-4">
                          <div className="flex items-center gap-4">
                            <div className="hidden sm:flex w-10 h-10 rounded-2xl bg-[#ECA468]/10 items-center justify-center text-[#ECA468] font-black text-lg">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 text-sm">
                                {user.name}
                              </p>
                              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                                <Mail className="w-3 h-3" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-4 text-center">
                          <span
                            className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg border
                            ${
                              isActive
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : "bg-red-50 text-red-600 border-red-100"
                            }`}
                          >
                            {isActive ? "Active" : "Blocked"}
                          </span>
                        </td>
                        <td className="py-5 px-4 text-center hidden sm:table-cell">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg text-xs font-bold text-gray-500 border border-gray-100">
                            <Hash className="w-3 h-3 text-[#D0864B]" />0
                          </div>
                        </td>
                        <td className="py-5 px-4">
                          <div className="flex justify-end gap-2 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                            <button
                              onClick={() => openConfirmModal(user)}
                              className={`p-2 rounded-lg shadow-sm border transition-all ${
                                isActive
                                  ? "text-gray-400 hover:text-red-500 bg-white border-gray-50 hover:border-red-100"
                                  : "text-gray-400 hover:text-emerald-500 bg-white border-gray-50 hover:border-emerald-100"
                              }`}
                              title={isActive ? "Block User" : "Unblock User"}
                            >
                              {isActive ? (
                                <ShieldOff className="w-4 h-4" />
                              ) : (
                                <Shield className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-6 border-t border-[#ECA468]/5 pt-8">
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 disabled:opacity-30 hover:border-[#FADDB8] hover:text-[#D0864B] text-gray-400 transition-all group"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                  </button>

                  <div className="flex items-center gap-1">
                    {(() => {
                      const pages = [];
                      const showEllipsis = totalPages > 7;

                      if (!showEllipsis) {
                        for (let i = 1; i <= totalPages; i++) {
                          pages.push(i);
                        }
                      } else {
                        // Logic for ellipses
                        if (page <= 4) {
                          pages.push(1, 2, 3, 4, 5, "...", totalPages);
                        } else if (page >= totalPages - 3) {
                          pages.push(
                            1,
                            "...",
                            totalPages - 4,
                            totalPages - 3,
                            totalPages - 2,
                            totalPages - 1,
                            totalPages,
                          );
                        } else {
                          pages.push(
                            1,
                            "...",
                            page - 1,
                            page,
                            page + 1,
                            "...",
                            totalPages,
                          );
                        }
                      }

                      return pages.map((p, idx) =>
                        p === "..." ? (
                          <span
                            key={`ellipsis-${idx}`}
                            className="w-10 h-10 flex items-center justify-center text-gray-400 font-bold"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={`page-${p}`}
                            onClick={() => setPage(Number(p))}
                            className={`w-10 h-10 rounded-xl font-bold text-sm transition-all duration-300 ${
                              page === p
                                ? "bg-[#ECA468] text-white shadow-md shadow-[#ECA468]/20 scale-105"
                                : "bg-white text-gray-500 border border-gray-100 hover:border-[#ECA468]/30 hover:bg-[#FFF8EA]"
                            }`}
                          >
                            {p}
                          </button>
                        ),
                      );
                    })()}
                  </div>

                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 disabled:opacity-30 hover:border-[#FADDB8] hover:text-[#D0864B] text-gray-400 transition-all group"
                    title="Next Page"
                  >
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 bg-[#ECA468]/5 rounded-2xl border border-[#ECA468]/10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#D0864B]">
                    Page <span className="text-gray-900 mx-1">{page}</span> of{" "}
                    <span className="text-gray-900 ml-1">{totalPages}</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Confirm Modal */}
        <ConfirmModal
          isOpen={showModal}
          title={
            selectedUser?.status === "active" ? "Block User" : "Unblock User"
          }
          message={`Are you sure you want to ${
            selectedUser?.status === "active" ? "block" : "unblock"
          } this user? This will affect their ability to participate in contests.`}
          confirmText={
            selectedUser?.status === "active" ? "Block User" : "Unblock User"
          }
          onConfirm={confirmBlockAction}
          onCancel={() => setShowModal(false)}
        />
      </div>
    </>
  );
};

export default UserList;
