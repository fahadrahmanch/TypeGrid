import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

import { googleAuthApi } from "../api/auth/authServices";
import { setuserAccessToken } from "../store/slices/auth/userAuthSlice";
import { GoogleJwtPayload } from "../types/auth";

export const useGoogleAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const token = credentialResponse?.credential;
      if (!token) return;

      const decoded = jwtDecode<GoogleJwtPayload>(token);

      const res = await googleAuthApi({
        email: decoded.email,
        name: decoded.name,
        googleId: decoded.sub,
      });

      const accessToken = res?.data?.accessToken;
      const user = res?.data?.user;

      if (!accessToken || !user) {
        throw new Error("Something went wrong. Please try again");
      }

      dispatch(setuserAccessToken({ accessToken }));
      navigate("/");
      toast.success(res?.data.message);
    } catch (error) {
      console.log("Google Login Error:", error);
      toast.error("Google login failed. Try again.");
    }
  };
  const handleGoogleError = async () => {
    toast.error("Google Login Failed");
  };
  return { handleGoogleSuccess, handleGoogleError };
};
