import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Signup from "./pages/auth/signUp";
import Otp from "./pages/auth/Otp";
import SignIn from "./pages/auth/SignIn";
import ForgotPassword from "./pages/auth/ForgotPassWordPage";
import OtpForgotPassword from "./components/auth/otp/OtpForgotPassword";
import NewPasswordForm from "./components/auth/password/NewPassword";


import Home from "./pages/user/home";
import Profile from "./pages/user/profile";
import EditProfile from "./pages/user/editProfile";
import CompanySubscription from "./pages/user/Subscription/companySubscription";
import CompanyVerification from "./pages/user/Subscription/CompanyVerification";
import CompanyVerificationStatus from "./pages/user/Subscription/CompanyVerificationStatus";
import Users from "./pages/admin/Users";
import Company from "./pages/admin/Company";


import { refreshAPI } from "./api/auth/authServices";
import { useDispatch } from "react-redux";
import { logout, setAccessToken, setAuthLoaded } from "./store/slices/authSlice";

import ProtectRoute from "./components/protectRoute";
import { Islogged } from "./components/protectRoute";
function App() {
  const dispatch = useDispatch();


  useEffect(() => {
    const load = async () => {
      try {
        const res = await refreshAPI();
        const accessToken = res?.data?.accessToken;
        if (accessToken) {
          dispatch(setAccessToken({ accessToken }));
        }
      }
      catch (error) {
        dispatch(logout());
        console.log(error);
      } finally {
        dispatch(setAuthLoaded(true));
      }
    };
    load();
  }, []);

  return (
    <>
      <ToastContainer />

      <Routes>
        {/* Auth */}
        <Route path='/signup' element={<Islogged><Signup /></Islogged>} />
        <Route path='/Signin' element={<Islogged><SignIn /></Islogged>} />
        <Route path='/otp' element={<Islogged><Otp /></Islogged>} />
        <Route path='/forgot/password' element={<Islogged><ForgotPassword /></Islogged>} />
        <Route path="/forgot/password/otp" element={<Islogged><OtpForgotPassword /></Islogged>} />
        <Route path="/create/new/password" element={<Islogged><NewPasswordForm /></Islogged>} />

        {/* user */}
        <Route path="/" element={<ProtectRoute><Home /></ProtectRoute>} />
        <Route path='/profile' element={<ProtectRoute><Profile /></ProtectRoute>} />
        <Route path='/profile/edit' element={<ProtectRoute><EditProfile /></ProtectRoute>} />

        {/* subscription */}
        <Route path="/company/subscription" element={<ProtectRoute><CompanySubscription /></ProtectRoute>} />
        <Route path='/company/subscription/verify' element={<ProtectRoute><CompanyVerification/></ProtectRoute>}/>
        <Route path='/company/subscription/verify/status' element={<ProtectRoute><CompanyVerificationStatus/></ProtectRoute>}/>

        {/* admin  */}
        <Route path='/admin/users' element={<Users />} />
        <Route path='/admin/company' element={<Company />} />
      </Routes>
    </>
  );
}

export default App;
