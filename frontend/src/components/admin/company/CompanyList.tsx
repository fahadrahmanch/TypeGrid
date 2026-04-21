import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import CompanyDetailsModal from "./CompanyDetailsModal";
import { companies } from "../../../api/admin/company";
import { Search, Filter, Eye, Building2, Mail, Calendar } from "lucide-react";
import ReusableTable from "../../common/ReusableTable";
import Pagination from "../../common/Pagination";

const CompanyList: React.FC = () => {
  const [status, setStatus] = useState("All");
  const [isOpen, setOpen] = useState(false);
  const [company, setCompany] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [searchText, setSearchText] = useState("");
  const [limit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(searchText);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);
  useEffect(() => {
    fetchCompanies();
  }, [debouncedSearch, page]);

  async function fetchCompanies() {
    try {
      const res = await companies(searchText, status, page, limit);
      const data = res?.data?.data || [];
      setCompany([...data].reverse());
      const total = Math.ceil(res?.data?.total / limit);
      setTotalPages(total);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  }
  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <>
      <div className="md:ml-64 p-8 min-h-screen bg-[#FFF8EA]">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Company Management</h1>
            <p className="text-gray-500 font-medium">Manage and verify company registrations on the platform.</p>
          </div>

          {/* Search & Filters */}
          <div className="bg-[#fff8ea]/60 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-[#ECA468]/10 mb-8 flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by company name or email..."
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
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="reject">Reject</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-[#fff8ea]/60 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-sm border border-[#ECA468]/10 overflow-hidden">
            <div className="flex justify-between items-center mb-8 px-2">
              <div>
                <h3 className="text-xl font-black text-gray-900 leading-tight">Registrations</h3>
                <p className="text-xs text-[#D0864B] font-bold uppercase tracking-widest mt-1">
                  {company.length} total applications
                </p>
              </div>
            </div>

            <ReusableTable
              columns={[
                {
                  header: (
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3 h-3" /> Company
                    </div>
                  ),
                  key: "companyName",
                  className: "font-bold text-gray-800 text-sm",
                },
                {
                  header: (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3" /> Contact
                    </div>
                  ),
                  key: "email",
                  className: "font-medium text-gray-500 text-xs italic",
                },
                {
                  header: (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> Applied On
                    </div>
                  ),
                  key: "createdAt",
                  className: "hidden sm:table-cell text-xs font-semibold text-gray-400",
                  render: (item) =>
                    new Date(item.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }),
                },
                {
                  header: "Status",
                  headerClassName: "text-center",
                  className: "text-center",
                  key: "status",
                  render: (item) => {
                    const st = item?.status;
                    const isActive = st === "active";
                    const isRejected = st === "reject";
                    const isInactive = st === "inactive";
                    const isExpired = st === "expired";
                    return (
                      <span
                        className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg border
                        ${
                          isActive
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : isRejected
                              ? "bg-red-50 text-red-600 border-red-100"
                            : isInactive
                                ? "bg-gray-50 text-gray-600 border-gray-100"
                                : isExpired
                                  ? "bg-orange-50 text-orange-600 border-orange-100"
                                  : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}
                      >
                        {isActive
                          ? "Active"
                          : isRejected
                            ? "Rejected"
                            : isInactive
                              ? "Inactive"
                              : isExpired
                                ? "Expired"
                                : "Pending"}
                      </span>
                    );
                  },
                },
                {
                  header: "Actions",
                  headerClassName: "text-right",
                  className: "text-right",
                  key: "actions",
                  render: (item) => (
                    <div className="flex justify-end gap-2 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      <button
                        onClick={() => {
                          setSelectedCompany(item);
                          setOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-[#ECA468] bg-white rounded-lg shadow-sm border border-gray-50 hover:border-[#FADDB8] transition-all"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  ),
                },
              ]}
              data={company}
              emptyMessage="No company applications found"
            />

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>

        {/* Company Details Modal - Using Portal */}
        {isOpen &&
          createPortal(
            <CompanyDetailsModal setOpen={setOpen} company={selectedCompany} setCompany={setCompany} />,
            document.body
          )}
      </div>
    </>
  );
};

export default CompanyList;
