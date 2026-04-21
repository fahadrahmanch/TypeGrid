import { getCompanyStatusApi } from "../../../api/user/userService";
import { createCompanySubscriptionSession } from "../../../api/user/subcription";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader2, CreditCard } from "lucide-react";

const CompanyVerificationStatusDiv1: React.FC = () => {
  const [company, setCompany] = useState<any>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchCompanyDetails() {
      try {
        const response = await getCompanyStatusApi();
        if (!response.data) {
          return navigate("/");
        }
        setCompany(response.data.company);
      } catch (error) {
        console.log(error);
        navigate("/");
      }
    }
    fetchCompanyDetails();
  }, []);

  const handleReApply = () => {
    navigate("/subscription/company/re-verify");
  };

  const handlePayment = async () => {
    try {
      if (!company?.planId) {
        toast.error("No plan associated with this company");
        return;
      }
      setIsSubmitting(true);
      const response = await createCompanySubscriptionSession(company.planId);
      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        toast.error("Failed to create payment session");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong creating payment session");
    } finally {
      setIsSubmitting(false);
    }
  };
if(company?.status=="active"||company?.status=="expired"){
  navigate("/");
  return;
}
  return (
    <>
      <div className="min-h-screen mt-12 flex flex-col items-center pt-10 px-4">
        <div className="w-full max-w-2xl space-y-6">
          {/* 1. Yellow Status Banner */}
          {company?.status === "pending" && (
            <div className="bg-[#FFFBEB] border-2 border-[#FEF3C7] rounded-xl p-6 flex items-start gap-5 shadow-sm">
              <div className="text-4xl text-amber-500 animate-pulse">⏳</div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Verification Pending</h2>
                <p className="text-gray-600 mt-1">
                  Your company verification is in progress. Please wait for approval from the administration.
                </p>
              </div>
            </div>
          )}

          {/* 1.1 Inactive Status Banner (Approved but not paid) */}
          {company?.status === "inactive" && (
            <div className="bg-indigo-50 border-2 border-indigo-100 rounded-xl p-6 flex items-start gap-5 shadow-sm">
              <div className="text-4xl">✅</div>
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Approval Successful!</h2>
                    <p className="text-gray-600 mt-1">
                      Your company details have been verified. Please complete the payment to activate your account.
                    </p>
                  </div>
                  <button
                    disabled={isSubmitting}
                    onClick={handlePayment}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-indigo-200 active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Pay Now to Activate
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
          {company?.status === "active" && (
            <div className="bg-[#ECFDF5] border-2 border-[#A7F3D0] rounded-xl p-6 flex items-start gap-5 shadow-sm">
              <div className="text-4xl">🎉</div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Company Approved!</h2>
                <p className="text-gray-600 mt-1">
                  Your company is now active. You can continue using your dashboard features.
                </p>
              </div>
            </div>
          )}
          {company?.status === "reject" && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex gap-5 shadow-sm">
              {/* <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-2xl">
                ⚠️
              </div> */}

              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">Verification Failed</h2>

                <p className="text-sm text-gray-600 mt-1">
                  Your company verification was rejected. Please review the reason and re-apply after fixing the issues.
                </p>

                {company?.rejectionReason && (
                  <div className="mt-4 bg-white border border-red-100 rounded-xl p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-red-600">Reason for rejection</p>
                    <p className="text-sm text-gray-700 mt-1">{company.rejectionReason}</p>
                  </div>
                )}

                {/* ACTIONS */}
                <div className="mt-5  gap-3 flex justify-center">
                  <button
                    onClick={handleReApply}
                    className="bg-[#B99F8D]  text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition shadow-sm"
                  >
                    Re-Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          {company?.status === "expired" && (
            <div className="bg-orange-50 border-2 border-orange-100 rounded-xl p-6 flex items-start gap-5 shadow-sm">
              <div className="text-4xl text-orange-500">⚠️</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">Subscription Expired</h2>
                <p className="text-gray-600 mt-1">
                  Your company subscription has expired. Please renew your subscription to reactivate your account and
                  access dashboard features.
                </p>
                <div className="mt-4">
                  <button
                    onClick={handlePayment}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-6 rounded-lg transition-all shadow-sm flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    Renew Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. Information Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Submitted Information</h3>

            <div className="flex flex-col">
              {/* Row 1 */}
              <div className="flex justify-between items-start py-4 border-b border-gray-100">
                <span className="text-gray-400 font-medium">Company Name</span>
                <span className="text-gray-900 font-semibold text-right">{company?.companyName}</span>
              </div>

              {/* Row 2 */}
              <div className="flex justify-between items-start py-4 border-b border-gray-100">
                <span className="text-gray-400 font-medium">Address</span>
                <span className="text-gray-900 font-semibold text-right max-w-[60%]">{company?.address}</span>
              </div>

              {/* Row 3 */}
              {/* <div className="flex justify-between items-start py-4 border-b border-gray-100">
                <span className="text-gray-400 font-medium">
                  Contact Person
                </span>
                <span className="text-gray-900 font-semibold text-right">
                  Fahad Rahman
                </span>
              </div> */}

              {/* Row 4 */}
              <div className="flex justify-between items-start py-4 border-b border-gray-100">
                <span className="text-gray-400 font-medium">Email</span>
                <span className="text-gray-900 font-semibold text-right">{company?.email}</span>
              </div>

              {/* Row 5 */}
              <div className="flex justify-between items-start py-4 border-b border-gray-100">
                <span className="text-gray-400 font-medium">Phone</span>
                <span className="text-gray-900 font-semibold text-right">{company?.number}</span>
              </div>

              {/* Row 6 */}
              <div className="flex justify-between items-start py-4">
                <span className="text-gray-400 font-medium">Submitted</span>
                <span className="text-gray-900 font-semibold text-right">
                  {company?.createdAt && new Date(company.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Action Button */}
          <button className="w-full bg-[#B99F8D]  text-white font-semibold py-3.5 rounded-lg transition-colors shadow-sm">
            Back to Home
          </button>
        </div>
      </div>
    </>
  );
};
export default CompanyVerificationStatusDiv1;
