import React, { useState, useEffect } from "react";
import CompanyAdminSidebar from "../../components/companyAdmin/layout/CompanyAdminSideNavbar";
import { ArrowLeft, Plus, ChevronUp, ChevronDown } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import AddUsersModal from "../../components/companyAdmin/groups/AddUsersModal";
import { getCompanyGroupById } from "../../api/companyAdmin/companyGroup";
import { Group, GroupMember } from "../../types/group";
import { removeMemberFromGroup } from "../../api/companyAdmin/companyGroup";
import ReusableTable from "../../components/common/ReusableTable";
const GroupDetails: React.FC = () => {
  const { groupId } = useParams();
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGroupDetails = async () => {
    if (!groupId) return;
    try {
      setLoading(true);
      const response = await getCompanyGroupById(groupId);
      setGroup(response.data.group);
    } catch (error) {
      console.error("Error fetching group details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupDetails();
  }, [groupId]);

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeMemberFromGroup(groupId!, memberId);
      setGroup((prevGroup) => {
        if (!prevGroup) return null;
        return {
          ...prevGroup,
          members: prevGroup.members.filter((member) => {
            const id = typeof member === "string" ? member : member._id;
            return id !== memberId;
          }),
        };
      });
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#FFF8EA]">
        <CompanyAdminSidebar />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex min-h-screen bg-[#FFF8EA]">
        <CompanyAdminSidebar />
        <div className="flex-1 ml-64 p-8 text-center mt-20">
          <h2 className="text-2xl font-bold text-gray-900">Group not found</h2>
          <Link to="/company/admin/groups" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Groups
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FFF8EA]">
      <CompanyAdminSidebar />
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Back & Header */}
          <div className="space-y-6">
            <Link
              to="/company/admin/groups"
              className="inline-flex items-center text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Groups
            </Link>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1 capitalize">
                  {group.name}
                  <span className="text-gray-400 font-normal text-lg ml-3">#{groupId?.slice(-6)}</span>
                </h1>
                <p className="text-gray-500 capitalize">{group.type} Users</p>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Users
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-sm font-semibold text-gray-500 mb-1">Total Users</p>
              <div className="text-3xl font-bold text-gray-900">{group.members?.length || group.usersCount || 0}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-sm font-semibold text-gray-500 mb-1">Average WPM</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  {group.avgWpm !== undefined ? group.avgWpm.toFixed(1) : "-"}
                </span>
                {group.avgWpm !== undefined && (
                  <span className="text-green-500">
                    <ChevronUp className="w-5 h-5" />
                  </span>
                )}
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-sm font-semibold text-gray-500 mb-1">Average Accuracy</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  {group.avgAccuracy !== undefined ? `${group.avgAccuracy.toFixed(1)}%` : "-"}
                </span>
                {group.avgAccuracy !== undefined && (
                  <span className="text-green-500">
                    <ChevronUp className="w-5 h-5" />
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Members Table */}
            <ReusableTable
              columns={[
                {
                  header: "Name",
                  key: "name",
                  className: "font-semibold text-gray-900 text-sm",
                  render: (member) => {
                    const memberData: Partial<GroupMember> =
                      typeof member === "string" ? { _id: member, name: "User " + member.slice(-4) } : member;
                    return memberData.name;
                  },
                },
                {
                  header: "Email",
                  key: "email",
                  className: "text-gray-500 text-sm",
                  render: (member) => {
                    const memberData: Partial<GroupMember> = typeof member === "object" ? member : {};
                    return memberData.email || "-";
                  },
                },
                {
                  header: "WPM",
                  key: "wpm",
                  className: "text-gray-600 font-medium text-sm",
                  render: (member) => {
                    const memberData: Partial<GroupMember> = typeof member === "object" ? member : {};
                    return memberData.wpm !== undefined ? memberData.wpm : "-";
                  },
                },
                {
                  header: "Accuracy",
                  key: "accuracy",
                  className: "text-gray-600 font-medium text-sm",
                  render: (member) => {
                    const memberData: Partial<GroupMember> = typeof member === "object" ? member : {};
                    return memberData.accuracy !== undefined ? `${memberData.accuracy}%` : "-";
                  },
                },
                {
                  header: "Actions",
                  key: "actions",
                  headerClassName: "text-right",
                  className: "text-right",
                  render: (member) => {
                    const memberData: Partial<GroupMember> =
                      typeof member === "string" ? { _id: member } : (member as GroupMember);
                    return (
                      <button
                        onClick={() => memberData._id && handleRemoveMember(memberData._id)}
                        className="text-xs font-semibold text-red-500 hover:text-red-700 hover:underline"
                      >
                        Remove
                      </button>
                    );
                  },
                },
              ]}
              data={group.members || []}
              emptyMessage="No members in this group."
            />
        </div>

        {/* Add User Modal */}
        <AddUsersModal
          isOpen={isAddUserModalOpen}
          onClose={() => setIsAddUserModalOpen(false)}
          groupId={groupId!}
          onUserAdded={fetchGroupDetails}
        />
      </div>
    </div>
  );
};

export default GroupDetails;
