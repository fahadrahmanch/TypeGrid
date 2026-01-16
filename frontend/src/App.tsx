import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import UserRoutes from "./routes/userRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import CompanyRoutes from "./routes/CompanyRoutes";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userRefreshAPI } from "./api/auth/authServices";
import { useDispatch } from "react-redux";
import { logout, setuserAccessToken, setUserAuthLoaded } from "./store/slices/auth/userAuthSlice";
import { adminRefreshAPI } from "./api/auth/authServices";
import { setAdminAccessToken, setAdminAuthLoaded, } from "./store/slices/auth/adminAuthSlice";
import { companyRefreshAPI } from "./api/auth/authServices";
import { setcompanyAccessToken, setCompanyAuthLoaded } from "./store/slices/auth/companyAuthSlice";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const load = async () => {
      try {
        if (path.startsWith("/admin")) {
          const res = await adminRefreshAPI();
          const accessToken = res?.data?.accessToken;
          if (accessToken) {
            dispatch(setAdminAccessToken({ accessToken }));
          }
        } else if (path.startsWith("/company")) {
          const res = await companyRefreshAPI();
          const accessToken = res?.data?.accessToken;
          const user = res.data.user;
          if (accessToken) {
            dispatch(setcompanyAccessToken({ accessToken, user }));

          }

        } else {
          const res = await userRefreshAPI();
          const accessToken = res?.data?.accessToken;
          const user = res.data.user;
          if (accessToken) {
            dispatch(setuserAccessToken({ accessToken, user }));
          }
        }
      } catch (error) {
        dispatch(logout());
        console.log(error);
      } finally {
        const segment = path.split("/")[1];
        switch (segment) {
          case "admin":
            dispatch(setAdminAuthLoaded(true));
            break;

          case "company":
            dispatch(setCompanyAuthLoaded(true));
            break;

          default:
            dispatch(setUserAuthLoaded(true));
            break;
        }
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
    </>
  );
}

export default App;
