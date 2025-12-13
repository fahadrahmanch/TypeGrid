import { useState } from "react";
import kidImage from "../../../assets/images/auth/login/kid.png";
import lines from "../../../assets/images/auth/login/lines.png";
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
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

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
    const confirmErr = confirmPasswordValidation(
      values.password,
      values.confirmPassword,
    );

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
      const msg =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
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
    <>
      {/* Container */}
      <div className="h-screen flex justify-center items-center flex-1 w-full relative  sm:w-4/4 md:w-full lg:w-full  ">
        <div className="w-36 mt-[2rem] hidden sm:block">
          <img src={lines} alt="draw" className="w-64 mb-10  " />
        </div>
        {/* Signup Box */}
        <div className="bg-[#FFF5E0] p-10 rounded-xl  w-80 z-10 ">
          <h2 className="flex text-2xl font-semibold text-gray-800 mb-5 text-center">
            Sign up
          </h2>

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
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleChange}
              className="rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#FFF8EA]"
            />
            <p className="text-left text-red-500 text-sm">{error.name}</p>
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
              <div className="relative mt-2">
        <input
          type={showConfirm ? "text" : "password"}
          placeholder="Confirm password"
          name="confirmPassword"
          onChange={handleChange}
          className="rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#FFF8EA] w-full"
        />
        <span
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
        >
          {showConfirm ? (
            <AiOutlineEyeInvisible size={20} />
          ) : (
            <AiOutlineEye size={20} />
          )}
        </span>
      </div>
            <p className="text-left text-red-500 text-sm">
              {error.confirmPassword}
            </p>
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
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-4">
            Already have an account?{" "}
            <a
              href="/Signin"
              className="text-gray-900 font-medium hover:underline"
            >
              Log in
            </a>
          </p>
        </div>
        {/* Illustration */}
        <div className="w-36 mt-[2rem] hidden sm:block">
          <img src={kidImage} alt="kid" className="w-64" />
        </div>
      </div>
    </>
  );
};
export default Register;
