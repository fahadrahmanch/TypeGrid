import React, { useEffect } from "react";
import { CheckCircle, Building2, LayoutDashboard, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/user/Navbar";
import { confirmCompanySubscription } from "../../../api/user/subcription";

const CompanyPaymentSuccess: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const planId = query.get("planId");

        const confirm = async () => {
            try {
                if (planId) {
                    await confirmCompanySubscription(planId);
                }
            } catch (error) {
                console.error("Error confirming company subscription:", error);
            }
        };

        confirm();
    }, []);

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-20 pb-12 px-4 flex flex-col items-center">
            <Navbar />
            
            <div className="max-w-3xl w-full mt-12">
                <div className="bg-white rounded-[32px] p-8 md:p-16 border border-slate-200 shadow-xl text-center relative overflow-hidden">
                    {/* Decorative Gradients */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-60"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full -ml-32 -mb-32 blur-3xl opacity-60"></div>
                    
                    {/* Success Icon Group */}
                    <div className="relative mb-10 flex justify-center">
                        <div className="relative">
                            <div className="w-24 h-24 bg-green-100 rounded-2xl flex items-center justify-center animate-pulse shadow-inner">
                                <CheckCircle className="w-12 h-12 text-green-600" />
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        Company Activated!
                    </h1>
                    
                    <p className="text-xl text-slate-600 mb-12 max-w-xl mx-auto leading-relaxed">
                        Congratulations! Your company subscription is now <span className="text-green-600 font-bold italic">active</span>. 
                        You've unlocked the full suite of collaboration and management tools for your team.
                    </p>
                    
                    <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                        <button 
                            onClick={() => navigate("/company/admin/dashboard")}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-indigo-200 active:scale-95 group"
                        >
                            <LayoutDashboard className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            Admin Dashboard
                        </button>
                        
                        <button 
                            onClick={() => navigate("/")}
                            className="bg-white border-2 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 text-slate-700 px-8 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95"
                        >
                            Back to Home
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                    
                    {/* Feature Highlights */}
                    <div className="mt-16 pt-10 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-left p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                            <div className="text-indigo-600 font-bold mb-1">Team Management</div>
                            <p className="text-sm text-slate-500">Add and manage unlimited team members easily.</p>
                        </div>
                        <div className="text-left p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                            <div className="text-indigo-600 font-bold mb-1">Performance Analytics</div>
                            <p className="text-sm text-slate-500">Track and export detailed typing statistics for everyone.</p>
                        </div>
                        <div className="text-left p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                            <div className="text-indigo-600 font-bold mb-1">Custom Contests</div>
                            <p className="text-sm text-slate-500">Create private typing challenges for your organization.</p>
                        </div>
                    </div>
                </div>
                
                <p className="mt-8 text-center text-slate-400 text-sm">
                    A confirmation email has been sent to your primary company address. 
                    Need help? <span className="text-indigo-600 font-semibold cursor-pointer border-b border-indigo-200">Contact Support</span>
                </p>
            </div>
        </div>
    );
};

export default CompanyPaymentSuccess;
