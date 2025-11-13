import { BrowserRouter,Routes,Route } from "react-router-dom";
import Signup from "./pages/user/signUp";
import Otp from "./pages/user/Otp";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  return (
    <>
    <ToastContainer />
    <BrowserRouter>
    <Routes>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/otp' element={<Otp/>}/>
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
