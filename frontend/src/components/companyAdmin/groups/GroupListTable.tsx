import React from "react";
import { Eye, Pencil, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface Group {
    id: string;
    name: string;
    type: string;
    usersCount: number;
    avgWpm: number;
    avgAccuracy: number;
}

interface GroupListTableProps {
    groups: Group[];
}

const GroupListTable: React.FC<GroupListTableProps> = ({ groups }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Group Name
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Group Type
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Users
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Avg WPM
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Avg Accuracy
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {groups.map((group) => (
                        <tr
                            key={group.id}
                            className="group hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none"
                        >
                            <td className="px-6 py-4">
                                <span className="font-semibold text-gray-900">{group.name}</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                    {group.type}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                {group.usersCount}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                {group.avgWpm}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                {group.avgAccuracy} %
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-3">
                                    <button
                                        onClick={() => navigate(`/company/admin/groups/${group.id}`)}
                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-lg transition-colors">
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors">
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GroupListTable;
