import { useEffect, useState } from "react";
import AddUser from "./addUser";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { deleteCompanyUser, fetchCompanyUsers } from "../../../api/companyAdmin/companyAdminService";
const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [filterUsers,setFilterUsers]=useState<any[]>([]);
  const [searchText,setSearchText]=useState("");
   const [limit] = useState(8); 
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  useEffect(() => {
  async function fetchUsers() {
    try {
      const res = await fetchCompanyUsers();
      if (res?.data?.success) {
        setUsers(res.data.data);
        setFilterUsers(res?.data?.data);
      } else {
        console.error("Failed to fetch company users:", res?.data?.message);
      }
    } catch (error) {
      console.error("Error fetching company users:", error);
    }
  }
  fetchUsers();
}, []);
  useEffect(() => {
  let filtered = [...users];

 if (searchText.trim()) {
  const lower = searchText.toLowerCase();
  filtered = filtered.filter(u =>
    u.name.toLowerCase().startsWith(lower) ||
    u.email.toLowerCase().startsWith(lower)
  );
}
  const total = Math.ceil(filtered.length / limit);
  setTotalPages(total);

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  setFilterUsers(paginated);

  // setFilterUsers(filtered);
}, [searchText, users,page]);

async function handleDelete(userID:string){
  try{
  const response = await deleteCompanyUser(userID);
  if(response.data.success){
    setUsers(prev=>prev.filter((item)=>item._id!=userID));
    toast.success(response.data.message);
  }
  }
  catch(error:any){
    console.log(error);
      const msg =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(msg);
  }

}

  return (
    <>
      <div className="w-full bg-[#FFF3DB] rounded-lg shadow-sm p-8 ml-28 mt-8">
        {/* --- Top Header Section --- */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-gray-800">Team Members</h2>

          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-[#B99F8D] hover:bg-[#9d8472] text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
          >
            <i className="fa-solid fa-plus text-sm"></i>
            Add User
          </button>
        </div>

        {/* --- Search Input --- */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or email..."
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-b focus:border-[#B99F8D] bg-transparent"
            />
          </div>
        </div>

        {/* --- Table Section --- */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            {/* Table Head */}
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                {/* <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Joined
                </th> */}
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Avg WPM
                </th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Accuracy
                </th>
                <th className="text-right py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {filterUsers.map((member:any) => (
                <tr
                  key={member.id}
                  className="group border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  {/* Name */}
                  <td className="py-6 px-4">
                    <span className="font-bold text-gray-800 text-sm">
                      {member.name}
                    </span>
                  </td>

                  {/* Email */}
                  <td className="py-6 px-4">
                    <span className="text-gray-500 text-sm">
                      {member.email}
                    </span>
                  </td>

                  {/* Joined Date */}
                  {/* <td className="py-6 px-4">
                    <span className="text-gray-400 text-sm font-medium">
                      {member.joined}
                    </span>
                  </td> */}

                  {/* WPM */}
                  <td className="py-6 px-4">
                    <span className="font-bold text-gray-700 text-sm">
                      {member.wpm}
                    </span>
                  </td>

                  {/* Accuracy */}
                  <td className="py-6 px-4">
                    <span className="font-semibold text-gray-600 text-sm">
                      {member.accuracy}
                    </span>
                  </td>

                  {/* Actions (Delete Icon) */}
                  <td className="py-6 px-4 text-right">
                    <button  onClick={()=>handleDelete(member._id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-all">
                     <Trash2 size={22} className="text-red-500 cursor-pointer" />

                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isOpen && <AddUser setOpen={setOpen} setUsers={setUsers} />}
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

export default UsersTable;
