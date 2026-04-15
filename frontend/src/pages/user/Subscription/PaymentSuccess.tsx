import React,{useEffect} from "react";
import { CheckCircle, ArrowRight, Home, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/user/Navbar";
import { confirmSubscription } from "../../../api/user/subcription";

const PaymentSuccess: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
  const query = new URLSearchParams(window.location.search);
  const planId = query.get("planId");

  const confirm = async () => {
    try {
      await confirmSubscription(planId!);
    } catch (error) {
      console.error("Error confirming subscription:", error);
    }
  };

  if (planId) {
    confirm();
  }
}, []);
    return (
        <div className="min-h-screen bg-[#FFF8EA] pt-20 pb-12 px-4 flex flex-col items-center">
            <Navbar />
            
            <div className="max-w-2xl w-full mt-12">
                <div className="bg-white/60 backdrop-blur-md rounded-[40px] p-12 border border-white/80 shadow-2xl text-center relative overflow-hidden">
                    {/* Background Decorative Elements */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-green-100 rounded-full -ml-16 -mt-16 blur-3xl opacity-50"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-yellow-100 rounded-full -mr-16 -mb-16 blur-3xl opacity-50"></div>
                    
                    {/* Success Icon */}
                    <div className="relative mb-8 flex justify-center">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        {/* Little sparkle effects could be added here with absolute divs */}
                    </div>
                    
                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
                        Payment Successful!
                    </h1>
                    
                    <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                        Congratulations! Your premium subscription is now active. 
                        You've unlocked all the tools to become a typing master.
                    </p>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                        <button 
                            onClick={() => navigate("/")}
                            className="bg-[#8B7355] hover:bg-[#766248] text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-95 group"
                        >
                            <Home className="w-5 h-5" />
                            Go to Home
                        </button>
                        
                        <button 
                            onClick={() => navigate("/profile")}
                            className="bg-white border-2 border-gray-100 hover:border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95"
                        >
                            <User className="w-5 h-5" />
                            View Profile
                        </button>
                    </div>
                    
                    <div className="mt-12 pt-8 border-t border-gray-100">
                        <p className="text-sm text-gray-400">
                            A receipt has been sent to your email. If you have any questions, 
                            please contact our support team.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
