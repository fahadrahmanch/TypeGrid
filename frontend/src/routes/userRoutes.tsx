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
import QuickPlay from "../pages/user/quick-play/quickPlay";
import ChangePassword from "../pages/user/changePassword";
import DailyChallenge from "../pages/user/DailyChallenge/dailyChallenge";
import DailyChallengeArea from "../pages/user/DailyChallenge/dailyChallengeArea";

export default function UserRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      {/* Auth Pages */}
      <Route
        path="signup"
        element={
          <IsloggedUser>
            <Signup />
          </IsloggedUser>
        }
      />
      <Route
        path="Signin"
        element={
          <IsloggedUser>
            <SignIn />
          </IsloggedUser>
        }
      />
      <Route
        path="otp"
        element={
          <IsloggedUser>
            <Otp />
          </IsloggedUser>
        }
      />
      <Route
        path="forgot/password"
        element={
          <IsloggedUser>
            <ForgotPassword />
          </IsloggedUser>
        }
      />
      <Route
        path="forgot/password/otp"
        element={
          <IsloggedUser>
            <OtpForgotPassword />
          </IsloggedUser>
        }
      />
      <Route
        path="create/new/password"
        element={
          <IsloggedUser>
            <NewPasswordForm />
          </IsloggedUser>
        }
      />

      {/* Protected Pages */}
      <Route element={<ProtectRouteUser />}>
        <Route path="/" element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/edit" element={<EditProfile />} />
        <Route path="change/password" element={<ChangePassword />} />

        {/* Subscription */}
        <Route path="subscription/company" element={<CompanySubscription />} />
        <Route
          path="subscription/company/verify"
          element={<CompanyVerification />}
        />
        <Route
          path="subscription/company/verify/status"
          element={<CompanyVerificationStatus />}
        />
        <Route
          path="subscription/company/re-verify"
          element={<CompanyVerificationReapply />}
        />

        {/* Typing */}
        <Route path="typing/practice" element={<PracticeTyping />} />
        <Route
          path="typing/practice/:lessonId"
          element={<TypingPracticeArea />}
        />

        {/* Group */}
        <Route path="group-play/group/:joinLink" element={<GroupLobby />} />
        <Route path="group-play/game/:joinLink" element={<GroupPlay />} />

        {/* Solo */}
        <Route path="solo-play/:soloId" element={<SoloPlay />} />

        {/* Quick */}
        <Route path="quick-play" element={<QuickPlay />} />

        {/* Daily Challenge */}
        <Route path="daily-challenge" element={<DailyChallenge />} />
        <Route path="daily-challenge/:id" element={<DailyChallengeArea />} />
      </Route>
    </Routes>
  );
}
