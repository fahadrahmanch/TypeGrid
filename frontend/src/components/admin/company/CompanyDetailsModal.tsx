import { updateCompanyStatus } from "../../../api/admin/company";
import { toast } from "react-toastify";
import { useState } from "react";

interface CompanyDetailsModalProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  company: any;
  setCompany: React.Dispatch<React.SetStateAction<any[]>>;
}

const CompanyDetailsModal: React.FC<CompanyDetailsModalProps> = ({
  setOpen,
  company,
  setCompany,
}) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  console.log(company,'company details modal');
  async function handleCompanyStatus(
    status: "active" | "reject"
  ) {
    try {
      if (!company?._id) return;

      const response = await updateCompanyStatus(
        company._id,
        status,
        status === "reject" ? rejectReason : undefined
      );

      // Prefer the server returned status; fall back to normalized local status
      const updatedStatus =
        response?.data?.data?.status ||
        (status === "active" ? "approved" : "rejected");

      toast.success(
        response?.data?.message ||
          `Company ${updatedStatus} successfully`
      );

      setCompany((prev) =>
        prev.map((c) =>
          c._id === company._id
            ? { ...c, status: updatedStatus }
            : c
        )
      );

      setShowRejectModal(false);
      setOpen(false);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        "Something went wrong";
      toast.error(errorMessage);
    }
  }

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

          {/* Header */}
          <div className="px-6 py-5 border-b flex justify-between bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              Company Details
            </h2>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto">
            <div className="flex justify-between mb-6">
              <h3 className="text-2xl font-bold">
                {company.companyName}
              </h3>

              {/* Status badge */}
              {(() => {
                const st = company?.status;
                const isApproved = st === "approved" || st === "active";
                const isRejected = st === "rejected" || st === "reject";
                const badgeClass = isApproved
                  ? "bg-green-100 text-green-700"
                  : isRejected
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700";
                const display = isApproved ? "Approved" : isRejected ? "Rejected" : st || "Pending";
                return (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
                    {display}
                  </span>
                );
              })()}
            </div>

            <p className="text-sm text-gray-600 mb-2">
              <strong>Email:</strong> {company.email}
            </p>
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500"
            >
              Cancel
            </button>

            {company.status === "pending" && (
              <>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="border border-red-300 text-red-600 px-4 py-2 rounded-md"
                >
                  Reject
                </button>

                <button
                  onClick={() => handleCompanyStatus("active")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Approve
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
            <h3 className="text-lg font-semibold mb-3">
              Reject Company
            </h3>

            <textarea
              rows={4}
              placeholder="Enter reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border rounded-md p-2"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="text-gray-500"
              >
                Cancel
              </button>

              <button
                disabled={!rejectReason.trim()}
                onClick={() => handleCompanyStatus("reject")}
                className="bg-red-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyDetailsModal;
