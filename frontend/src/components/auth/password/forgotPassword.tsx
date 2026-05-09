
import { emailValidation } from "../../../validations/authValidations";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { forgotPasswordApi } from "../../../api/auth/authServices";
import { toast } from "react-toastify";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";

const ForgotPassWordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState({ email: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const emailErr = emailValidation(email);
    setError({
      email: emailErr,
    });
    if (loading) return;
    setLoading(true);
    try {
      const res = await forgotPasswordApi(email);
      if (res?.data?.success) {
        toast.success(res.data.message || "OTP sent successfully");
        localStorage.setItem("otpRequestedTime", Date.now().toString());

        navigate("/forgot/password/otp", {
          state: { email: email, name: res.data.name },
        });
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };
  const handleChange = async (e: any) => {
    const { name, value } = e.target;
    setEmail(e.target.value);
    if (name === "email") {
      setError({ ...error, email: emailValidation(value) });
    }
  };
  return (
    <div className="min-h-screen bg-[#FFF8EA] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#8B7355]/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#8B7355]/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="flex items-center justify-center w-full max-w-6xl relative z-10">
        {/* Forgot Password Box */}
        <div className="w-full max-w-md bg-white/70 backdrop-blur-md p-10 rounded-[2.5rem] border border-[#FDE6C6] shadow-2xl shadow-[#8B7355]/5 transition-all duration-500">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2 uppercase">Forgot Password</h2>
            <p className="text-gray-500 font-medium px-4">
              Enter your email address and we'll send you an OTP to reset your password.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8B7355] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className={`w-full pl-12 pr-4 py-3.5 bg-white border rounded-2xl outline-none focus:border-[#8B7355] focus:ring-4 focus:ring-[#8B7355]/5 transition-all font-semibold text-gray-700 ${
                    error.email ? "border-red-400" : "border-gray-100"
                  }`}
                />
              </div>
              {error.email && <p className="flex text-red-500 text-xs mt-1 ml-1 font-medium">{error.email}</p>}
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl shadow-[#8B7355]/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#8B7355] hover:bg-[#725e46] hover:shadow-2xl hover:shadow-[#8B7355]/30"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/signin")}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold text-gray-400 hover:text-[#8B7355] transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassWordForm;
