import { useState } from "react";
import CompanyDetailsModal from "./CompanyDetailsModal";
const CompanyList: React.FC = () => {
  const [status, setStatus] = useState("All");
  const [isOpen, setOpen] = useState(false);
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
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Created At</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-[#FCF8F0]">
            <tr className="border-b text-start">
              <td className="px-4 py-2">
                <p className="font-medium">Fahad</p>
                <p className="text-sm text-gray-600">fahad@example.com</p>
              </td>

              <td className="px-4 py-2">
                <span className="px-2 py-1 text-sm rounded bg-green-100 text-green-700">
                  Active
                </span>
              </td>

              <td className="px-4 py-2">—</td>

              <td className="px-4 py-2">10</td>
              <td className="px-4 py-2 flex items-center gap-2">
                <button
                  onClick={() => setOpen(true)}
                  className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                >
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {isOpen && <CompanyDetailsModal setOpen={setOpen} />}
    </>
  );
};
export default CompanyList;
