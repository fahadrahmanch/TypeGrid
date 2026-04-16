import React from "react";
import { Eye, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Group } from "../../../types/group";
import { deleteCompanyGroup } from "../../../api/companyAdmin/companyGroup";
import { toast } from "react-toastify";

interface GroupListTableProps {
  groups: Group[];
  onDeleteSuccess?: () => void;
}

const GroupListTable: React.FC<GroupListTableProps> = ({ groups, onDeleteSuccess }) => {
  const navigate = useNavigate();

  const handleDelete = async (groupId: string, groupName: string) => {
    if (window.confirm(`Are you sure you want to delete the group "${groupName}"?`)) {
      try {
        await deleteCompanyGroup(groupId);
        toast.success("Group deleted successfully");
        if (onDeleteSuccess) onDeleteSuccess();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to delete group");
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-100">
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Group Name</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Group Type</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Users</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg WPM</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg Accuracy</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Max Accuracy</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {groups.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-gray-500 font-medium">
                No groups found. Create one to get started!
              </td>
            </tr>
          ) : (
            groups.map((group) => (
              <tr
                key={group.id}
                className="group hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none"
              >
                <td className="px-6 py-4">
                  <span className="font-semibold text-gray-900 capitalize">{group.name}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 capitalize">
                    {group.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                  {group.members?.length || group.usersCount || 0}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                  {group.avgWpm !== undefined ? group.avgWpm.toFixed(1) : "-"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                  {group.avgAccuracy !== undefined ? `${group.avgAccuracy.toFixed(1)}%` : "-"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                  {group.maxAccuracy !== undefined ? `${group.maxAccuracy.toFixed(1)}%` : "-"}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => navigate(`/company/admin/groups/${group.id}`)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {/* <button 
                      className="p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-lg transition-colors"
                      title="Edit Group"
                    >
                      <Pencil className="w-4 h-4" />
                    </button> */}
                    <button
                      onClick={() => handleDelete(group.id, group.name)}
                      className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
                      title="Delete Group"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GroupListTable;
