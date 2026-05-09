import { useState } from "react";
import { signup } from "../../../api/auth/authServices";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  nameValidation,
  emailValidation,
  passwordValidation,
  confirmPasswordValidation,
} from "../../../validations/authValidations";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleAuth } from "../../../hooks/useGoogleAuth";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const { handleGoogleSuccess, handleGoogleError } = useGoogleAuth();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const nameErr = nameValidation(values.name);
    const emailErr = emailValidation(values.email);
    const passErr = passwordValidation(values.password);
    const confirmErr = confirmPasswordValidation(values.password, values.confirmPassword);

    setError({
      name: nameErr,
      email: emailErr,
      password: passErr,
      confirmPassword: confirmErr,
    });

    if (nameErr || emailErr || passErr || confirmErr) return;
    if (loading) return;
    setLoading(true);
    try {
      const response = await signup(values);
      navigate("/otp", {
        state: {
          name: values.name,
          email: values.email,
          password: values.password,
        },
      });
      toast.success(response.data.message);
      localStorage.setItem("otpRequestedTime", Date.now().toString());
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(msg);
      setLoading(false);
    }
  };
  const handleChange = async (e: any) => {
    const { name, value } = e.target;
    setValues({ ...values, [e.target.name]: e.target.value });
    if (name === "name") {
      setError({ ...error, name: nameValidation(value) });
    }

    if (name === "email") {
      setError({ ...error, email: emailValidation(value) });
    }

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
        {/* SignUp Box */}
        <div className="w-full max-w-md bg-white/70 backdrop-blur-md p-10 rounded-[2.5rem] border border-[#FDE6C6] shadow-2xl shadow-[#8B7355]/5 transition-all duration-500">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">Create Account</h2>
            <p className="text-gray-500 font-medium">Join us and start your journey today</p>
          </div>

          {/* Google Button Container */}
          <div className="mb-8 flex justify-center">
            <div className="w-full transform hover:scale-[1.02] transition-transform duration-200">
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] flex-grow bg-gray-200"></div>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Or</span>
            <div className="h-[1px] flex-grow bg-gray-200"></div>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Full Name</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8B7355] transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 bg-white border rounded-2xl outline-none focus:border-[#8B7355] focus:ring-4 focus:ring-[#8B7355]/5 transition-all font-semibold text-gray-700 ${
                    error.name ? "border-red-400" : "border-gray-100"
                  }`}
                />
              </div>
              {error.name && <p className="flex text-red-500 text-xs mt-1 ml-1 font-medium">{error.name}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8B7355] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 bg-white border rounded-2xl outline-none focus:border-[#8B7355] focus:ring-4 focus:ring-[#8B7355]/5 transition-all font-semibold text-gray-700 ${
                    error.email ? "border-red-400" : "border-gray-100"
                  }`}
                />
              </div>
              {error.email && <p className="flex text-red-500 text-xs mt-1 ml-1 font-medium">{error.email}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8B7355] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3 bg-white border rounded-2xl outline-none focus:border-[#8B7355] focus:ring-4 focus:ring-[#8B7355]/5 transition-all font-semibold text-gray-700 ${
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
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Confirm Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8B7355] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3 bg-white border rounded-2xl outline-none focus:border-[#8B7355] focus:ring-4 focus:ring-[#8B7355]/5 transition-all font-semibold text-gray-700 ${
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
              className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl shadow-[#8B7355]/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#8B7355] hover:bg-[#725e46] hover:shadow-2xl hover:shadow-[#8B7355]/30"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm font-medium">
              Already have an account?{" "}
              <a href="/signin" className="text-[#8B7355] font-bold hover:underline">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
