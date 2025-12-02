import { approveCompanyRequest } from "../../../api/admin/company";
import { rejectCompanyRequest } from "../../../api/admin/company";
import { toast } from "react-toastify";

interface CompanyDetailsModalProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  company: any;
  setCompany: any;
}

const CompanyDetailsModal: React.FC<CompanyDetailsModalProps> = ({
  setOpen,
  company,
  setCompany,
}) => {
  async function handleApprove() {
    try {
      const response = await approveCompanyRequest(company?._id);
      if (response?.data?.message) {
        toast.success(response.data.message);
      } else {
        toast.success("Company approved successfully");
      }
      setCompany((prev: any[]) =>
        prev.map((c: any) =>
          c._id === company._id ? { ...c, status: "active" } : c
        )
      );
      setOpen(false);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    }
  }
  async function handleReject() {
    try {
      const response = await rejectCompanyRequest(company?._id);
      if (response?.data?.message) {
        toast.success(response.data.message);
      } else {
        toast.success("Company rejected successfully");
      }
      setCompany((prev: any[]) =>
        prev.map((c: any) =>
          c._id === company._id ? { ...c, status: "reject" } : c
        )
      );

      setOpen(false);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to reject the company";
      toast.error(errorMessage);
      console.error(error);
    }
  }
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        {/* Modal Container */}
        <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header Section */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            {/* <div>
            <h2 className="text-xl font-bold text-gray-900">Review Request</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Request ID: #REQ-2024-001
            </p>
          </div> */}

            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 overflow-y-auto">
            {/* Company Identity & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                {/* Avatar Placeholder */}

                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {company.companyName}
                  </h3>
                  {/* <p className="text-sm text-gray-500">Software & Technology</p> */}
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border
    ${
      company.status === "approved"
        ? "bg-green-50 text-green-700 border-green-200"
        : company.status === "rejected"
        ? "bg-red-50 text-red-700 border-red-200"
        : "bg-amber-50 text-amber-700 border-amber-200"
    }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    company.status === "active"
                      ? "bg-green-600"
                      : company.status === "reject"
                      ? "bg-red-600"
                      : "bg-amber-500 animate-pulse"
                  }`}
                ></span>

                {company.status === "active"
                  ? "active"
                  : company.status === "reject"
                  ? "Rejected"
                  : "Pending"}
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Email Address
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5 break-all">
                    {company.email}
                  </p>
                </div>
              </div>

              {/* Phone */}
              {/* <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div> */}
              {/* <div>
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Phone Number
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">
                    
                  </p>
                </div> */}
              {/* </div> */}

              {/* Date */}
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-gray-500">
                    Registered On
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">
                    Oct 10, 2024
                  </p>
                </div>
              </div>

              {/* ID (Optional filler) */}
              {/* <div className="flex items-start gap-3">
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0c0 .667.333 1 1 1v1m2-2c0 .667-.333 1-1 1v1" /></svg>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-gray-500">Business Type</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">Corporation</p>
              </div>
            </div> */}
            </div>

            {/* Address Section */}
            <div className="mt-8">
              <p className="text-xs font-medium uppercase text-gray-500 mb-3 ml-1">
                Registered Address
              </p>
              <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-700 leading-relaxed">
                <div className="shrink-0 mt-0.5">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Wandoor Main Road</p>
                  <p className="text-gray-500 mt-0.5">
                    Near Central Junction, Malappuram Dist, Kerala, 679328.
                    (Full address details here...)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-4">
            <button
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-gray-500 hover:text-gray-800 transition"
            >
              Cancel
            </button>
            {company && company.status == "pending" && (
              <div className="flex gap-3">
                <button
                  onClick={handleReject}
                  className="rounded-lg border border-red-200 bg-white text-red-600 px-5 py-2.5 text-sm font-medium hover:bg-red-50 hover:border-red-300 focus:ring-4 focus:ring-red-100 transition shadow-sm"
                >
                  Reject Request
                </button>
                <button
                  onClick={handleApprove}
                  className="rounded-lg bg-blue-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition shadow-md flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Approve Company
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default CompanyDetailsModal;
