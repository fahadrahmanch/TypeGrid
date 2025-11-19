import OtpKid from "../../../assets/images/auth/otp/otp-kid.png";
import lines from "../../../assets/images/auth/login/lines.png";
import LinesRight from "../../../assets/images/auth/otp/linesRightOtp.png";
const ForgotPassWordForm:React.FC=()=>{
    return(
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
                            
                            name="otp"
                            placeholder="Enter your email"
                            className="text-center appearance-none rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#FFF8EA]"
                        />
                        <button
                            type="submit"
                            className="w-full  bg-gray-900 text-white rounded-md py-2 mt-2"
                        >
                            SUBMIT
                        </button>
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
    )
}
export default ForgotPassWordForm