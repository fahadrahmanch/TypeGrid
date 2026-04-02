import { Routes, Route } from "react-router-dom";
import ProtectRouteAdmin from "../components/ProtectRoutes/protectRouteAdmin";
import Users from "../pages/admin/Users";
import Company from "../pages/admin/Company";
import AdminSignIn from "../pages/auth/AdminSignIn";
import { IsloggedAdmin } from "../components/ProtectRoutes/protectRouteAdmin";
import Lessons from "../pages/admin/Lessons";
import Challenges from "../pages/admin/Challenges";
import Reward from "../pages/admin/Reward";
import Goals from "../pages/admin/Goals";
import DailyAssignment from "../pages/admin/DailyAssignment";
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
        <Route path="challenges" element={<Challenges />} />
        <Route path="reward" element={<Reward />} />
        <Route path="goals" element={<Goals />} />
        <Route path="daily-assignment" element={<DailyAssignment />} />
      </Route>
    </Routes>
  );
}
