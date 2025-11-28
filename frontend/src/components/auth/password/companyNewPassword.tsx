import { useState } from "react";
import passwordKid from "../../../assets/images/auth/password/newPasswordKid.png";
import lines from "../../../assets/images/auth/login/lines.png";
import LinesRight from "../../../assets/images/auth/otp/linesRightOtp.png";
import {
  passwordValidation,
  confirmPasswordValidation,
} from "../../../validations/authValidations";
import { useLocation } from "react-router-dom";
import { companyCreateNewpasswordApi } from "../../../api/auth/authServices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CompanyNewPasswordForm: React.FC = () => {
  const [values, setValues] = useState({ password: "", confirmPassword: "" });
  const [error, setError] = useState({ password: "", confirmPassword: "" });
  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const passErr = passwordValidation(values.password);
    const confirmErr = confirmPasswordValidation(
      values.password,
      values.confirmPassword,
    );
    setError({
      password: passErr,
      confirmPassword: confirmErr,
    });

    if (passErr || confirmErr) return;

    try {
      const res = await companyCreateNewpasswordApi(email, values.password);
      if (res.data.success) {
        toast.success("Password updated successfully");
        navigate("/company/signin");
      } else {
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
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
    <>
      {/* Container */}
      <div className="h-screen  flex justify-center items-center flex-1 relative  sm:w-4/4 md:w-full   ">
        <div className="w-20 mb-10 hidden sm:block">
          <img src={lines} alt="draw" className="w-28" />
        </div>

        <div className="bg-[#FFF5E0] p-10 rounded-xl  w-[30rem] shadow-lg z-20 ">
          <h2 className="flex text-2xl font-semibold text-gray-800 mb-5 text-center justify-center">
            Create new password
          </h2>

          {/* Form */}
          <form className="flex flex-col gap-3  ">
            <input
              type="password"
              onChange={handleChange}
              name="password"
              placeholder="Enter new password"
              className="text-center appearance-none rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#FFF8EA]"
            />
            <p className="text-left text-red-500 text-sm">{error.password}</p>
            <input
              type="password"
              onChange={handleChange}
              name="confirmPassword"
              placeholder="Re-Enter new password"
              className="text-center appearance-none rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#FFF8EA]"
            />
            <p className="text-left text-red-500 text-sm">
              {error.confirmPassword}
            </p>
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full  bg-gray-900 text-white rounded-md py-2 mt-2"
            >
              SUBMIT
            </button>
          </form>
        </div>

        {/* Illustration */}

        <img
          src={LinesRight}
          alt="draw"
          className="w-24 h-60 mb-10 relative"
        ></img>
        <img
          src={passwordKid}
          alt="kid"
          className="w-[30rem] absolute mt-28 ml-[650px]"
        />
      </div>
    </>
  );
};
export default CompanyNewPasswordForm;
