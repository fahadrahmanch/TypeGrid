import React from "react";
import { XCircle, ArrowLeft, LifeBuoy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/user/Navbar";

const PaymentCancel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFF8EA] pt-20 pb-12 px-4 flex flex-col items-center">
      <Navbar />

      <div className="max-w-2xl w-full mt-12">
        <div className="bg-white/60 backdrop-blur-md rounded-[40px] p-12 border border-white/80 shadow-2xl text-center relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gray-100 rounded-full -ml-16 -mb-16 blur-3xl opacity-50"></div>

          {/* Cancel Icon */}
          <div className="relative mb-8 flex justify-center">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
          </div>

          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Payment Cancelled</h1>

          <p className="text-lg text-gray-600 mb-10 leading-relaxed">
            The checkout process was cancelled and no charges were made. If you're having trouble with the payment,
            we're here to help!
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/subscription")}
              className="bg-[#8B7355] hover:bg-[#766248] text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-95 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Return to Plans
            </button>

            <button className="bg-white border-2 border-gray-100 hover:border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95">
              <LifeBuoy className="w-5 h-5" />
              Get Support
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-400">Try again whenever you're ready. We'd love to have you on board!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
