import React from "react";
import { Eye, Trash, Users, Tag } from "lucide-react";
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
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <ReusableTable
          columns={[
            {
              header: "Group Name",
              key: "name",
              render: (group) => <span className="font-semibold text-gray-900 capitalize">{group.groupName}</span>,
            },
            {
              header: "Group Type",
              key: "type",
              render: (group) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#B99F8D]/10 text-[#B99F8D] border border-[#B99F8D]/20 capitalize">
                  {group.groupType}
                </span>
              ),
            },
            {
              header: "Users",
              key: "usersCount",
              className: "text-sm text-gray-600 font-medium",
              render: (group) => group.selectedUsers?.length || group.usersCount || 0,
            },
            {
              header: "Actions",
              key: "actions",
              headerClassName: "text-right",
              className: "text-right",
              render: (group) => (
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => navigate(`/company/admin/groups/${group._id}`)}
                    className="p-1.5 text-[#B99F8D] hover:bg-[#B99F8D]/10 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(group._id, group.groupName)}
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
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {groups.length === 0 ? (
          <div className="py-12 text-center bg-white/50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">No groups found. Create one to get started!</p>
          </div>
        ) : (
          groups.map((group) => (
            <div
              key={group._id}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4 active:scale-[0.98] transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-bold text-gray-900 text-lg capitalize">{group.groupName}</h3>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-[#B99F8D]/10 text-[#B99F8D] border border-[#B99F8D]/20">
                      <Tag size={10} className="mr-1" />
                      {group.groupType}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/company/admin/groups/${group._id}`)}
                    className="p-2.5 bg-[#B99F8D]/10 text-[#B99F8D] rounded-xl transition-colors"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(group._id, group.groupName)}
                    className="p-2.5 bg-red-50 text-red-500 rounded-xl transition-colors"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500">
                  <Users size={16} className="text-gray-400" />
                  <span className="text-sm font-bold">
                    {group.selectedUsers?.length || group.usersCount || 0}
                    <span className="text-gray-400 font-medium ml-1">Members</span>
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/company/admin/groups/${group._id}`)}
                  className="text-xs font-black uppercase tracking-widest text-[#B99F8D] hover:text-[#B99F8D]/80"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default GroupListTable;

