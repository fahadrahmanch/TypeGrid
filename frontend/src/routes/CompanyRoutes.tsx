import { Routes, Route } from "react-router-dom";
import ProtectRouteCompany from "../components/ProtectRoutes/protectRouteCompany";
import CompanyAdminDashboard from "../pages/companyAdmin/companyAdminDashboard";
import CompanySignin from "../pages/auth/CompanySignin";
import { IsloggedCompany } from "../components/ProtectRoutes/protectRouteCompany";
import CompanyForgotPasswordPage from "../pages/auth/CompanyForgotPasswordPage";
import OtpCompanyForgotPasswordPage from "../pages/auth/OtpCompanyForgotPasswordPage";
import CompanyNewPasswordPage from "../pages/auth/companyNewPasswordPage";
import CompanyUsers from "../pages/companyAdmin/companyUsers";
import Lessons from "../pages/companyAdmin/Lessons";
import CompanyUserDashboard from "../pages/companyUser/companyUserDashboard";
export default function CompanyRoutes() {
  return (
    <Routes>
      {/* //auth  */}
      <Route path="signin" element={<IsloggedCompany ><CompanySignin /></IsloggedCompany>} /> 
      <Route path="forgot/password" element={<IsloggedCompany><CompanyForgotPasswordPage /></IsloggedCompany>} />
      <Route path="forgot/password/otp" element={<IsloggedCompany><OtpCompanyForgotPasswordPage /></IsloggedCompany>} />
      <Route path="create/new/password" element={<IsloggedCompany><CompanyNewPasswordPage /></IsloggedCompany>} />
      <Route path="admin/dashboard" element={<ProtectRouteCompany allowedRoles={["companyAdmin"]}><CompanyAdminDashboard /></ProtectRouteCompany>} />
      <Route path="admin/users" element={<ProtectRouteCompany allowedRoles={["companyAdmin"]}><CompanyUsers /></ProtectRouteCompany>} />

      {/* user  */}
      <Route path="user/dashboard" element={<ProtectRouteCompany allowedRoles={["companyUser","companyAdmin"]}><CompanyUserDashboard /></ProtectRouteCompany>} />

      <Route path="admin/lessons" element={<ProtectRouteCompany allowedRoles={["companyAdmin"]}><Lessons /></ProtectRouteCompany>} />
    </Routes>
  );
}
