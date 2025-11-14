import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/auth/signUp";
import Otp from "./pages/auth/Otp";
import SignIn from "./pages/auth/SignIn";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={<Signup />} />
          <Route path='/Signin' element={<SignIn />} />
          <Route path='/otp' element={<Otp />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
