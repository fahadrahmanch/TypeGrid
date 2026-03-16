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

      {/* Auth */}
      <Route
        path="signin"
        element={
          <IsloggedAdmin>
            <AdminSignIn />
          </IsloggedAdmin>
        }
      />

      {/* Protected Admin Routes */}
      <Route element={<ProtectRouteAdmin />}>
        <Route path="users" element={<Users />} />
        <Route path="company" element={<Company />} />
        <Route path="lessons" element={<Lessons />} />
      </Route>

    </Routes>
  );
}