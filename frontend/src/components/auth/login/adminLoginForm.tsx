// import lines from "../../../assets/images/auth/login/lines.png";
import kid2 from "../../../assets/images/auth/login/Kid2.png";
import {
  emailValidation,
  passwordValidation,
} from "../../../validations/authValidations";
import { adminSigninApi } from "../../../api/auth/authServices";
import { toast } from "react-toastify";
import { useState } from "react";
import { setAdminAccessToken } from "../../../store/slices/auth/adminAuthSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

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
      const admin = response?.data?.adminDeepCopy;
      if (!accessToken || !admin) {
        throw new Error("Something went wrong. Please try again");
      }
      dispatch(setAdminAccessToken({ admin, accessToken }));
      navigate("/admin/users");
      toast.success(response.data.message);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(msg);
    }
  };
  return (
    <>
      {/* Container */}
      <div className="h-screen flex justify-center items-center flex-1 w-full relative sm:w-4/4 md:w-full lg:w-full  ">
        {/* <div className="w-36 mt-[2rem] hidden sm:block">
                        <img
                            src={lines}
                            alt="draw"
                            className="w-24 mb-10  "
                        />
                    </div> */}
        {/* SignIn Box */}
        <div className="bg-[#FFF5E0] p-10 rounded-xl  w-80 z-10 ">
          <h2 className="flex text-2xl font-semibold text-gray-800 mb-5 justify-center">
            Admin Login
          </h2>
          <p className="text-sm pb-8">Sign in to your account to continue</p>

          {/* Divider */}

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
              className="w-full bg-gray-900 text-white rounded-md py-2 mt-2 hover:bg-gray-800 transition"
            >
              Sign In
            </button>
          </form>
        </div>
        {/* Illustration */}
        <div className="w-38 ml-[-17px] mt-[6rem] hidden sm:block ">
          <img src={kid2} alt="kid" className="w-40" />
        </div>
      </div>
    </>
  );
};
export default AdminLoginForm;
