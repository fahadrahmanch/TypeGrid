import {
  emailValidation,
  passwordValidation,
} from "../../../validations/authValidations";
import { useEffect } from "react";
import { useState } from "react";
import lines from "../../../assets/images/auth/login/lines.png";
import kid2 from "../../../assets/images/auth/login/Kid2.png";
import { signIn } from "../../../api/auth/authServices";
import { toast } from "react-toastify";
import { setuserAccessToken } from "../../../store/slices/auth/userAuthSlice";
import { useDispatch } from "react-redux";
import {  useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleAuth } from "../../../hooks/useGoogleAuth";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
export const SignInForm: React.FC = () => {
  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { handleGoogleSuccess, handleGoogleError } = useGoogleAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
  // 1. CLEAR HISTORY STATE (The fix from before)
  // Ensure we don't have messy history state
  if (window.history.state === null) {
     // Do nothing or basic init
  }

  // 2. DISABLE CHROME BFCache FOR THIS PAGE
  // This dummy listener forces Chrome to NOT cache this page in memory
  const handleUnload = () => {};
  window.addEventListener("unload", handleUnload);

  return () => {
    window.removeEventListener("unload", handleUnload);
  };
}, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const emailErr = emailValidation(values.email);
    const passErr = passwordValidation(values.password);

    setError({
      email: emailErr,
      password: passErr,
    });

    if (emailErr || passErr) return;
setLoading(true);
    try {
      const response = await signIn({
        email: values.email,
        password: values.password,
        role: "user",
      });

      const accessToken = response?.data?.accessToken;
      const user = response?.data?.UserDeepCopy;
      
      if (!accessToken || !user) {
        throw new Error("Something went wrong. Please try again");
      }
      dispatch(setuserAccessToken({ user, accessToken }));
      navigate("/",{ replace: true });
      toast.success(response.data.message);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(msg);
    }finally {
    setLoading(false);
  }
  };

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

  return (
    <>
      <>
        {/* Container */}
        <div className="h-screen flex justify-center items-center flex-1 w-full relative  sm:w-4/4 md:w-full lg:w-full  ">
          <div className="w-36 mt-[2rem] hidden sm:block">
            <img src={lines} alt="draw" className="w-64 mb-10  " />
          </div>
          {/* SignIn Box */}
          <div className="bg-[#FFF5E0] p-10 rounded-xl  w-80 z-10 ">
            <h2 className="flex text-2xl font-semibold text-gray-800 mb-5 justify-center">
              Welcome back
            </h2>
            <p className="text-sm pb-8">Sign in to your account to continue</p>
            {/* Google Button */}

            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />

            {/* Divider */}
            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="px-2 text-gray-500 text-sm">Or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {/* Form */}
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleChange}
                className=" rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#FFF8EA]"
              />
              <p className=" text-left text-red-500 text-sm">{error.email}</p>
             <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        name="password"
        onChange={handleChange}
        className="rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#FFF8EA] w-full"
      />

      <span
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
      >
        {showPassword ? (
          <AiOutlineEyeInvisible size={20} />
        ) : (
          <AiOutlineEye size={20} />
        )}
      </span>
    </div>
              <p className="text-left text-red-500 text-sm">{error.password}</p>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full text-white rounded-md py-2 mt-2 transition 
               ${
               loading
                ? "bg-gray-700 cursor-not-allowed"
               : "bg-gray-900 hover:bg-gray-800"
               }`}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-center text-gray-600 text-sm mt-4">
              Don t have an account ?
              <a
                href="/signup"
                className="text-gray-900 font-medium hover:underline"
              >
                Sign Up
              </a>
            </p>

            <a
              href="/forgot/password"
              className="text-gray-900 font-sans  hover:underline"
            >
              forgot password
            </a>
          </div>
          {/* Illustration */}
          <div className="w-48 ml-[-17px] mt-[6rem] hidden sm:block ">
            <img src={kid2} alt="kid" className="w-60" />
          </div>
        </div>
      </>
    </>
  );
};
