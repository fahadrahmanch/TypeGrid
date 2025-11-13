import { BrowserRouter,Routes,Route } from "react-router-dom";
import Signup from "./pages/user/signUp";
import Otp from "./pages/user/Otp";
import "./App.css";

function App() {

  return (
    <>
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
