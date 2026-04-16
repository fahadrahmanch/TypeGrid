import React, { useState, useEffect } from "react";
import { 
  CreditCard, 
  Calendar, 
  ShieldCheck, 
  ChevronRight, 
  AlertCircle, 
  ArrowUpCircle, 
  Trash2, 
  CheckCircle2, 
  Clock,
  Building2,
  User as UserIcon,
  X,
  Info
} from "lucide-react";
import { getSubscriptionDetails } from "../../../api/user/subcription";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/user/Navbar";
import { getUserDataApi } from "../../../api/user/userService";
import { getCompanyStatusApi } from "../../../api/user/userService";

const SubscriptionManagement: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelType, setCancelType] = useState<"personal" | "company">("personal");
  const [userData, setUserData] = useState<any>(null);
  const [companyData, setCompanyData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, companyRes] = await Promise.all([
          getUserDataApi(),
          getCompanyStatusApi().catch(() => ({ data: null }))
        ]);
        
        setUserData(userRes.data.user);
        if (companyRes?.data?.company) {
            setCompanyData(companyRes.data.company);
        }
      } catch (error) {
        console.error("Error fetching subscription data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchSubscriptionData = async () => {
    try{
    const res = await getSubscriptionDetails();
    }
    catch(error){
      console.log(error)
    }
  }
 useEffect(() => {
  fetchSubscriptionData()
 },[])

  const cancelSubscription = async () => {
    try {
    }catch(error:any){
      console.log(error);
    }
  }

  // Mock data for missing fields to fulfill design requirements
  const subscription = {
    planName: userData?.subscriptionPlan?.name || "Premium Pro",
    status: "active", // active, expired, cancelled
    startDate: "Oct 12, 2025",
    expiryDate: "Oct 12, 2026",
    billingCycle: "Yearly",
    price: "₹1,200",
    daysRemaining: 180,
    totalDays: 365,
    features: [
      "Unlimited Typing Practice",
      "Priority Daily Challenges",
      "Exclusive Premium Badges",
      "Ad-free Experience",
      "Advanced Performance Analytics",
      "Custom Keyboard Layouts"
    ]
  };

  const calculateProgress = () => {
    return (subscription.daysRemaining / subscription.totalDays) * 100;
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
      
      <main className="max-w-6xl mx-auto pt-24 px-4 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Subscription</h1>
            <p className="text-gray-500 mt-2 font-medium">Manage your plan, billing details, and company associations.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {subscription.status.toUpperCase()}
            </span>
            <span className="text-sm text-gray-400 font-medium">Next Billing: {subscription.expiryDate}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Plan Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Plan Card */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden group">
              <div className="p-8 sm:p-10">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#FDFBF7] rounded-3xl flex items-center justify-center border border-[#F5EBD8]">
                      <ShieldCheck className="w-8 h-8 text-[#96705B]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900">{subscription.planName}</h3>
                      <p className="text-gray-400 font-medium">{subscription.billingCycle} Billing • {subscription.price}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate("/subscription")}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#FDFBF7] hover:bg-[#F5EBD8] text-[#96705B] font-bold rounded-xl border border-[#F5EBD8] transition-all"
                  >
                    Upgrade Plan
                    <ArrowUpCircle className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-bold text-gray-600 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#96705B]" />
                        Time remaining
                      </span>
                      <span className="text-sm font-black text-gray-900">{subscription.daysRemaining} days left</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#96705B] to-[#B99F8D] rounded-full transition-all duration-1000"
                        style={{ width: `${calculateProgress()}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 bg-[#FDFBF7] rounded-2xl border border-[#F5EBD8]">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] block mb-1">Started On</span>
                      <span className="text-lg font-bold text-gray-900">{subscription.startDate}</span>
                    </div>
                    <div className="p-5 bg-[#FDFBF7] rounded-2xl border border-[#F5EBD8]">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] block mb-1">Expires On</span>
                      <span className="text-lg font-bold text-gray-900">{subscription.expiryDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Card */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 sm:p-10 border-b border-gray-50 flex justify-between items-center">
                <h3 className="text-xl font-black text-gray-900">Plan Features</h3>
                <div className="group relative">
                  <Info className="w-5 h-5 text-gray-300 cursor-help hover:text-gray-400 transition-colors" />
                  <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-gray-900 text-white text-[10px] rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    These features are unlocked for your current tier.
                  </div>
                </div>
              </div>
              <div className="p-8 sm:p-10 bg-[#FDFBF7]/30">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                  {subscription.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Company Subscription Section */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 sm:p-10 pb-4">
                <h3 className="text-xl font-black text-gray-900">Company Access</h3>
              </div>
              
              <div className="p-8 sm:p-10 pt-4">
                {companyData ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <Building2 className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 truncate">{companyData.companyName}</h4>
                        <span className="text-xs font-black text-indigo-600 uppercase tracking-tighter">Member Access</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-400">Status</span>
                        <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">Active</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-400">Role</span>
                        <span className="text-sm font-bold text-gray-800">Admin</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold text-gray-400">
                        <span>Plan</span>
                        <span className="text-gray-800">Enterprise</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 mt-2 border-t border-indigo-100/50">
                      <button 
                        onClick={() => {
                          setCancelType("company");
                          setIsCancelModalOpen(true);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-white hover:bg-rose-50 text-indigo-400 hover:text-rose-600 font-bold rounded-2xl transition-all border border-indigo-50 hover:border-rose-100 shadow-sm hover:shadow-md active:scale-[0.98] group"
                      >
                        <Trash2 className="w-4 h-4 text-indigo-300 group-hover:text-rose-400 transition-colors" />
                        <span className="text-sm tracking-tight">Cancel Company Access</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 px-4 bg-gray-50/30 rounded-2xl border border-dashed border-gray-200">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-sm">
                      <Building2 className="w-6 h-6 text-gray-200" />
                    </div>
                    <h4 className="font-bold text-gray-400 text-sm">No Company Subscription</h4>
                    <p className="text-[10px] text-gray-300 mt-1 uppercase font-black tracking-widest leading-tight">Join a team to get shared benefits</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#FEFAEF] rounded-[2.5rem] shadow-sm border border-[#F5EBD8] p-8 sm:p-10">
              <h3 className="text-lg font-black text-gray-900 mb-6">Security & Settings</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#96705B]/20 hover:shadow-md transition-all group">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-400 group-hover:text-[#96705B] transition-colors" />
                    <span className="text-sm font-bold text-gray-700">Billing History</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 transition-all" />
                </button>
                <div className="pt-4 mt-2 border-t border-gray-100/50">
                  <button 
                    onClick={() => {
                      setCancelType("personal");
                      setIsCancelModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-white hover:bg-rose-50 text-gray-400 hover:text-rose-600 font-bold rounded-2xl transition-all border border-gray-100 hover:border-rose-100 shadow-sm hover:shadow-md active:scale-[0.98] group"
                  >
                    <Trash2 className="w-4 h-4 text-gray-300 group-hover:text-rose-400 transition-colors" />
                    <span className="text-sm tracking-tight">Stop Subscription</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Cancel Confirmation Modal */}
      {isCancelModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-red-100 animate-in zoom-in-95 duration-200">
              <div className="px-10 py-10 text-center">
                <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-100">
                  <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 leading-tight mb-3">
                  {cancelType === "company" ? "Cancel Company Access?" : "Cancel Subscription?"}
                </h2>
                <div className="space-y-4 px-4">
                  <p className="text-gray-500 font-medium leading-relaxed">
                    {cancelType === "company" ? (
                      <>Are you sure you want to cancel the <span className="text-indigo-600 font-bold">Company Subscription</span>? Your entire team will lose premium benefits immediately.</>
                    ) : (
                      <>Are you sure you want to stop your premium access? You'll lose <span className="text-red-600 font-bold">Quick Play</span>, <span className="text-red-600 font-bold">Group Contests</span>, and your pro ranking status.</>
                    )}
                  </p>
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 text-left">
                    <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] font-bold text-amber-700 leading-normal">
                      Note: Your current benefits remain active until the end of the billing cycle on {subscription.expiryDate}.
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-10 py-8 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors order-2 sm:order-1"
                >
                  Keep My Plan
                </button>
                <button
                  onClick={() => {
                    // Actual cancel logic would go here
                    alert(`${cancelType === "company" ? "Company" : "Personal"} subscription cancellation requested.`);
                    setIsCancelModalOpen(false);
                  }}
                  className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-red-500 text-white text-xs font-black uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all hover:shadow-xl hover:-translate-y-0.5 order-1 sm:order-2"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default SubscriptionManagement;
