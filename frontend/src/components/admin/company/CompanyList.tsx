import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import CompanyDetailsModal from "./CompanyDetailsModal";
import { companies } from "../../../api/admin/company";
import { Search, Filter, Eye, ChevronLeft, ChevronRight, Building2, Mail, Calendar } from "lucide-react";

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
        const res = await companies(searchText,status,page, limit);
        const data = res?.data?.data || [];
        setCompany([...data].reverse());
        const total=Math.ceil(res?.data?.total/limit);
        setTotalPages(total);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    }
    fetchCompanies();

 
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
                <option value="reject">Reject</option>
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

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left font-black text-[10px] uppercase tracking-widest text-gray-400">
                    <th className="pb-4 px-4"><div className="flex items-center gap-2"><Building2 className="w-3 h-3" /> Company</div></th>
                    <th className="pb-4 px-4"><div className="flex items-center gap-2"><Mail className="w-3 h-3" /> Contact</div></th>
                    <th className="pb-4 px-4 hidden sm:table-cell"><div className="flex items-center gap-2"><Calendar className="w-3 h-3" /> Applied On</div></th>
                    <th className="pb-4 px-4 text-center">Status</th>
                    <th className="pb-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {company.map((item: any) => {
                    const st = item?.status;
                    const isApproved = st === "approved" || st === "active";
                    const isRejected = st === "rejected" || st === "reject";
                    
                    return (
                      <tr key={item?._id} className="group hover:bg-white/40 transition-all duration-300">
                        <td className="py-5 px-4 font-bold text-gray-800 text-sm">
                          {item?.companyName}
                        </td>
                        <td className="py-5 px-4 font-medium text-gray-500 text-xs italic">
                          {item?.email}
                        </td>
                        <td className="py-5 px-4 hidden sm:table-cell text-xs font-semibold text-gray-400">
                          {new Date(item?.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                          })}
                        </td>
                        <td className="py-5 px-4 text-center">
                          <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg border
                            ${isApproved ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                              isRejected ? "bg-red-50 text-red-600 border-red-100" : 
                              "bg-amber-50 text-amber-600 border-amber-100"}`}>
                            {isApproved ? "Approved" : isRejected ? "Rejected" : "Pending"}
                          </span>
                        </td>
                        <td className="py-5 px-4">
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
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
              <div className="mt-10 flex justify-center items-center gap-6">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="p-3 bg-white rounded-xl shadow-sm border border-gray-50 disabled:opacity-30 hover:border-[#FADDB8] text-[#D0864B] transition-all group"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-gray-900 tracking-tighter w-4 text-center">{page}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#D0864B]/40">of {totalPages}</span>
                </div>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="p-3 bg-white rounded-xl shadow-sm border border-gray-50 disabled:opacity-30 hover:border-[#FADDB8] text-[#D0864B] transition-all group"
                >
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
          </div>
        </div>

        {/* Company Details Modal - Using Portal */}
        {isOpen && createPortal(
          <CompanyDetailsModal
            setOpen={setOpen}
            company={selectedCompany}
            setCompany={setCompany}
          />,
          document.body
        )}
      </div>
    </>
  );
};

export default CompanyList;
