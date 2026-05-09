import { useState } from "react";
import { passwordValidation, confirmPasswordValidation } from "../../../validations/authValidations";
import { useLocation } from "react-router-dom";
import { companyResetPasswordApi } from "../../../api/auth/authServices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowRight, Building2 } from "lucide-react";

const CompanyNewPasswordForm: React.FC = () => {
  const [values, setValues] = useState({ password: "", confirmPassword: "" });
  const [error, setError] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const passErr = passwordValidation(values.password);
    const confirmErr = confirmPasswordValidation(values.password, values.confirmPassword);
    setError({
      password: passErr,
      confirmPassword: confirmErr,
    });

    if (passErr || confirmErr) return;

    try {
      setLoading(true);
      const res = await companyResetPasswordApi(email, values.password);
      if (res.data.success) {
        toast.success("Password updated successfully");
        localStorage.setItem("otpRequestedTime", Date.now().toString());

        navigate("/company/signin", { replace: true });
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (e: any) => {
    const { name, value } = e.target;
    setValues({ ...values, [e.target.name]: e.target.value });

    if (name === "password") {
      setError({ ...error, password: passwordValidation(value) });
    }

    if (name === "confirmPassword") {
      const err = confirmPasswordValidation(values.password, value);
      setError({ ...error, confirmPassword: err });
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
        {/* Company New Password Box */}
        <div className="w-full max-w-md bg-white/70 backdrop-blur-md p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-[#FDE6C6] shadow-2xl shadow-[#8B7355]/5 transition-all duration-500">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4 text-[#8B7355]">
              <Building2 size={48} strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2 uppercase text-center">New Password</h2>
            <p className="text-gray-500 font-medium px-2 sm:px-4 text-sm sm:text-base text-center">
              Create a strong new password for your company account.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 text-left block">New Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8B7355] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3.5 bg-white border rounded-2xl outline-none focus:border-[#8B7355] focus:ring-4 focus:ring-[#8B7355]/5 transition-all font-semibold text-gray-700 ${
                    error.password ? "border-red-400" : "border-gray-100"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B7355] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {error.password && <p className="flex text-red-500 text-xs mt-1 ml-1 font-medium">{error.password}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1 text-left block">Confirm Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8B7355] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3.5 bg-white border rounded-2xl outline-none focus:border-[#8B7355] focus:ring-4 focus:ring-[#8B7355]/5 transition-all font-semibold text-gray-700 ${
                    error.confirmPassword ? "border-red-400" : "border-gray-100"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B7355] transition-colors"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {error.confirmPassword && <p className="flex text-red-500 text-xs mt-1 ml-1 font-medium">{error.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold text-white bg-[#8B7355] hover:bg-[#725e46] shadow-xl shadow-[#8B7355]/20 hover:shadow-2xl hover:shadow-[#8B7355]/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <span>Reset Password</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default CompanyNewPasswordForm;
