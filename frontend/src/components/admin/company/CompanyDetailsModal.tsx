import { updateCompanyStatus } from "../../../api/admin/company";
import { toast } from "react-toastify";
import { useState } from "react";
import { X, Building2, Mail, CheckCircle2, AlertCircle, Calendar, FileUp } from "lucide-react";

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 p-4">
      {/* Main Modal Container */}
      <div className="relative w-full max-w-lg md:max-w-2xl bg-[#FFF8EA] rounded-2xl md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] md:max-h-[90vh] border border-[#ECA468]/10 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-5 md:px-10 py-4 md:py-8 border-b border-[#ECA468]/10 bg-white/40 flex justify-between items-center">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="bg-[#ECA468]/10 p-2 md:p-3 rounded-xl md:rounded-2xl">
              <Building2 className="w-4 h-4 md:w-6 md:h-6 text-[#ECA468]" />
            </div>
            <div>
              <h2 className="text-lg md:text-2xl font-black text-gray-900 leading-tight">Company Details</h2>
              <p className="text-[8px] md:text-xs text-[#D0864B] font-bold uppercase tracking-widest mt-0.5">Verification & Review</p>
            </div>
          </div>
          <button 
            onClick={() => setOpen(false)} 
            className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-white rounded-lg transition-all"
          >
            <X className="w-4 h-4 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 md:px-10 py-5 md:py-8 custom-scrollbar bg-white/20">
          <div className="mb-6 md:mb-10 flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">{company.companyName}</h3>

            <span
              className={`px-3 md:px-4 py-1 md:py-1.5 text-[8px] md:text-xs font-black uppercase tracking-widest rounded-lg md:rounded-xl border
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
                {isActive ? "Active" : isRejected ? "Rejected" : isInactive ? "Inactive" : isExpired ? "Expired" : "Pending"}
              </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div className="space-y-4 md:space-y-6">
              <div>
                <label className="text-[8px] md:text-xs font-black uppercase tracking-widest text-[#D0864B] mb-1 md:mb-2 block ml-1">
                  Registration Email
                </label>
                <div className="flex items-center gap-2 md:gap-3 text-gray-800 font-bold bg-white p-3 md:p-4 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm text-xs md:text-base overflow-hidden">
                  <Mail className="w-3 h-3 md:w-4 md:h-4 text-[#ECA468] shrink-0" />
                  <span className="truncate">{company.email}</span>
                </div>
              </div>

              <div>
                <label className="text-[8px] md:text-xs font-black uppercase tracking-widest text-[#D0864B] mb-1 md:mb-2 block ml-1">
                  Registration Date
                </label>
                <div className="flex items-center gap-2 md:gap-3 text-gray-800 font-bold bg-white p-3 md:p-4 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm text-xs md:text-base">
                  <Calendar className="w-3 h-3 md:w-4 md:h-4 text-[#ECA468] shrink-0" />
                  {new Date(company.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div>
                <label className="text-[8px] md:text-xs font-black uppercase tracking-widest text-[#D0864B] mb-1 md:mb-2 block ml-1">
                  Company ID
                </label>
                <div className="flex items-center gap-3 text-gray-400 font-mono text-[8px] md:text-xs bg-white p-3 md:p-4 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm">
                  {company._id}
                </div>
              </div>

              <div>
                <label className="text-[8px] md:text-xs font-black uppercase tracking-widest text-[#D0864B] mb-1 md:mb-2 block ml-1">
                  Admin Status
                </label>
                <div className="flex items-center gap-2 md:gap-3 text-gray-800 font-bold bg-white p-3 md:p-4 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm capitalize text-xs md:text-base">
                  {isActive ? (
                    <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-emerald-500 shrink-0" />
                  ) : isRejected ? (
                    <AlertCircle className="w-3 h-3 md:w-4 md:h-4 text-red-500 shrink-0" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                  )}
                  {company.status || "Unknown"}
                </div>
              </div>

              {company.document && (
                <div className="pt-2 md:pt-4">
                  <label className="text-[8px] md:text-xs font-black uppercase tracking-widest text-[#D0864B] mb-1 md:mb-2 block ml-1">
                    Verification Document
                  </label>
                  <a 
                    href={company.document} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full p-3 md:p-4 bg-[#ECA468]/5 hover:bg-[#ECA468]/10 text-[#D0864B] border border-dashed border-[#ECA468]/30 rounded-xl md:rounded-2xl font-black text-[8px] md:text-[10px] uppercase tracking-widest transition-all group shadow-sm"
                  >
                    <FileUp className="w-3 h-3 md:w-4 md:h-4 group-hover:scale-110 transition-transform" />
                    View Business License
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 md:px-10 py-4 md:py-8 bg-white/40 border-t border-[#ECA468]/10 flex flex-row justify-end gap-2 md:gap-4">
          <button
            onClick={() => setOpen(false)}
            className="px-4 md:px-8 py-2 md:py-4 rounded-xl md:rounded-2xl bg-white text-gray-500 font-black text-[8px] md:text-xs uppercase tracking-widest border border-gray-100 hover:bg-gray-50 transition-all shadow-sm"
          >
            Close
          </button>

          {isPending && (
            <div className="flex gap-2 md:gap-4">
              <button
                onClick={() => setShowRejectModal(true)}
                className="px-4 md:px-8 py-2 md:py-4 rounded-xl md:rounded-2xl border border-red-200 text-red-500 text-[8px] md:text-xs font-black uppercase tracking-widest hover:bg-red-50 transition-all shadow-sm"
              >
                Reject
              </button>

              <button
                disabled={isSubmitting}
                onClick={() => handleCompanyStatus("active")}
                className="px-5 md:px-10 py-2 md:py-4 rounded-xl md:rounded-2xl bg-[#ECA468] text-white text-[8px] md:text-xs font-black uppercase tracking-widest hover:bg-[#D0864B] shadow-lg shadow-[#ECA468]/20 active:scale-95 hover:-translate-y-0.5"
              >
                {isSubmitting ? "Wait..." : "Approve"}
              </button>
            </div>
          )}
        </div>

        {/* Reject Reason Sub-Modal */}
        {showRejectModal && (
          <div className="absolute inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 md:p-8">
            <div className="bg-[#FFF8EA] rounded-2xl md:rounded-[2.5rem] w-full max-w-md p-6 md:p-10 shadow-3xl animate-in zoom-in-95 duration-200 border border-[#ECA468]/10">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="bg-red-50 p-2 rounded-xl">
                  <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
                </div>
                <h3 className="text-lg md:text-xl font-black text-gray-900 leading-tight tracking-tight">Reject Registration</h3>
              </div>

              <textarea
                rows={4}
                placeholder="Specify reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-white rounded-xl md:rounded-[1.5rem] border border-gray-100 outline-none resize-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all font-bold text-xs md:text-base text-gray-700 leading-relaxed placeholder:text-gray-300 shadow-sm"
              />

              <div className="flex justify-end gap-2 md:gap-4 mt-6 md:mt-8">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 md:px-6 py-2 rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Go Back
                </button>

                <button
                  disabled={!rejectReason.trim() || isSubmitting}
                  onClick={() => handleCompanyStatus("reject")}
                  className="px-5 md:px-8 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl bg-red-500 text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-200 transition-all active:scale-95 hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {isSubmitting ? "Wait..." : "Confirm Reject"}
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
