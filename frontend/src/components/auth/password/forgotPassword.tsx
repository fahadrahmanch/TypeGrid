import passwordKid from "../../../assets/images/auth/password/passwordKid.png";
import lines from "../../../assets/images/auth/login/lines.png";
import LinesRight from "../../../assets/images/auth/otp/linesRightOtp.png";

import { emailValidation } from "../../../validations/authValidations";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { forgotPasswordApi } from "../../../api/auth/authServices";
import { toast } from "react-toastify";

const ForgotPassWordForm: React.FC = () => {
    const [email, setEmail] = useState('')
    const [error, setError] = useState({ email: "" });
    const navigate = useNavigate()
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const emailErr = emailValidation(email);
        setError({
            email: emailErr,
        });
        try {
            const res = await forgotPasswordApi(email)
            if (res?.data?.success) {
                toast.success(res.data.message || "OTP sent successfully");
                      navigate("/forgot/password/otp", { state: { email:email,name:res.data.name } });

            }
        }
        catch (error:any) {
            console.log(error)
            toast.error(error.response?.data?.message || "Something went wrong");

        }

    };
    const handleChange = async (e: any) => {
        const { name, value } = e.target;
        console.log(email)
        setEmail(e.target.value);
        if (name === "email") {
            setError({ ...error, email: emailValidation(value) });
        }

    };
    return (
        <>
            {/* Container */}
            <div className="h-screen  flex justify-center items-center flex-1 relative  sm:w-4/4 md:w-full   ">
                <div className="w-20 mb-10 hidden sm:block">
                    <img
                        src={lines}
                        alt="draw"
                        className="w-28"
                    />
                </div>

                <div className="bg-[#FFF5E0] p-10 rounded-xl  w-[30rem] shadow-lg z-20 ">
                    <h2 className="flex text-2xl font-semibold text-gray-800 mb-5 text-center justify-center">FORGOT PASSWORD</h2>



                    {/* Form */}
                    <form className="flex flex-col gap-3  ">

                        <input
                            type="email"
                            onChange={handleChange}
                            name="email"
                            placeholder="Enter your email"
                            className="text-center appearance-none rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#FFF8EA]"
                        />
                        <p className=" text-left text-red-500 text-sm">{error.email}</p>

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
                >
                </img>
                <img
                    src={passwordKid}
                    alt="kid"
                    className="w-[30rem] absolute mt-28 ml-[650px]"
                />

            </div>

        </>
    )
}
export default ForgotPassWordForm