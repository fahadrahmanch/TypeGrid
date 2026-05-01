import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

import { companyGoogleAuthApi } from "../api/auth/authServices";
import { setAccessToken } from "../store/slices/auth/authSlice";
import { GoogleJwtPayload } from "../types/auth";

export const useGoogleCompanyAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCompanyGoogleSuccess = async (credentialResponse: any) => {
    try {
      const token = credentialResponse?.credential;
      if (!token) return;

      const decoded = jwtDecode<GoogleJwtPayload>(token);

      const res = await companyGoogleAuthApi({
        email: decoded.email,
        name: decoded.name,
        googleId: decoded.sub,
      });

      const accessToken = res?.data?.accessToken;
      const user = res?.data?.user;

      if (!accessToken || !user) {
        throw new Error("Something went wrong. Please try again");
      }

      dispatch(setAccessToken({ user, accessToken }));
      if (user.role === "companyAdmin") {
        navigate("/company/admin");
      } else if (user.role === "companyUser") {
        navigate("/company/user");
      }
      toast.success(res?.data.message);
    } catch (error: any) {
      console.log("Google Login Error:", error);
      toast.error(error.response?.data?.message || "Google login failed. Try again.");
    }
  };
  const handleCompanyGoogleError = () => {
    toast.error("Google login failed. Try again.");
  };
  return { handleCompanyGoogleSuccess, handleCompanyGoogleError };
};
