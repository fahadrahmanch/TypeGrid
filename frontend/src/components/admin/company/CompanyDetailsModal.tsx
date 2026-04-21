import { updateCompanyStatus } from "../../../api/admin/company";
import { toast } from "react-toastify";
import { useState } from "react";
import { X, Building2, Mail, CheckCircle2, AlertCircle, Calendar } from "lucide-react";

interface CompanyDetailsModalProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  company: any;
  setCompany: React.Dispatch<React.SetStateAction<any[]>>;
}

const CompanyDetailsModal: React.FC<CompanyDetailsModalProps> = ({ setOpen, company, setCompany }) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCompanyStatus(status: "active" | "reject" | "inactive") {
    try {
      if (!company?._id) return;
      setIsSubmitting(true);

      const response = await updateCompanyStatus(company._id, status, status === "reject" ? rejectReason : undefined);

      const updatedStatus =
        response?.data?.data?.status || (status === "active" ? "active" : status === "reject" ? "reject" : "inactive");

      toast.success(response?.data?.message || `Company ${updatedStatus} successfully`);

      setCompany((prev) => prev.map((c) => (c._id === company._id ? { ...c, status: updatedStatus } : c)));

      setShowRejectModal(false);
      setOpen(false);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  const st = company?.status;
  const isActive = st === "active";
  const isRejected = st === "reject";
  const isInactive = st === "inactive";
  const isExpired = st === "expired";
  const isPending = st === "pending";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FDFBF7]/90 backdrop-blur-sm animate-in fade-in duration-200 p-4 sm:p-8">
      {/* Main Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-[#ECA468]/10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-10 py-8 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-[#ECA468]/10 p-3 rounded-2xl">
              <Building2 className="w-6 h-6 text-[#ECA468]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 leading-tight">Company Details</h2>
              <p className="text-sm text-gray-500 font-medium">Review and verify registration details</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="p-2 text-gray-400 hover:text-gray-700 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-[#FDFBF7]">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-4xl font-black text-gray-900 tracking-tight">{company.companyName}</h3>

            <span
              className={`px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-xl border-2
              ${
                isActive
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                  : isRejected
                    ? "bg-red-50 text-red-600 border-red-100"
                      : isInactive
                        ? "bg-gray-50 text-gray-600 border-gray-100"
                        : isExpired
                          ? "bg-orange-50 text-orange-600 border-orange-100"
                          : "bg-amber-50 text-amber-600 border-amber-100"
                }`}
              >
                {isActive
                  ? "Active"
                  : isRejected
                    ? "Rejected"
                    : isInactive
                      ? "Inactive"
                      : isExpired
                        ? "Expired"
                        : "Pending Approval"}
              </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2 block">
                  Registration Email
                </label>
                <div className="flex items-center gap-3 text-gray-800 font-bold bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <Mail className="w-4 h-4 text-[#ECA468]" />
                  {company.email}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2 block">
                  Registration Date
                </label>
                <div className="flex items-center gap-3 text-gray-800 font-bold bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <Calendar className="w-4 h-4 text-[#ECA468]" />
                  {new Date(company.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2 block">
                  Company ID
                </label>
                <div className="flex items-center gap-3 text-gray-500 font-mono text-xs bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  {company._id}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2 block">
                  Admin Status
                </label>
                <div className="flex items-center gap-3 text-gray-800 font-bold bg-white p-4 rounded-2xl border border-gray-100 shadow-sm capitalize">
                  {isActive ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : isRejected ? (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  ) : isInactive ? (
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                  ) : isExpired ? (
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                  {company.status || "Unknown"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-10 py-8 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-4 shadow-inner">
          <button
            onClick={() => setOpen(false)}
            className="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
          >
            Close
          </button>

          {isPending && (
            <>
              <button
                onClick={() => setShowRejectModal(true)}
                className="px-8 py-3 rounded-2xl border-2 border-red-100 text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-50 transition-all"
              >
                Reject Request
              </button>

              <button
                disabled={isSubmitting}
                onClick={() => handleCompanyStatus("active")}
                className="px-10 py-3 rounded-2xl bg-[#ECA468] text-white text-xs font-black uppercase tracking-widest hover:bg-[#D0864B] shadow-lg shadow-[#ECA468]/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                {isSubmitting ? "Processing..." : "Verify & Approve"}
              </button>
            </>
          )}
        </div>

        {/* Reject Reason Sub-Modal */}
        {showRejectModal && (
          <div className="absolute inset-0 z-[110] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-8">
            <div className="bg-white rounded-[2rem] w-full max-w-md p-10 shadow-3xl animate-in zoom-in-95 duration-200 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-50 p-2 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-xl font-black text-gray-900 leading-tight tracking-tight">Reject Registration</h3>
              </div>

              <textarea
                rows={4}
                placeholder="Reason for rejection (e.g. invalid documents, missing info...)"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-6 py-4 bg-[#FDFBF7] rounded-[1.5rem] border border-gray-100 outline-none resize-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all font-medium text-gray-700 leading-relaxed placeholder:text-gray-300"
              />

              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Go Back
                </button>

                <button
                  disabled={!rejectReason.trim() || isSubmitting}
                  onClick={() => handleCompanyStatus("reject")}
                  className="px-8 py-3 rounded-2xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-200 transition-all hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {isSubmitting ? "Processing..." : "Confirm Rejection"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetailsModal;
