import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Signup from "./pages/auth/signUp";
import Otp from "./pages/auth/Otp";
import SignIn from "./pages/auth/SignIn";
import Home from "./pages/user/home";

function App() {

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path='/signup' element={<Signup />} />
          <Route path='/Signin' element={<SignIn />} />
          <Route path='/otp' element={<Otp />} />
          
          {/* user */}
          <Route path="/" element={<Home/>}/>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
