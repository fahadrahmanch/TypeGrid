import OtpKid from "../../../assets/images/auth/otp/otp-kid.png";
import lines from "../../../assets/images/auth/login/lines.png";
import LinesRight from "../../../assets/images/auth/otp/linesRightOtp.png";
import { verifyOtp, resentOtp } from "../../../api/auth/authServices";
import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const OtpForm: React.FC = () => {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [otp, setOtp] = useState<string>("");
  const location = useLocation();
  const name = location.state?.name;
  const email = location.state?.email;
  const password = location.state?.password;
  const navigate = useNavigate();
  const [expire, setExpire] = useState<number>(30);
  const OTP_VALID_TIME = 30;
  useEffect(() => {
  if (!email) {
    navigate("/Signin", { replace: true });
  }
}, []);
 useEffect(() => {
    const savedTime = localStorage.getItem("otpRequestedTime");
    if (savedTime) {
      const elapsed = Math.floor((Date.now() - Number(savedTime)) / 1000);
      const remaining = OTP_VALID_TIME - elapsed;
      if (remaining > 0) setExpire(remaining);
      else {
        setExpire(0);
        localStorage.removeItem("otpRequestedTime");
      }
    } else {
      localStorage.setItem("otpRequestedTime", Date.now().toString());
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    if (expire > 0) {
      timerRef.current = setInterval(() => {
        setExpire((prev) => prev - 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      localStorage.removeItem("otpRequestedTime");
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [expire]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };
  async function otpResent(e: any) {
    e.preventDefault();
    try {
      const response = await resentOtp(name, email);
      toast.success(response.data.message);
       localStorage.setItem("otpRequestedTime", Date.now().toString());
      setExpire(30);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(msg);
    }
  }
  async function handleSubmit(e: any) {
    e.preventDefault();
    try {
      const response = await verifyOtp(otp, name, email, password);
      navigate("/Signin",{replace: true, });
      toast.success(response.data.message);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(msg);
    }
  }

  return (
    <>
      {/* Container */}
      <div className="h-screen flex justify-center items-center flex-1 w-full relative  sm:w-4/4 md:w-full lg:w-full  ">
        <div className="w-26 mb-10 hidden sm:block">
          <img src={lines} alt="draw" className="w-28" />
        </div>

        <div className="bg-[#FFF5E0] p-10 rounded-xl  w-150 z-10 ">
          <h2 className="flex text-2xl font-semibold text-gray-800 mb-5 text-center justify-center">
            Verify Otp
          </h2>
          <p className="flex pb-8">
            Enter the 6 digit code that you will receive in your registered
            email
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
              placeholder="Enter your 6 digits OTP"
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/[^0-9]/g, "");
              }}
              onChange={(e) => handleChange(e)}
              className="text-center appearance-none rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#FFF8EA]"
            />
            <button
              type="submit"
              className={`w-full ${otp.length !== 6 || expire == 0 ? "bg-gray-200" : "bg-gray-900"} text-white rounded-md py-2 mt-2`}
              onClick={handleSubmit}
              disabled={otp.length !== 6 || expire == 0}
            >
              Confirm
            </button>
            <div className="flex justify-between g">
              <button
                className="w-full bg-gray-900 text-white rounded-md py-2 mt-2 hover:bg-gray-800 transition"
                disabled={expire > 0}
                onClick={otpResent}
              >
                {expire == 0 ? "Resent otp" : `expire after ${expire} s`}
              </button>
            </div>
          </form>
        </div>

        {/* Illustration */}
        <div className="w-36 mt-12 relative">
          <img src={OtpKid} alt="kid" className="w-36 absolute mt-28" />
          <img src={LinesRight} alt="draw" className="w-24 mb-10"></img>
        </div>
      </div>
    </>
  );
};
export default OtpForm;
