import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import UserRoutes from "./routes/userRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import CompanyRoutes from "./routes/CompanyRoutes";
import ChallengeModal from "./components/common/ChallengeModal";

import { authConfig } from "./config/authConfig";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const segment = location.pathname.split("/")[1];
    const config = authConfig[segment] ?? authConfig["user"];

    const load = async () => {
      try {
        const res = await config.refreshFn();
         console.log("segment:", segment);
  console.log("config:", config);
        const accessToken = res?.data?.accessToken;
        const user = res?.data?.user;
        if (accessToken) {
          dispatch(config.setToken({ accessToken, user }));
        }
      } catch (error) {
        dispatch(config.logout());
      } finally {
        dispatch(config.setLoaded(true));
      }
    };

    load();
  }, []);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/company/*" element={<CompanyRoutes />} />
      </Routes>
      <ChallengeModal />
    </>
  );
}

export default App;