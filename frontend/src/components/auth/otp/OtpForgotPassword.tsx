import { forgotPasswordOtpVerification, resendOtp } from "../../../api/auth/authServices";
import { useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight, RefreshCw, ArrowLeft } from "lucide-react";

const OtpForgotPassword: React.FC = () => {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [otp, setOtp] = useState<string>("");
  const location = useLocation();
  const name = location.state?.name;
  const email = location.state?.email;
  const OTP_VALID_TIME = 30;
  const navigate = useNavigate();
  const [expire, setExpire] = useState<number>(30);
  useEffect(() => {
    const savedTime = localStorage.getItem("otpRequestedTime");
    if (savedTime) {
      const elapsed = Math.floor((Date.now() - Number(savedTime)) / 1000);
      const remaining = OTP_VALID_TIME - elapsed;
      if (remaining > 0) setExpire(remaining);
      else {
        setExpire(0);
        localStorage.removeItem("otpRequestedTime");
      }
    } else {
      localStorage.setItem("otpRequestedTime", Date.now().toString());
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    if (expire > 0) {
      timerRef.current = setInterval(() => {
        setExpire((prev) => prev - 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      localStorage.removeItem("otpRequestedTime");
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [expire]);
  useEffect(() => {
    if (!email) {
      navigate("/forgot/password", { replace: true });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };
  async function otpResent(e: any) {
    e.preventDefault();
    try {
      const response = await resendOtp(name, email);
      toast.success(response.data.message);
      localStorage.setItem("otpRequestedTime", Date.now().toString());
      setExpire(30);
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(msg);
    }
  }
  async function handleSubmit(e: any) {
    e.preventDefault();
    try {
      const response = await forgotPasswordOtpVerification(otp, email);
      navigate("/create/new/password", {
        state: { email },
        replace: true,
      });
      toast.success(response.data.message);
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(msg);
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF8EA] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#8B7355]/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#8B7355]/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="flex items-center justify-center w-full max-w-6xl relative z-10">
        {/* OTP Box */}
        <div className="w-full max-w-md bg-white/70 backdrop-blur-md p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-[#FDE6C6] shadow-2xl shadow-[#8B7355]/5 transition-all duration-500">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2 uppercase">Verify OTP</h2>
            <p className="text-gray-500 font-medium px-2 sm:px-4 text-sm sm:text-base">
              Enter the 6-digit code sent to your email to reset your password.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2 text-center">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Verification Code</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8B7355] transition-colors">
                  <ShieldCheck size={20} />
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otp}
                  name="otp"
                  placeholder="000000"
                  onInput={(e) => {
                    const input = e.target as HTMLInputElement;
                    input.value = input.value.replace(/[^0-9]/g, "");
                  }}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-[#8B7355] focus:ring-4 focus:ring-[#8B7355]/5 transition-all font-bold text-xl sm:text-2xl text-center tracking-[0.5em] text-gray-700 placeholder:text-gray-200 placeholder:tracking-normal"
                />
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={otp.length !== 6 || expire === 0}
                className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${
                  otp.length !== 6 || expire === 0
                    ? "bg-gray-300 cursor-not-allowed shadow-none"
                    : "bg-[#8B7355] hover:bg-[#725e46] shadow-[#8B7355]/20 hover:shadow-2xl hover:shadow-[#8B7355]/30"
                }`}
              >
                <span>Verify & Continue</span>
                <ArrowRight size={18} />
              </button>

              <div className="flex flex-col items-center gap-4 pt-4 border-t border-gray-100">
                <div className="text-sm font-semibold text-gray-400 text-center">
                  {expire > 0 ? (
                    <span className="flex items-center gap-2">
                      OTP expires in <span className="text-[#8B7355] font-bold tabular-nums w-8 inline-block text-left">{expire}s</span>
                    </span>
                  ) : (
                    <span className="text-red-400">OTP has expired</span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                  <button
                    type="button"
                    disabled={expire > 0}
                    onClick={otpResent}
                    className={`flex-1 flex items-center justify-center gap-2 text-sm font-bold transition-colors w-full ${
                      expire > 0
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-[#8B7355] hover:text-[#725e46]"
                    }`}
                  >
                    <RefreshCw size={16} className={expire === 0 ? "animate-pulse" : ""} />
                    Resend Code
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/forgot/password")}
                    className="flex-1 flex items-center justify-center gap-2 text-sm font-bold text-gray-400 hover:text-[#8B7355] transition-colors w-full"
                  >
                    <ArrowLeft size={16} />
                    Back
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default OtpForgotPassword;
