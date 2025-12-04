import { useEffect, useState } from "react";
import AddUser from "./addUser";
const UsersTable: React.FC = () => {
  const [isOpen, setOpen] = useState(false);
  useEffect(()=>{
   async function fetchUsers(){
  //  const res=await r 
   }
   fetchUsers()
  },[])

  const teamMembers = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@company.com",
      joined: "2024-01-15",
      wpm: "72 WPM",
      accuracy: "94%",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@company.com",
      joined: "2024-01-20",
      wpm: "85 WPM",
      accuracy: "97%",
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "mbrown@company.com",
      joined: "2024-02-01",
      wpm: "68 WPM",
      accuracy: "91%",
    },
  ];

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
                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
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
              {teamMembers.map((member) => (
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
                  <td className="py-6 px-4">
                    <span className="text-gray-400 text-sm font-medium">
                      {member.joined}
                    </span>
                  </td>

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
                    <button className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-all">
                      <i className="fa-regular fa-trash-can text-lg"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isOpen && <AddUser setOpen={setOpen} />}
    </>
  );
};

export default UsersTable;
