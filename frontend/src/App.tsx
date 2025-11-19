import {  Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Signup from "./pages/auth/signUp";
import Otp from "./pages/auth/Otp";
import SignIn from "./pages/auth/SignIn";
import ForgotPassword from "./pages/auth/ForgotPassWordPage";

import Home from "./pages/user/home";

import { refreshAPI } from "./api/auth/authServices";
import { useDispatch } from "react-redux";
import { logout, setAccessToken ,setAuthLoaded} from "./store/slices/authSlice";

import ProtectRoute from "./components/protectRoute";
import  {Islogged } from "./components/protectRoute";
function App() {
  const dispatch = useDispatch();
    

  useEffect(() => {
    const load = async () => {
      try {
        const res = await refreshAPI();
        const accessToken = res?.data?.accessToken;
        if(accessToken){
          dispatch(setAccessToken({accessToken}));
        }
      }
      catch (error) {
        dispatch(logout());
        console.log(error);
      }finally {
        dispatch(setAuthLoaded(true));
      }
    };
    load();
  },[]);
  
  return (
    <>
      <ToastContainer />
     
        <Routes>
          {/* Auth */}
          <Route path='/signup' element={<Islogged><Signup /></Islogged>} />
          <Route path='/Signin' element={<Islogged><SignIn /></Islogged>} />
          <Route path='/otp' element={<Islogged><Otp /></Islogged>} />
          <Route path='/forgot/password' element={<Islogged><ForgotPassword /></Islogged>} />
          {/* user */}
          <Route path="/" element={<ProtectRoute><Home /></ProtectRoute>} />

        </Routes>
    </>
  );
}

export default App;
