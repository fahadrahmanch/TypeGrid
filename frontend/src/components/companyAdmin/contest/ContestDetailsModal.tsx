import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ContestLevel } from "./ContestCard";
import { fetchContestParticipants } from "../../../api/companyAdmin/companyContextAPI";
import EditContestModal from "./EditContestModal";
import { ContestProps } from "./ContestCard";
import { deleteContest } from "../../../api/companyAdmin/companyContextAPI";
interface ContestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contestData: {
    id: string;
    title: string;
    description?: string;
    mode: string;
    difficulty: ContestLevel;
    date?: string;
    time?: string;
    duration: number;
    participantsCount: number;
    maxParticipants: number;
    reward: string | number;
    status: string;
  };
  setContests: React.Dispatch<React.SetStateAction<ContestProps[]>>;
}

const ContestDetailsModal: React.FC<ContestDetailsModalProps> = ({
  isOpen,
  onClose,
  contestData,
  setContests,
}) => {
  const [participantsList, setParticipantsList] = useState<
    Array<{ name: string; email: string }>
  >([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  useEffect(() => {
    const fetchContest = async () => {
      try {
        const response = await fetchContestParticipants(contestData.id);
        setParticipantsList(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchContest();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      const response = await deleteContest(contestData.id);
      if (response.status === 200) {
        setContests((prev: any) =>
          prev.filter((contest: any) => contest._id !== contestData.id),
        );
      }
      onClose();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {contestData.title}
            </h2>
            <p className="text-sm text-gray-500">
              {contestData.description ||
                "Test your typing speed and accuracy in this exciting competition"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {/* Stats Grid */}
          <div className="bg-gray-50 rounded-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div>
              <span className="text-xs font-medium text-gray-400 mb-1 block">
                Mode
              </span>
              <span className="text-sm font-bold text-gray-900">
                {contestData.mode}
              </span>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 mb-1 block">
                Difficulty
              </span>
              <span className="text-sm font-bold text-gray-900 capitalize">
                {contestData.difficulty}
              </span>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 mb-1 block">
                Date
              </span>
              <span className="text-sm font-bold text-gray-900">
                {contestData.date || "-"}
              </span>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 mb-1 block">
                Time
              </span>
              <span className="text-sm font-bold text-gray-900">
                {contestData.time || "-"}
              </span>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 mb-1 block">
                Duration
              </span>
              <span className="text-sm font-bold text-gray-900">
                {contestData.duration} minutes
              </span>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 mb-1 block">
                Participants
              </span>
              <span className="text-sm font-bold text-gray-900">
                {contestData.participantsCount} / {contestData.maxParticipants}
              </span>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 mb-1 block">
                Reward
              </span>
              <span className="text-sm font-bold text-gray-900">
                {typeof contestData.reward === "number"
                  ? `$${contestData.reward}`
                  : contestData.reward}
              </span>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 mb-1 block">
                Status
              </span>
              <span className="text-sm font-bold text-gray-900">
                {contestData.status}
              </span>
            </div>
          </div>

          {/* Participants List */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              Participants ( {contestData.participantsCount} )
            </h3>

            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="bg-gray-50/80 px-4 py-3 grid grid-cols-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <div>Name</div>
                <div>Email</div>
              </div>

              <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto custom-scrollbar">
                {participantsList && participantsList.length > 0 ? (
                  participantsList.map((participant, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-3 grid grid-cols-2 text-sm items-center hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900">
                        {participant.name}
                      </div>
                      <div className="text-gray-500">{participant.email}</div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500 text-sm">
                    No participants yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex gap-3">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Contest
          </button>
          <button
            onClick={handleDelete}
            className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete Contest
          </button>
        </div>
      </div>
      <EditContestModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        contestId={contestData.id}
        onUpdate={() => {
          onClose(); // Close the details modal to reflect changes when reopened, or just let it be.
        }}
        setContests={setContests}
      />
    </div>
  );
};

export default ContestDetailsModal;
