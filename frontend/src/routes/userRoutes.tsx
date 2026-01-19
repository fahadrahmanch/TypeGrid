import { Routes, Route } from "react-router-dom";
import Signup from "../pages/auth/signUp";
import SignIn from "../pages/auth/SignIn";
import Otp from "../pages/auth/Otp";
import ForgotPassword from "../pages/auth/ForgotPassWordPage";
import OtpForgotPassword from "../components/auth/otp/OtpForgotPassword";
import NewPasswordForm from "../components/auth/password/NewPassword";
import { IsloggedUser } from "../components/ProtectRoutes/protectRouteUser";
import ProtectRouteUser from "../components/ProtectRoutes/protectRouteUser";
import Home from "../pages/user/home";
import Profile from "../pages/user/profile";
import EditProfile from "../pages/user/editProfile";
import CompanySubscription from "../pages/user/Subscription/companySubscription";
import CompanyVerification from "../pages/user/Subscription/CompanyVerification";
import CompanyVerificationStatus from "../pages/user/Subscription/CompanyVerificationStatus";
import CompanyVerificationReapply from "../pages/user/Subscription/companyVerificationReapply";
import { useLocation } from "react-router-dom";
import PracticeTyping from "../pages/user/practiceTyping/practiceTyping";
import TypingPracticeArea from "../pages/user/practiceTyping/typingPracticeArea";
import GroupLobby from "../pages/user/group/GroupLobby";
import GroupPlay from "../pages/user/group/groupPlay";
import SoloPlay from "../pages/user/solo/SoloPlay";
export default function UserRoutes() {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      {/* User Auth */}
      <Route path="signup" element={<IsloggedUser><Signup /></IsloggedUser>} />
      <Route path="Signin" element={<IsloggedUser><SignIn /></IsloggedUser>} />
      <Route path="otp" element={<IsloggedUser><Otp /></IsloggedUser>} />
      <Route path="forgot/password" element={<IsloggedUser><ForgotPassword /></IsloggedUser>} />
      <Route path="forgot/password/otp" element={<IsloggedUser><OtpForgotPassword /></IsloggedUser>} />
      <Route path="create/new/password" element={<IsloggedUser><NewPasswordForm /></IsloggedUser>} />

      <Route path="/" element={<ProtectRouteUser><Home /></ProtectRouteUser>} />
      <Route path="profile" element={<ProtectRouteUser><Profile /></ProtectRouteUser>} />
      <Route path="profile/edit" element={<ProtectRouteUser><EditProfile /></ProtectRouteUser>} />

      {/* Subscription */}
      <Route path="subscription/company" element={<ProtectRouteUser><CompanySubscription /></ProtectRouteUser>} />
      <Route path="subscription/company/verify" element={<ProtectRouteUser><CompanyVerification /></ProtectRouteUser>} />
      <Route path="subscription/company/verify/status" element={<ProtectRouteUser><CompanyVerificationStatus /></ProtectRouteUser>} />
      <Route path="subscription/company/re-verify" element={<ProtectRouteUser><CompanyVerificationReapply /></ProtectRouteUser>} />


      {/* Typing Practice */}
      <Route path="/typing/practice" element={<ProtectRouteUser><PracticeTyping /></ProtectRouteUser>} />
      <Route path="/typing/practice/:lessonId" element={<ProtectRouteUser><TypingPracticeArea /></ProtectRouteUser>} />


      {/* // Group  */}
      <Route path="/group-play/group/:joinLink" element={<ProtectRouteUser><GroupLobby /></ProtectRouteUser>} />
      <Route path="/group-play/game/:joinLink" element={<ProtectRouteUser><GroupPlay /></ProtectRouteUser>} />

      <Route path="/solo-play/:soloId" element={<ProtectRouteUser><SoloPlay /></ProtectRouteUser>} />

    </Routes>
  );
}
