import React from "react";
import { Eye, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Group } from "../../../types/group";
import { deleteCompanyGroup } from "../../../api/companyAdmin/companyGroup";
import { toast } from "react-toastify";
import ReusableTable from "../../common/ReusableTable";

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
    <ReusableTable
      columns={[
        {
          header: "Group Name",
          key: "name",
          render: (group) => <span className="font-semibold text-gray-900 capitalize">{group.name}</span>,
        },
        {
          header: "Group Type",
          key: "type",
          render: (group) => (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 capitalize">
              {group.type}
            </span>
          ),
        },
        {
          header: "Users",
          key: "usersCount",
          className: "text-sm text-gray-600 font-medium",
          render: (group) => group.members?.length || group.usersCount || 0,
        },
        {
          header: "Avg WPM",
          key: "avgWpm",
          className: "text-sm text-gray-600 font-medium",
          render: (group) => (group.avgWpm !== undefined ? group.avgWpm.toFixed(1) : "-"),
        },
        {
          header: "Avg Accuracy",
          key: "avgAccuracy",
          className: "text-sm text-gray-600 font-medium",
          render: (group) => (group.avgAccuracy !== undefined ? `${group.avgAccuracy.toFixed(1)}%` : "-"),
        },
        {
          header: "Max Accuracy",
          key: "maxAccuracy",
          className: "text-sm text-gray-600 font-medium",
          render: (group) => (group.maxAccuracy !== undefined ? `${group.maxAccuracy.toFixed(1)}%` : "-"),
        },
        {
          header: "Actions",
          key: "actions",
          headerClassName: "text-right",
          className: "text-right",
          render: (group) => (
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => navigate(`/company/admin/groups/${group.id}`)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="View Details"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(group.id, group.name)}
                className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
                title="Delete Group"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          ),
        },
      ]}
      data={groups}
      emptyMessage="No groups found. Create one to get started!"
    />
  );
};

export default GroupListTable;
