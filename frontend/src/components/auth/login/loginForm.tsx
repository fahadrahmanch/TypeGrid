import { emailValidation, passwordValidation } from "../../../validations/authValidations";
import { useState } from "react";
import lines from "../../../assets/images/auth/login/lines.png";
import kid2 from "../../../assets/images/auth/login/Kid2.png";
import { signIn } from "../../../api/auth/authServices";
import { toast } from "react-toastify";
import { setAccessToken } from "../../../store/slices/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
export const SignInForm: React.FC = () => {
    const [values, setValues] = useState({ email: "", password: "" });
    const [error, setError] = useState({ email: "", password: "" })
    const dispatch = useDispatch()
    const navigate = useNavigate();

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
            const response = await signIn(values);
            console.log(response.data)
            const accesssToken = response?.data?.accessToken
            const user = response?.data?.UserDeepCopy
            if (!accesssToken || !user) {
                throw new Error('Something went wrong. Please try again')
            }
            dispatch(setAccessToken({ user, accesssToken }))
            navigate("/")
            toast.success(response.data.message)
        }
        catch (error: any) {
            const msg = error?.response?.data?.message || "Something went wrong. Please try again.";
            toast.error(msg);
        }

    };
    const handleChange = async (e: any) => {
        const { name, value } = e.target
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
                        <img
                            src={lines}
                            alt="draw"
                            className="w-64 mb-10  "
                        />
                    </div>
                    {/* SignIn Box */}
                    <div className="bg-[#FFF5E0] p-10 rounded-xl  w-80 z-10 ">
                        <h2 className="flex text-2xl font-semibold text-gray-800 mb-5 justify-center">Welcome back</h2>
                        <p className="text-sm pb-8">Sign in to your account to continue</p>
                        {/* Google Button */}
                        <button className="flex items-center justify-center gap-2 w-full bg-[#FFF8EA] drop-shadow-sm  rounded-md py-2 mb-4 hover:bg-gray-100 transition">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
                                alt="Google icon"
                                className="w-5 h-5"
                            />
                            <span className="text-gray-700 text-sm font-medium">Sign up with Google</span>
                        </button>

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
                            <input
                                type="password"
                                placeholder="Password"
                                name="password"
                                onChange={handleChange}
                                className="rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#FFF8EA]"
                            />
                            <p className="text-left text-red-500 text-sm">{error.password}</p>
                            <button
                                type="submit"
                                onClick={handleSubmit}
                                className="w-full bg-gray-900 text-white rounded-md py-2 mt-2 hover:bg-gray-800 transition"
                            >
                                Sign In
                            </button>
                        </form>

                        <p className="text-center text-gray-600 text-sm mt-4">
                            Don t have an account ?
                            <a href="#" className="text-gray-900 font-medium hover:underline">
                                Sign Up
                            </a>
                        </p>
                    </div>
                    {/* Illustration */}
                    <div className="w-48 ml-[-17px] mt-[6rem] hidden sm:block ">
                        <img
                            src={kid2}
                            alt="kid"

                            className="w-60 "

                        />
                    </div>

                </div>

            </>
        </>
    )
}