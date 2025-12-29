import { useEffect, useState } from "react";
import { getAllUsers } from "../../../api/admin/users";
import { blockUser } from "../../../api/admin/users";
import ConfirmModal from "../../common/ConfirmModal";
const UserList: React.FC = () => {
  const [status, setStatus] = useState("All");
  const [users, setUsers] = useState<any[]>([]);
  const [filterUsers,setFilterUsers]=useState<any[]>([]);
  const [searchText,setSearchText]=useState("");
  const [limit] = useState(8); 
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await getAllUsers();
        setUsers(res?.data?.data);
        setFilterUsers(res?.data?.data);
      } catch (error) {
        console.error("Error fetching users:", error);
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
  if (status !== "All") {
    filtered = filtered.filter(u =>
      status === "Active"
        ? u.status === "active"
        : u.status === "block"
    );
  }
  const total = Math.ceil(filtered.length / limit);
  setTotalPages(total);

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  setFilterUsers(paginated);
  // setFilterUsers(filtered);
}, [searchText, status, users,page]);

function openConfirmModal(user: any) {
  setSelectedUser(user);
  setShowModal(true);
}
async function confirmBlockAction() {
  if (!selectedUser) return;

  const userId = selectedUser._id;
  const res = await blockUser(userId);

  if (res.data.success) {
    setUsers(prev =>
      prev.map(u =>
        u._id === userId
          ? {
              ...u,
              status: u.status === "active" ? "blocked" : "active",
            }
          : u
      )
    );
  }

  setShowModal(false);
  setSelectedUser(null);
}

// async function handleBlock(userId: string) {
//   const user = users.find(u => u._id === userId);
//   if (!user) return;

//   const action =
//     user.status === "active" ? "block" : "unblock";

//   const confirmed = window.confirm(
//     `Are you sure you want to ${action} this user?`
//   );

//   if (!confirmed) return;

//   const res = await blockUser(userId);

//   if (res.data.success) {
//     setUsers(prev =>
//       prev.map(u =>
//         u._id === userId
//           ? {
//               ...u,
//               status: u.status === "active" ? "blocked" : "active",
//             }
//           : u
//       )
//     );
//   }
// }


  return (
    <>
      <div className="bg-[#FFF3DB] w-[85rem] ml-10 pl-10 pt-6 pb-6 rounded-md shadow-sm">
        {/* Header Section */}
        <h1 className="font-bold text-2xl text-start">User Management</h1>
        <p className="text-start text-gray-700">
          Manage and monitor all platform users
        </p>

        {/* Search + Filter */}
        <div className="flex items-center gap-5 mt-4">
          <input
            className="py-2 px-4 w-[70rem] shadow-md rounded outline-none 
                 focus:ring-2 focus:ring-[#B99F8D] focus:ring-offset-1
                 transition-all duration-200"
            placeholder="Search users by name or email"
             value={searchText}
             onChange={(e) => setSearchText(e.target.value)}

          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-[#B99F8D]
                 text-sm outline-none text-black
                 focus:ring-2 focus:ring-[#B99F8D]"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Block">Block</option>
          </select>
        </div>

        {/* Table Section */}
        <table className="w-[80rem] bg-white border rounded-lg mt-6">
          <thead>
            <tr className="bg-[#FFEFCE] border-b shadow-sm">
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Plan</th>
              {/* <th className="px-4 py-2 text-left">Join Date</th> */}
              <th className="px-4 py-2 text-left">Competitions</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-[#FCF8F0]">
            {filterUsers &&
              filterUsers?.map((user: any) => (
                <tr key={user._id} className="border-b text-start">
                  <td className="px-4 py-2">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 text-sm rounded font-semibold ${
                        user?.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user?.status === "active" ? "Active" : "Blocked"}
                    </span>
                  </td>

                  <td className="px-4 py-2">—</td>

                  {/* <td className="px-4 py-2">10</td> */}

                  <td className="px-4 py-2">-</td>

                  <td className="px-4 py-2 flex items-center gap-2">
                    {/* <button className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition">
                      View
                    </button> */}
                    <button
                      onClick={() => openConfirmModal(user)}
                      className={`px-3 py-1 text-sm rounded transition ${
                        user?.status === "active"
                          ? "bg-red-500 text-white hover:bg-red-600" // Show red Block button
                          : "bg-green-500 text-white hover:bg-green-600" // Show green Unblock button
                      }`}
                    >
                      {user?.status === "active" ? "Block" : "Unblock"}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
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
<ConfirmModal
  isOpen={showModal}
  title={
    selectedUser?.status === "active"
      ? "Block User"
      : "Unblock User"
  }
  message={`Are you sure you want to ${
    selectedUser?.status === "active" ? "block" : "unblock"
  } this user?`}
  confirmText={
    selectedUser?.status === "active" ? "Block" : "Unblock"
  }
  onConfirm={confirmBlockAction}
  onCancel={() => setShowModal(false)}
/>

    </>
  );
};
export default UserList;
