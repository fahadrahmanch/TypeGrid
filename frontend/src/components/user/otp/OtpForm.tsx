import OtpKid from "../../../assets/images/auth/otp/otp-kid.png";
import lines from "../../../assets/images/auth/login/lines.png";
import LinesRight from "../../../assets/images/auth/otp/linesRightOtp.png";
import { verifyOtp } from "../../../api/user/authServices";
import { useLocation } from "react-router-dom";
import { useState } from "react";
const OtpForm: React.FC = () => {
    const [otp,setOtp]=useState<string>("");
    const location=useLocation();
    const email=location.state?.email;
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setOtp(e.target.value);
    };
    async function handleSubmit(e:any){
        e.preventDefault();
        const response=await verifyOtp(otp,email);
        console.log(response.data);
    }
    return (
        <>
            {/* Container */}
            <div className="h-screen flex justify-center items-center flex-1 w-full relative  sm:w-4/4 md:w-full lg:w-full  ">
                <div className="w-26 mb-10 hidden sm:block">
                    <img
                        src={lines}
                        alt="draw"
                        className="w-28"
                    />
                </div>

                <div className="bg-[#FFF5E0] p-10 rounded-xl  w-150 z-10 ">
                    <h2 className="flex text-2xl font-semibold text-gray-800 mb-5 text-center justify-center">Verify Otp</h2>
                    <p className="flex pb-8">
                        Enter the 6 digit code that you will receive in your registered email
                    </p>


                    {/* Form */}
                    <form className="flex flex-col gap-3 ">


                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={6}
                            value={otp}
                            name="otp"
                            placeholder="Enter your OTP"
                            onInput={(e) => {
                                const input = e.target as HTMLInputElement;
                                input.value = input.value.replace(/[^0-9]/g, "");
                            }}
                            onChange={(e)=>handleChange(e)}
                            className="text-center appearance-none rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#FFF8EA]"
                        />
                        <button
                            type="submit"
                            className="w-full bg-gray-900 text-white rounded-md py-2 mt-2 hover:bg-gray-800 transition"
                            onClick={handleSubmit}
                        >
                            Confirm
                        </button>
                        <div className="flex justify-between g">
                            <button
                                type="submit"
                                className="w-52 bg-gray-900 text-white rounded-md py-2 mt-2 hover:bg-gray-800 transition"
                            >
                                Resend Otp
                            </button>
                            <button
                                type="submit"
                                className="w-52 bg-gray-900 text-white rounded-md py-2 mt-2 hover:bg-gray-800 transition"
                            >
                                expires
                            </button>
                        </div>
                    </form>


                </div>

                {/* Illustration */}
                <div className="w-36 mt-12 relative">
                    <img
                        src={OtpKid}
                        alt="kid"
                        className="w-36 absolute mt-28"
                    />
                    <img
                        src={LinesRight}
                        alt="draw"
                        className="w-24 mb-10"
                    >
                    </img>
                </div>
            </div>

        </>
    );
};
export default OtpForm;