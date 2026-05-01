import { useEffect, useState } from "react";
import AddUser from "./addUser";
import { Trash2, Plus, Search, Mail, Target, Zap } from "lucide-react";
import ReusableTable from "../../common/ReusableTable";
import Pagination from "../../common/Pagination";
import { toast } from "react-toastify";
import { deleteCompanyUser, fetchCompanyUsers } from "../../../api/companyAdmin/companyAdminService";
import ConfirmModal from "../../common/ConfirmModal";

const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [filterUsers, setFilterUsers] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [limit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  const fetchUsers = async () => {
    try {
      const res = await fetchCompanyUsers(debouncedSearch, page, limit);
      if (res?.data?.success) {
        setUsers(res.data.data);
        setFilterUsers(res.data.data);
        setTotalCount(res.data.total);
        setTotalPages(Math.ceil(res.data.total / limit));
      } else {
        console.error("Failed to fetch company users:", res?.data?.message);
      }
    } catch (error) {
      console.error("Error fetching company users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch, page]);


  async function handleDelete(userID: string) {
    try {
      const response = await deleteCompanyUser(userID);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchUsers();
      }
    } catch (error: any) {
      console.log(error);
      const msg = error?.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(msg);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-8">
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Team Members</h1>
            <p className="text-gray-500 font-medium tracking-tight">
              Manage your company's students and track their typing performance.
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-[#D0864B] hover:bg-[#B36E39] text-white px-6 py-3.5 rounded-2xl transition-all shadow-lg shadow-[#D0864B]/20 font-bold group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            <span>Add New Member</span>
          </button>
        </div>

        {/* --- Main Table Container --- */}
        <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-sm border border-[#ECA468]/10 overflow-hidden">
          {/* Top Bar with Search */}
          <div className="p-8 border-b border-gray-100/50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="relative group w-full md:w-96">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D0864B] transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#ECA468]/10 focus:border-[#ECA468] transition-all font-bold text-gray-700 shadow-sm"
              />
            </div>

            <div className="flex items-center gap-4 text-gray-400 font-black text-[10px] uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                <span>{totalCount} Active Members</span>
              </div>
            </div>
          </div>

          {/* Table Content */}
            <ReusableTable
              columns={[
                {
                  header: "Member Details",
                  key: "memberDetails",
                  render: (member) => (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#ECA468]/10 flex items-center justify-center text-[#D0864B] font-black shadow-inner group-hover:bg-[#D0864B] group-hover:text-white transition-all duration-500 scale-95 group-hover:scale-100">
                        {member.name?.[0].toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 group-hover:text-[#D0864B] transition-colors">{member.name}</h4>
                        <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-tighter">
                          <Mail size={10} className="opacity-70" />
                          {member.email}
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  header: "Key Metrics",
                  key: "keyMetrics",
                  headerClassName: "text-center",
                  className: "text-center",
                  render: (member) => (
                    <div className="flex items-center justify-center gap-10">
                      <div className="text-center group/stat">
                        <div className="flex items-center justify-center gap-1.5 text-gray-900 font-black mb-0.5">
                          <Zap size={14} className="text-amber-500" />
                          <span className="text-base tracking-tighter">{member.wpm || 0}</span>
                        </div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest opacity-80">
                          WPM Rate
                        </span>
                      </div>
                      <div className="text-center group/stat">
                        <div className="flex items-center justify-center gap-1.5 text-gray-900 font-black mb-0.5">
                          <Target size={14} className="text-emerald-500" />
                          <span className="text-base tracking-tighter">{member.accuracy || 0}%</span>
                        </div>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest opacity-80">
                          Precision
                        </span>
                      </div>
                    </div>
                  ),
                },
                {
                  header: "Actions",
                  key: "actions",
                  headerClassName: "text-right",
                  className: "text-right",
                  render: (member) => (
                    <div className="flex justify-end opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                      <button
                        onClick={() => {
                          setSelectedUserId(member._id);
                          setIsConfirmOpen(true);
                        }}
                        className="p-3 text-gray-400 hover:text-rose-500 bg-white rounded-xl shadow-sm border border-gray-50 hover:border-rose-100 transition-all"
                        title="Remove Member"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ),
                },
              ]}
              data={filterUsers}
              emptyMessage="No members found"
            />

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      {isOpen && <AddUser setOpen={setOpen} onUserAdded={fetchUsers} />}

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Team Member"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => {
          setIsConfirmOpen(false);
          setSelectedUserId(null);
        }}
        onConfirm={async () => {
          if (!selectedUserId) return;
          await handleDelete(selectedUserId);
          setIsConfirmOpen(false);
          setSelectedUserId(null);
        }}
      />
    </>
  );
};

export default UsersTable;
