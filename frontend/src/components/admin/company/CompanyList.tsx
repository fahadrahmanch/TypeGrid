import { useState, useEffect } from "react";
import CompanyDetailsModal from "./CompanyDetailsModal";
import { getAllcompanies } from "../../../api/admin/company";
const CompanyList: React.FC = () => {
  const [status, setStatus] = useState("All");
  const [isOpen, setOpen] = useState(false);
  const [company, setCompany] = useState<any[]>([]);
  const [filterCompany,setFilterCompany]=useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [searchText,setSearchText]=useState("");
  const [limit] = useState(8); 
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await getAllcompanies();
        setCompany(res?.data?.data.reverse());
        setFilterCompany(res?.data?.data.reverse());
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    fetchCompanies();
  }, []);
  
  useEffect(() => {
  let filtered = [...company];

 if (searchText.trim()) {
  const lower = searchText.toLowerCase();
  filtered = filtered.filter(u =>
    u.companyName.toLowerCase().startsWith(lower) ||
    u.email.toLowerCase().startsWith(lower)
  );
}
  if (status !== "All") {
    filtered = filtered.filter((u) => {
      if (status === "Accepted") {
        return u.status === "active" || u.status === "approved";
      } else if (status === "Pending") {
        return u.status === "pending";
      } else if (status == "Rejected") {
        return u.status === "reject" || u.status === "rejected";
      }
      return true;
    });
  }
  const total = Math.ceil(filtered.length / limit);
  setTotalPages(total);

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  setFilterCompany(paginated.reverse());
},[searchText, status, company,page]);
  return (
    <>
  <div className="md:ml-64 p-4 sm:p-6">
    <div className="bg-[#FFF3DB] w-full px-4 sm:px-6 py-6 rounded-md shadow-sm">
      {/* Header Section */}
      <h1 className="font-bold text-xl sm:text-2xl">Company Management</h1>
      <p className="text-gray-700 text-sm sm:text-base">
        Manage and verify company registrations
      </p>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 mt-4">
        <input
          className="py-2 px-4 w-full shadow-md rounded outline-none 
               focus:ring-2 focus:ring-[#B99F8D] focus:ring-offset-1
               transition-all duration-200"
          placeholder="Search companies by name or email"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md bg-[#B99F8D]
               text-sm outline-none text-black
               focus:ring-2 focus:ring-[#B99F8D] w-full sm:w-auto"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-max w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-[#FFEFCE] border-b shadow-sm">
              <th className="px-4 py-2 text-left">Company Name</th>
              <th className="px-4 py-2 text-left">Contact Email</th>
              <th className="px-4 py-2 text-left hidden sm:table-cell">Created At</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-[#FCF8F0]">
            {filterCompany &&
              filterCompany.map((item: any) => (
                <tr key={item?._id} className="border-b text-start">
                  <td className="px-4 py-2">
                    <p className="font-medium">{item?.companyName}</p>
                  </td>
                  <td className="px-4 py-2">
                    <p className="font-medium">{item?.email}</p>
                  </td>
                  <td className="px-4 py-2 hidden sm:table-cell">
                    <p className="font-medium">
                      {new Date(item?.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-4 py-2">
                    {(() => {
                      const st = item?.status;
                      const isApproved = st === "approved" || st === "active";
                      const isRejected = st === "rejected" || st === "reject";
                      const badgeClass = isApproved
                        ? "bg-green-100 text-green-700"
                        : isRejected
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700";
                      const display = isApproved
                        ? "Approved"
                        : isRejected
                        ? "Rejected"
                        : st
                        ? st
                        : "Pending";

                      return (
                        <span className={`px-2 py-1 text-sm rounded ${badgeClass}`}>
                          {display}
                        </span>
                      );
                    })()}
                  </td>

                  <td className="px-4 py-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setSelectedCompany(item);
                        setOpen(true);
                      }}
                      className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Company Details Modal */}
    {isOpen && (
      <CompanyDetailsModal
        setOpen={setOpen}
        company={selectedCompany}
        setCompany={setCompany}
      />
    )}

    {/* Pagination */}
    <div className="flex justify-center items-center gap-4 mt-4 flex-wrap">
      <button
        disabled={page === 1}
        onClick={() => setPage((prev) => prev - 1)}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Prev
      </button>

      <span className="text-sm sm:text-base">
        Page {page} of {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => setPage((prev) => prev + 1)}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</>

  );
};
export default CompanyList;
