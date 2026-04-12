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
import MyLessons from "../pages/companyUser/myLessons";
import AssignedLessonTypingArea from "../pages/companyUser/AssignedLessonTypingArea";
import CompanyContestManagement from "../pages/companyAdmin/companyContestManagement";
import CompanyContestLobby from "../pages/companyAdmin/CompanyContestLobby";
import GroupsManagement from "../pages/companyAdmin/groupsManagement";
import GroupDetails from "../pages/companyAdmin/GroupDetails";
import NotificationPage from "../pages/companyAdmin/notification";
import Contests from "../pages/companyUser/Contests";
import ContestLobby from "../pages/companyUser/contestLobby";
import ContestArea from "../pages/companyUser/contestArea";
import Challenge from "../pages/companyUser/challenge";
import ChallengeArea from "../pages/companyUser/ChallengeArea";
import CompanyLeaderBoard from "../pages/companyUser/companyLeaderBoard";
import TypingPracticeLLM from "../pages/companyUser/typingPractice";
import PracticeTypingArea from "../pages/companyUser/PracticeTypingArea";
import CompanyUserProfile from "../components/companyUser/companyUserProfile";
import Notifications from "../pages/companyUser/Notifications";
import KeyboardLayout from "../pages/companyUser/KeyboardLayout";
export default function CompanyRoutes() {
  return (
    <Routes>
      {/* Auth */}
      <Route
        path="signin"
        element={
          <IsloggedCompany>
            <CompanySignin />
          </IsloggedCompany>
        }
      />
      <Route
        path="forgot/password"
        element={
          <IsloggedCompany>
            <CompanyForgotPasswordPage />
          </IsloggedCompany>
        }
      />
      <Route
        path="forgot/password/otp"
        element={
          <IsloggedCompany>
            <OtpCompanyForgotPasswordPage />
          </IsloggedCompany>
        }
      />
      <Route
        path="create/new/password"
        element={
          <IsloggedCompany>
            <CompanyNewPasswordPage />
          </IsloggedCompany>
        }
      />

      {/* Admin Routes */}
      <Route element={<ProtectRouteCompany allowedRoles={["companyAdmin"]} />}>
        <Route path="admin/dashboard" element={<CompanyAdminDashboard />} />
        <Route path="admin/users" element={<CompanyUsers />} />
        <Route path="admin/lessons" element={<Lessons />} />
        <Route
          path="admin/contest-management"
          element={<CompanyContestManagement />}
        />
        <Route
          path="admin/contest-management/lobby/:contestId"
          element={<CompanyContestLobby />}
        />
        <Route path="admin/groups" element={<GroupsManagement />} />
        <Route path="admin/groups/:groupId" element={<GroupDetails />} />
        <Route path="admin/notifications" element={<NotificationPage />} />
      </Route>

      {/* Admin + User Routes */}
      <Route
        element={
          <ProtectRouteCompany allowedRoles={["companyUser", "companyAdmin"]} />
        }
      >
        <Route path="user/dashboard" element={<CompanyUserDashboard />} />
        <Route path="user/lessons" element={<MyLessons />} />
        <Route path="user/contests" element={<Contests />} />
        <Route path="user/challenges" element={<Challenge />} />
        <Route path="user/leaderboard" element={<CompanyLeaderBoard />} />
        <Route path="user/challenge/:challengeId" element={<ChallengeArea />} />
        <Route
          path="user/contests/lobby/:contestId"
          element={<ContestLobby />}
        />
        <Route path="user/contest/:contestId" element={<ContestArea />} />
        <Route path="user/my-practice" element={<TypingPracticeLLM />} />
        <Route path="user/practice-area" element={<PracticeTypingArea />} />
        <Route path="user/my-notifications" element={<Notifications />} />
        <Route path="user/my-keyboard" element={<KeyboardLayout />} />
      </Route>

      {/* User Only */}
      <Route element={<ProtectRouteCompany allowedRoles={["companyUser","companyAdmin"]} />}>
        <Route
          path="user/assigned-lessons/:assignedLessonId"
          element={<AssignedLessonTypingArea />}
        />
        <Route path="user/profile"  element={<CompanyUserProfile />} />
      </Route>
    </Routes>
  );
}
