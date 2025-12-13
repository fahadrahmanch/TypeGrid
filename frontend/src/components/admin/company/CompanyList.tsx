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
        setCompany(res?.data?.data);
        setFilterCompany(res?.data?.data);
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
    filtered = filtered.filter((u)=>{
      if(status==="Accepted"){
        return u.status=="active";
      }else if(status==="Pending"){
        return u.status=="pending";
      }else if(status=="Rejected"){
        return u.status==="reject";
      }
    });
  }
  const total = Math.ceil(filtered.length / limit);
  setTotalPages(total);

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  setFilterCompany(paginated);
},[searchText, status, company,page]);
  return (
    <>
      <div className="bg-[#FFF3DB] w-[85rem] ml-10 pl-10 pt-6 pb-6 rounded-md shadow-sm">
        {/* Header Section */}
        <h1 className="font-bold text-2xl text-start">Company Management</h1>
        <p className="text-start text-gray-700">
          Manage and verify company registrations
        </p>
        {/* Search + Filter */}
        <div className="flex items-center gap-5 mt-4">
          <input
            className="py-2 px-4 w-[70rem] shadow-md rounded outline-none 
                 focus:ring-2 focus:ring-[#B99F8D] focus:ring-offset-1
                 transition-all duration-200"
            placeholder="Search users by name or email"
            value={searchText}
            onChange={(e)=>setSearchText(e.target.value)}
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-[#B99F8D]
                 text-sm outline-none text-black
                 focus:ring-2 focus:ring-[#B99F8D]"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        {/* Table Section */}
        <table className="w-[80rem] bg-white border rounded-lg mt-6">
          <thead>
            <tr className="bg-[#FFEFCE] border-b shadow-sm">
              <th className="px-4 py-2 text-left">Company Name</th>
              <th className="px-4 py-2 text-left">Contact Email</th>
              <th className="px-4 py-2 text-left">Created At</th>
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
                  <td className="px-4 py-2">
                    <p className="font-medium">{new Date(item?.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 text-sm rounded ${
                        item?.status === "pending"||item.status==="reject"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item?.status}
                    </span>
                  </td>

                  <td className="px-4 py-2 flex items-center gap-2">
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
      {isOpen && <CompanyDetailsModal setOpen={setOpen} company={selectedCompany} setCompany={setCompany} />}
          <div className="flex justify-center items-center gap-4 mt-4">
  <button
    disabled={page === 1}
    onClick={() => setPage(prev => prev - 1)}
    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
  >
    Prev
  </button>

  <span>Page {page} of {totalPages}</span>

  <button
    disabled={page === totalPages}
    onClick={() => setPage(prev => prev + 1)}
    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
  >
    Next
  </button>
</div>
    </>
  );
};
export default CompanyList;
