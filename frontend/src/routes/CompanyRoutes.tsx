import { Routes, Route } from "react-router-dom";
import ProtectRouteCompany from "../components/ProtectRoutes/protectRouteCompany";
import CompanyAdminDashboard from "../pages/companyAdmin/companyAdminDashboard";
import CompanySignin from "../pages/auth/CompanySignin";
import { IsloggedCompany } from "../components/ProtectRoutes/protectRouteCompany";
export default function CompanyRoutes() {
  return (
    <Routes>
         <Route path="signin" element={<IsloggedCompany><CompanySignin /></IsloggedCompany>} />

      <Route path="admin/dashboard" element={<ProtectRouteCompany><CompanyAdminDashboard /></ProtectRouteCompany>} />
    </Routes>
  );
}
