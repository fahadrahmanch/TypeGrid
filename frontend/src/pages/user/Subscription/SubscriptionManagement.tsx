import React, { useState, useEffect } from "react";
import {
  Calendar,
  ShieldCheck,
  ArrowUpCircle,
  Clock,
  Building2,
  User as UserIcon,
  AlertCircle,
} from "lucide-react";
import { getSubscriptionDetails } from "../../../api/user/subcription";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/user/Navbar";

interface SubscriptionInfo {
  planId: string;
  planName: string;
  status: string;
  startDate: string;
  endDate: string;
  type: string;
}

interface CompanySubscriptionInfo {
  companyId: string;
  companyName: string;
  subscription: SubscriptionInfo;
}

interface SubscriptionData {
  personalSubscription: SubscriptionInfo | null;
  companySubscription: CompanySubscriptionInfo | null;
}

const SubscriptionManagement: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    personalSubscription: null,
    companySubscription: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getSubscriptionDetails();
        if (res.data) {
          setSubscriptionData(res.data.subscriptionDetails);
        }
      } catch (error) {
        console.error("Error fetching subscription data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateProgress = (start: string, end: string) => {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    const today = new Date().getTime();

    if (isNaN(startDate) || isNaN(endDate)) return 0;

    const total = endDate - startDate;
    const elapsed = today - startDate;

    const progress = (elapsed / total) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getDaysRemaining = (end: string) => {
    const endDate = new Date(end).getTime();
    const today = new Date().getTime();
    const remaining = endDate - today;
    return Math.max(Math.ceil(remaining / (1000 * 60 * 60 * 24)), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8EA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#96705B]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8EA] pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto pt-20 md:pt-24 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 md:mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">Subscription Management</h1>
          <p className="text-sm md:text-base text-gray-500 mt-2 font-medium">
            Manage your personal and company-provided premium benefits.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {/* Personal Subscription Column */}
          <div className="space-y-6">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <UserIcon className="w-6 h-6 text-[#96705B]" />
              <h2 className="text-xl md:text-2xl font-black text-gray-900">Personal Subscription</h2>
            </div>
            
            {subscriptionData.personalSubscription ? (
              <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="p-6 md:p-10">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-8 gap-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                      <div className="w-16 h-16 bg-[#FDFBF7] rounded-3xl flex items-center justify-center border border-[#F5EBD8] shrink-0">
                        <ShieldCheck className="w-8 h-8 text-[#96705B]" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 leading-tight">
                          {subscriptionData.personalSubscription.planName}
                        </h3>
                        <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider ${
                            subscriptionData.personalSubscription.status === "active" 
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                              : "bg-rose-50 text-rose-600 border border-rose-100"
                          }`}>
                            {subscriptionData.personalSubscription.status}
                          </span>
                          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                            {subscriptionData.personalSubscription.type === "company" ? "normal" : subscriptionData.personalSubscription.type} Plan
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate("/subscription")}
                      className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-[#FDFBF7] hover:bg-[#F5EBD8] text-[#96705B] text-xs font-black uppercase tracking-widest rounded-xl border border-[#F5EBD8] transition-all"
                    >
                      Change
                      <ArrowUpCircle className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#96705B]" />
                          Time remaining
                        </span>
                        <span className="text-xs md:text-sm font-black text-gray-900">
                          {getDaysRemaining(subscriptionData.personalSubscription.endDate)} days left
                        </span>
                      </div>
                      <div className="w-full h-2 md:h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#96705B] to-[#B99F8D] rounded-full transition-all duration-1000"
                          style={{ width: `${calculateProgress(
                            subscriptionData.personalSubscription.startDate,
                            subscriptionData.personalSubscription.endDate
                          )}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-5 bg-[#FDFBF7] rounded-2xl border border-[#F5EBD8]">
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#D0864B] block mb-1 opacity-70">
                          Started On
                        </span>
                        <span className="text-base md:text-lg font-black text-gray-800">
                          {formatDate(subscriptionData.personalSubscription.startDate)}
                        </span>
                      </div>
                      <div className="p-5 bg-[#FDFBF7] rounded-2xl border border-[#F5EBD8]">
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#D0864B] block mb-1 opacity-70">
                          Expires On
                        </span>
                        <span className="text-base md:text-lg font-black text-gray-800">
                          {formatDate(subscriptionData.personalSubscription.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border-2 border-dashed border-gray-100 p-8 md:p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="w-8 h-8 text-gray-200" />
                </div>
                <h3 className="text-xl font-black text-gray-400">No Personal Plan</h3>
                <p className="text-xs md:text-sm text-gray-300 mt-2 max-w-xs mx-auto font-medium">
                  Upgrade your account to unlock premium typing features and analytics.
                </p>
                <button
                  onClick={() => navigate("/subscription")}
                  className="mt-8 px-8 py-3.5 bg-[#96705B] text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-[#96705B]/20 hover:shadow-xl transition-all active:scale-95"
                >
                  View Plans
                </button>
              </div>
            )}
          </div>

          {/* Company Subscription Column */}
          <div className="space-y-6">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <Building2 className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl md:text-2xl font-black text-gray-900">Company Subscription</h2>
            </div>

            {subscriptionData.companySubscription ? (
              <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-indigo-50 overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="p-6 md:p-10">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-8 gap-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                      <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center border border-indigo-100 shrink-0">
                        <Building2 className="w-8 h-8 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 leading-tight">
                          {subscriptionData.companySubscription.companyName}
                        </h3>
                        <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider ${
                            subscriptionData.companySubscription.subscription.status === "active" 
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                              : "bg-rose-50 text-rose-600 border border-rose-100"
                          }`}>
                            {subscriptionData.companySubscription.subscription.status}
                          </span>
                          <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">
                            {subscriptionData.companySubscription.subscription.planName}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-indigo-600" />
                          Subscription Period
                        </span>
                        <span className="text-xs md:text-sm font-black text-gray-900">
                          {getDaysRemaining(subscriptionData.companySubscription.subscription.endDate)} days left
                        </span>
                      </div>
                      <div className="w-full h-2 md:h-3 bg-gray-50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 rounded-full transition-all duration-1000"
                          style={{ width: `${calculateProgress(
                            subscriptionData.companySubscription.subscription.startDate,
                            subscriptionData.companySubscription.subscription.endDate
                          )}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-5 bg-indigo-50/30 rounded-2xl border border-indigo-100/50">
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-indigo-400 block mb-1 opacity-70">
                          Valid From
                        </span>
                        <span className="text-base md:text-lg font-black text-gray-800">
                          {formatDate(subscriptionData.companySubscription.subscription.startDate)}
                        </span>
                      </div>
                      <div className="p-5 bg-indigo-50/30 rounded-2xl border border-indigo-100/50">
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-indigo-400 block mb-1 opacity-70">
                          Valid Until
                        </span>
                        <span className="text-base md:text-lg font-black text-gray-800">
                          {formatDate(subscriptionData.companySubscription.subscription.endDate)}
                        </span>
                      </div>
                    </div>

                    {subscriptionData.companySubscription.subscription.status === "active" ? (
                      <div className="p-6 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[1.5rem] md:rounded-[2rem] text-white shadow-lg shadow-indigo-200/50">
                        <div className="flex items-center gap-3 mb-2">
                          <ShieldCheck className="w-5 h-5 text-indigo-200" />
                          <h4 className="font-black text-sm uppercase tracking-wider">Enterprise Active</h4>
                        </div>
                        <p className="text-indigo-100 text-[11px] md:text-xs font-medium leading-relaxed">
                          Your account is linked to {subscriptionData.companySubscription.companyName}. 
                          All enterprise features are currently unlocked.
                        </p>
                      </div>
                    ) : (
                      <div className={`p-6 rounded-[1.5rem] md:rounded-[2rem] border transition-all duration-300 ${
                        subscriptionData.companySubscription.subscription.status === "pending"
                          ? "bg-amber-50/50 border-amber-100"
                          : "bg-rose-50/50 border-rose-100"
                      }`}>
                        <div className="flex items-center gap-3 mb-3">
                          {subscriptionData.companySubscription.subscription.status === "pending" ? (
                            <div className="p-2 bg-amber-100 rounded-lg shrink-0">
                              <Clock className="w-4 h-4 text-amber-600" />
                            </div>
                          ) : (
                            <div className="p-2 bg-rose-100 rounded-lg shrink-0">
                              <AlertCircle className="w-4 h-4 text-rose-600" />
                            </div>
                          )}
                          <h4 className={`font-black text-xs md:text-sm uppercase tracking-widest ${
                            subscriptionData.companySubscription.subscription.status === "pending" ? "text-amber-900" : "text-rose-900"
                          }`}>
                            {subscriptionData.companySubscription.subscription.status === "pending" 
                              ? "Verification Pending" 
                              : "Activation Required"}
                          </h4>
                        </div>
                        <p className={`text-[10px] md:text-[11px] font-medium leading-relaxed mb-5 ${
                          subscriptionData.companySubscription.subscription.status === "pending" ? "text-amber-700/80" : "text-rose-700/80"
                        }`}>
                          {subscriptionData.companySubscription.subscription.status === "pending"
                            ? "Our administration team is currently reviewing your company credentials. This typically takes 24-48 hours."
                            : "Your company subscription is currently inactive. You need to complete the payment to activate enterprise features."}
                        </p>
                        <button
                          onClick={() => navigate("/subscription/company/verify/status")}
                          className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                            subscriptionData.companySubscription.subscription.status === "pending"
                              ? "bg-white border-amber-200 text-amber-700 hover:bg-amber-50 shadow-sm"
                              : "bg-white border-rose-200 text-rose-700 hover:bg-rose-50 shadow-sm"
                          } active:scale-[0.98]`}
                        >
                          Check Status
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border-2 border-dashed border-indigo-50 p-8 md:p-12 text-center h-full flex flex-col justify-center min-h-[300px]">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Building2 className="w-8 h-8 text-indigo-100" />
                </div>
                <h3 className="text-xl font-black text-gray-300">No Enterprise Plan</h3>
                <p className="text-xs md:text-sm text-gray-300 mt-2 max-w-xs mx-auto font-medium">
                  Contact your organization administrator to get added to a company plan.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionManagement;
