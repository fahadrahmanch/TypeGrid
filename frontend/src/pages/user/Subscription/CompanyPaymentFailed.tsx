import React from "react";
import { XCircle, AlertCircle, LifeBuoy, ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/user/Navbar";

const CompanyPaymentFailed: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#FAFAFA] pt-20 pb-12 px-4 flex flex-col items-center">
            <Navbar />
            
            <div className="max-w-2xl w-full mt-12">
                <div className="bg-white rounded-[32px] p-8 md:p-16 border border-slate-200 shadow-xl text-center relative overflow-hidden">
                    {/* Background Subtle Patterns */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-red-50 rounded-full -ml-32 -mt-32 blur-3xl opacity-40"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mb-32 blur-3xl opacity-60"></div>
                    
                    {/* Failure Icon */}
                    <div className="relative mb-10 flex justify-center">
                        <div className="w-24 h-24 bg-red-50 rounded-2xl flex items-center justify-center shadow-inner">
                            <AlertCircle className="w-12 h-12 text-red-500 animate-pulse" />
                        </div>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        Payment Unsuccessful
                    </h1>
                    
                    <p className="text-xl text-slate-600 mb-12 max-w-md mx-auto leading-relaxed">
                        We were unable to process your company subscription payment. 
                        Don't worry, <span className="font-semibold text-slate-900">no charges were made</span> to your account.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button 
                            onClick={() => navigate("/subscription/company/verify/status")}
                            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg group"
                        >
                            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                            Try Payment Again
                        </button>
                        
                        <button 
                            onClick={() => navigate("/")}
                            className="w-full sm:w-auto bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Home
                        </button>
                    </div>
                    
                    <div className="mt-16 pt-10 border-t border-slate-100">
                        <div className="bg-slate-50 rounded-2xl p-6 flex items-start gap-4 text-left max-w-md mx-auto">
                            <LifeBuoy className="w-6 h-6 text-slate-400 mt-1 flex-shrink-0" />
                            <div>
                                <h4 className="font-bold text-slate-900 mb-1 text-sm">Need assistance?</h4>
                                <p className="text-sm text-slate-500">
                                    Common issues include card restrictions or insufficient funds. 
                                    If you keep having trouble, our support team is ready to help.
                                </p>
                                <button className="mt-3 text-indigo-600 font-bold text-sm hover:underline">
                                    Talk to Support
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <p className="mt-8 text-center text-slate-400 text-sm">
                    Reference ID: <span className="font-mono">{Math.random().toString(36).substring(7).toUpperCase()}</span>
                </p>
            </div>
        </div>
    );
};

export default CompanyPaymentFailed;
