// import lines from "../../../assets/images/auth/login/lines.png";
import { emailValidation, passwordValidation } from "../../../validations/authValidations";
import { adminSigninApi } from "../../../api/auth/authServices";
import { toast } from "react-toastify";
import { useState } from "react";
import { setAccessToken } from "../../../store/slices/auth/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, UserCog } from "lucide-react";

const AdminLoginForm: React.FC = () => {
  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = async (e: any) => {
    const { name, value } = e.target;
    setValues({ ...values, [e.target.name]: e.target.value });
    if (name === "email") {
      setError({ ...error, email: emailValidation(value) });
    }
    if (name === "password") {
      setError({ ...error, password: passwordValidation(value) });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const emailErr = emailValidation(values.email);
    const passErr = passwordValidation(values.password);

    setError({
      email: emailErr,
      password: passErr,
    });

    if (emailErr || passErr) return;

    try {
      const response: any = await adminSigninApi({
        email: values.email,
        password: values.password,
        role: "admin",
      });
      const accessToken = response?.data?.accessToken;
      const admin = response?.data?.user;
      if (!accessToken || !admin) {
        throw new Error("Something went wrong. Please try again");
      }
      dispatch(setAccessToken({ accessToken, user: response?.data?.user }));
      navigate("/admin/users");
      toast.success(response.data.message);
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(msg);
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
        {/* Admin Box */}
        <div className="w-full max-w-md bg-white/70 backdrop-blur-md p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-[#FDE6C6] shadow-2xl shadow-[#8B7355]/5 transition-all duration-500">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4 text-[#8B7355]">
              <UserCog size={48} strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2 uppercase">Admin Portal</h2>
            <p className="text-gray-500 font-medium px-2 sm:px-4 text-sm sm:text-base">
              Secure access for platform administration.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Admin Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8B7355] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="admin@typegrid.com"
                  className={`w-full pl-12 pr-4 py-3.5 bg-white border rounded-2xl outline-none focus:border-[#8B7355] focus:ring-4 focus:ring-[#8B7355]/5 transition-all font-semibold text-gray-700 ${
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

            <button
              type="submit"
              className="w-full py-4 rounded-2xl font-bold text-white bg-[#8B7355] hover:bg-[#725e46] shadow-xl shadow-[#8B7355]/20 hover:shadow-2xl hover:shadow-[#8B7355]/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Sign In to Dashboard</span>
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default AdminLoginForm;
