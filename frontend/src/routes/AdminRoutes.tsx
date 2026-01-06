import { Routes, Route } from "react-router-dom";
import ProtectRouteAdmin from "../components/ProtectRoutes/protectRouteAdmin";
import Users from "../pages/admin/Users";
import Company from "../pages/admin/Company";
import AdminSignIn from "../pages/auth/AdminSignIn";
import { IsloggedAdmin } from "../components/ProtectRoutes/protectRouteAdmin";
import Lessons from "../pages/admin/Lessons";
export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="signin" element={<IsloggedAdmin><AdminSignIn /></IsloggedAdmin>} />
      <Route path="users" element={<ProtectRouteAdmin><Users /></ProtectRouteAdmin>} />
      <Route path="company" element={<ProtectRouteAdmin><Company /></ProtectRouteAdmin>} />
      <Route path="lessons" element={<ProtectRouteAdmin><Lessons/></ProtectRouteAdmin>}/>
    </Routes>
  );
}
