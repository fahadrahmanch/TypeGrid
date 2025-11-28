import { Routes, Route } from "react-router-dom";
import ProtectRouteCompany from "../components/ProtectRoutes/protectRouteCompany";
import CompanyAdminDashboard from "../pages/companyAdmin/companyAdminDashboard";
import CompanySignin from "../pages/auth/CompanySignin";
import { IsloggedCompany } from "../components/ProtectRoutes/protectRouteCompany";
import CompanyForgotPasswordPage from "../pages/auth/CompanyForgotPasswordPage";
import OtpCompanyForgotPasswordPage from "../pages/auth/OtpCompanyForgotPasswordPage";
import CompanyNewPasswordPage from "../pages/auth/companyNewPasswordPage";
export default function CompanyRoutes() {
  return (
    <Routes>
      {/* //auth  */}
      <Route path="signin" element={<IsloggedCompany><CompanySignin /></IsloggedCompany>} /> 
      <Route path="forgot/password" element={<IsloggedCompany><CompanyForgotPasswordPage /></IsloggedCompany>} />
      <Route path="forgot/password/otp" element={<IsloggedCompany><OtpCompanyForgotPasswordPage /></IsloggedCompany>} />
      <Route path="create/new/password" element={<IsloggedCompany><CompanyNewPasswordPage /></IsloggedCompany>} />


      <Route path="admin/dashboard" element={<ProtectRouteCompany><CompanyAdminDashboard /></ProtectRouteCompany>} />
    </Routes>
  );
}
