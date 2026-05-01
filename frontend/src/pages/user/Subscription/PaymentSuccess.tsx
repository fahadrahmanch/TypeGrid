import React, { useEffect, useRef, useState } from "react";
import { CheckCircle, Home, User, Loader2, AlertCircle, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/user/Navbar";
import { confirmSubscription } from "../../../api/user/subcription";
import { confirmCompanySubscription } from "../../../api/user/subcription";
const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const confirmed = useRef(false);

  useEffect(() => {
    if (confirmed.current) return;
    const query = new URLSearchParams(window.location.search);
    const planId = query.get("planId");
    const type = query.get("type");
    const sessionId = query.get("session_id");

    const confirm = async () => {
      try {
        setStatus("loading");
        if (type == "company") {
          await confirmCompanySubscription(planId!, sessionId!);
        } else {
          await confirmSubscription(planId!, sessionId!);
        }
        setStatus("success");
      } catch (error: any) {
        console.error("Error confirming subscription:", error);
        setStatus("error");
        setErrorMessage(
          error?.response?.data?.message || "There was an error activating your subscription. Please contact support."
        );
      }
    };

    if (planId && sessionId) {
      confirmed.current = true;
      confirm();
    } else {
      setStatus("error");
      setErrorMessage("Missing required payment information. Please check your email or contact support.");
    }
  }, []);
  return (
    <div className="min-h-screen bg-[#FFF8EA] pt-20 pb-12 px-4 flex flex-col items-center">
      <Navbar />

      <div className="max-w-2xl w-full mt-12">
        <div className="bg-white/60 backdrop-blur-md rounded-[40px] p-12 border border-white/80 shadow-2xl text-center relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#8B7355]/10 rounded-full -ml-16 -mt-16 blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-yellow-100/50 rounded-full -mr-16 -mb-16 blur-3xl opacity-50"></div>

          {status === "loading" && (
            <div className="py-12 flex flex-col items-center">
              <Loader2 className="w-16 h-16 text-[#8B7355] animate-spin mb-6" />
              <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Confirming Payment...</h1>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                Please wait while we activate your premium features. This will only take a moment.
              </p>
            </div>
          )}

          {status === "success" && (
            <>
              {/* Success Icon */}
              <div className="relative mb-8 flex justify-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>

              <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Payment Successful!</h1>

              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                Congratulations! Your premium subscription is now active. You've unlocked all the tools to become a
                typing master.
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
                  A receipt has been sent to your email. If you have any questions, please contact our support team.
                </p>
              </div>
            </>
          )}

          {status === "error" && (
            <div className="py-8 flex flex-col items-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>

              <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Activation Failed</h1>

              <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-md mx-auto">{errorMessage}</p>

              <div className="grid sm:grid-cols-2 gap-4 w-full">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-[#8B7355] hover:bg-[#766248] text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                  <RefreshCcw className="w-5 h-5" />
                  Retry Activation
                </button>

                <button
                  onClick={() => navigate("/")}
                  className="bg-white border-2 border-gray-100 hover:border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  <Home className="w-5 h-5" />
                  Back to Home
                </button>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-100 w-full">
                <p className="text-sm text-gray-400">
                  If you have already been charged, don't worry. Our support team can manually activate your plan.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
