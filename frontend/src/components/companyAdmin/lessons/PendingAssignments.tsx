import React, { useEffect, useState } from "react";
import { User, Bell, Clock } from "lucide-react";

import ReusableTable from "../../common/ReusableTable";
import NotificationModal from "./NotificationModal";
import { getPendingUsers } from "../../../api/companyAdmin/lessons";

interface PendingUser {
  id: string;
  name: string;
  email: string;
  pendingLessons: number;
}

const PendingAssignments: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState<{ id: string; name: string; email: string }[]>([]);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  // const [allUserIds, setAllUserIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  

  const handleNotifyIndividual = (user: PendingUser) => {
    setSelectedRecipients([{ id: user.id, name: user.name, email: user.email }]);
    setIsModalOpen(true);
  };

  const handleNotifyAll = () => {
    const recipients = pendingUsers.map((u) => ({ id: u.id, name: u.name, email: u.email }));
    if (recipients.length > 0) {
      setSelectedRecipients(recipients);
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        setIsLoading(true);
        const response = await getPendingUsers();
        if (response && response.data && response.data.success) {
          setPendingUsers(response.data.data);
          // setAllUserIds(response.data.userIds || []);
        }
      } catch (error) {
        console.error("Error fetching pending users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPendingUsers();
  }, []);

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-3xl border border-[#ECA468]/10 overflow-hidden min-h-[400px]">
      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recipients={selectedRecipients}

      />
      
      <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white/40">
        <div>
          <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest pl-2 font-black">Pending Completions</h3>
          <p className="text-[10px] text-[#D0864B] font-bold uppercase tracking-widest mt-1 pl-2">
            Track students who haven't finished assigned materials
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleNotifyAll}
            className="flex items-center gap-2 px-4 py-2 bg-[#D0864B]/10 hover:bg-[#D0864B]/20 text-[#D0864B] rounded-xl transition-all font-bold text-xs"
          >
            <Bell size={14} />
            <span>Notify All Pending</span>
          </button>
        </div>
      </div>

      <div className="p-4">
        <ReusableTable<PendingUser>
          columns={[
            {
              header: "Student",
              key: "name",
              className: "font-bold text-gray-800 text-sm",
              render: (user) => (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="font-black text-sm text-gray-900">{user.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      {user.email}
                    </p>
                  </div>
                </div>
              ),
            },
            {
              header: "Email Address",
              key: "email",
              className: "text-sm font-medium text-gray-500",
            },
            {
              header: "Pending Lessons",
              key: "pendingLessons",
              headerClassName: "text-center",
              className: "text-center",
              render: (user) => (
                <div className="flex items-center justify-center gap-2">
                   <Clock size={12} className="text-amber-500" />
                  <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 rounded-full bg-amber-50 text-[10px] font-black text-amber-600 border border-amber-100">
                    {user.pendingLessons}
                  </span>
                </div>
              ),
            },
            {
              header: "Actions",
              key: "actions",
              headerClassName: "text-right",
              className: "text-right",
              render: (user) => (
                <button
                  onClick={() => handleNotifyIndividual(user)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-600 hover:text-[#D0864B] rounded-xl border border-gray-100 hover:border-[#ECA468]/30 transition-all font-black text-[10px] uppercase tracking-widest shadow-sm group/btn"
                >
                  <Bell size={14} className="group-hover/btn:animate-ring" />
                  <span>Notify</span>
                </button>
              ),
            },
          ]}
          data={pendingUsers}
          isLoading={isLoading}
          emptyMessage="No pending assignments found"
        />
      </div>
    </div>
  );
};

export default PendingAssignments;
