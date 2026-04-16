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
import IncomingChallengeModal from "./components/common/IncomingChallengeModal";
import ChallengeRejectedModal from "./components/common/ChallengeRejectedModal";
import { authConfig } from "./config/authConfig";
import { setAccessToken, setAuthLoaded, logout } from "./store/slices/auth/authSlice";
// import { useSelector } from "react-redux";
function App() {
  // const user = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const segment = location.pathname.split("/")[1];
    const config = authConfig[segment] ?? authConfig["user"];

    const load = async () => {
      try {
        const res = await config.refreshFn();
        const accessToken = res?.data?.accessToken;
        const user = res?.data?.user;

        if (accessToken) {
          dispatch(setAccessToken({ accessToken, user }));
        }
      } catch (_error) {
        dispatch(logout());
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
        <Route path="/*" element={<UserRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/company/*" element={<CompanyRoutes />} />
      </Routes>
      <ChallengeModal />
      <IncomingChallengeModal />
      <ChallengeRejectedModal />
    </>
  );
}

export default App;
