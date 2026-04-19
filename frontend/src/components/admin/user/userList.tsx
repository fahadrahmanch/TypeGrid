import { useEffect, useState } from "react";
import { updateUserStatus, filterUsersAPI } from "../../../api/admin/users";
import ConfirmModal from "../../common/ConfirmModal";
import { Search, Filter, Shield, ShieldOff, Mail, Trophy, User as UserIcon } from "lucide-react";
import ReusableTable, { Column } from "../../common/ReusableTable";
import Pagination from "../../common/Pagination";

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
              : u
          )
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
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">User Management</h1>
            <p className="text-gray-500 font-medium">Monitor and manage all TypeGrid platform users.</p>
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
                <h3 className="text-xl font-black text-gray-900 leading-tight">Platform Users</h3>
                <p className="text-xs text-[#D0864B] font-bold uppercase tracking-widest mt-1">
                  {users.length} total registered users
                </p>
              </div>
            </div>

            <ReusableTable
              columns={[
                {
                  header: (
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-3 h-3" /> User Profile
                    </div>
                  ),
                  key: "profile",
                  render: (user) => (
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:flex w-10 h-10 rounded-2xl bg-[#ECA468]/10 items-center justify-center text-[#ECA468] font-black text-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{user.name}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  header: "Status",
                  key: "status",
                  headerClassName: "text-center",
                  className: "text-center",
                  render: (user) => {
                    const isActive = user.status === "active";
                    return (
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
                    );
                  },
                },
                {
                  header: (
                    <div className="flex items-center justify-center gap-2">
                      <Trophy className="w-3 h-3" /> Competitions
                    </div>
                  ),
                  key: "competitions",
                  headerClassName: "text-center hidden sm:table-cell",
                  className: "text-center hidden sm:table-cell",
                  render: () => (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg text-xs font-bold text-gray-500 border border-gray-100">
                      0
                    </div>
                  ),
                },
                {
                  header: "Actions",
                  key: "actions",
                  headerClassName: "text-right",
                  className: "text-right",
                  render: (user) => {
                    const isActive = user.status === "active";
                    return (
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
                          {isActive ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                        </button>
                      </div>
                    );
                  },
                },
              ]}
              data={users}
              emptyMessage="No platform users found"
            />

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>

        {/* Confirm Modal */}
        <ConfirmModal
          isOpen={showModal}
          title={selectedUser?.status === "active" ? "Block User" : "Unblock User"}
          message={`Are you sure you want to ${
            selectedUser?.status === "active" ? "block" : "unblock"
          } this user? This will affect their ability to participate in contests.`}
          confirmText={selectedUser?.status === "active" ? "Block User" : "Unblock User"}
          onConfirm={confirmBlockAction}
          onCancel={() => setShowModal(false)}
        />
      </div>
    </>
  );
};

export default UserList;
