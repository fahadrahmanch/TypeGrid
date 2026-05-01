import express from "express";
import { Routes } from "./main.route";
import { injectUserManageController } from "../DI/admin.di";
import { injectCompanyManageController } from "../DI/admin.di";
import { checkRoleBasedMiddleware } from "../middlewares/check-role-based.middleware";
import { injectLessonManageController } from "../DI/admin.di";
import { injectRewardManageController } from "../DI/admin.di";
import { validate } from "../middlewares/validate.middleware";
import { createRewardSchema } from "../middlewares/validations/reward.validation";
import { updateRewardSchema } from "../middlewares/validations/reward.validation";
import { injectGoalManageController } from "../DI/admin.di";
import { createGoalSchema } from "../middlewares/validations/goal.validation";
import { updateGoalSchema } from "../middlewares/validations/goal.validation";
import { injectChallengeManageController } from "../DI/admin.di";
import { injectDailyAssignChallengeManageController, injectSubscriptionPlanController } from "../DI/admin.di";
import { challengeValidation } from "../middlewares/validations/challenge.validation";
import { dailyAssignChallengeValidation } from "../middlewares/validations/daily-assign-challenge.validation";
import { lessonValidation } from "../middlewares/validations/lessson.validation";
import { injectAchievementManageController, injectAdminDashboardController } from "../DI/admin.di";
import { achievementValidation } from "../middlewares/validations/achievement.validation";
import { asyncHandler } from "../../utils/async-handler";
export class adminRouter {
  private router: express.Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }
  initializeRoutes() {
    //dashboard stats
    this.router.get(
      Routes.ADMIN.GET_DASHBOARD_STATS,
      checkRoleBasedMiddleware(["admin"]),
      asyncHandler(injectAdminDashboardController.getStats)
    );

    //user management routes

    this.router.get(
      Routes.ADMIN.GET_USERS,
      checkRoleBasedMiddleware(["admin"]),
      asyncHandler(injectUserManageController.getUsers)
    );
    this.router.patch(
      Routes.ADMIN.UPDATE_USER_STATUS,
      checkRoleBasedMiddleware(["admin"]),
      asyncHandler(injectUserManageController.updateUserStatus)
    );

    //company management routes
    this.router.get(
      Routes.ADMIN.GET_COMPANYS,
      checkRoleBasedMiddleware(["admin"]),
      asyncHandler(injectCompanyManageController.getCompanies)
    );

    this.router.patch(
      "/companies/:companyId/status",
      checkRoleBasedMiddleware(["admin"]),
      asyncHandler(injectCompanyManageController.updateCompanyRequestStatus)
    );

    //lesson management routes
    this.router.post(
      Routes.ADMIN.CREATE_LESSON,
      checkRoleBasedMiddleware(["admin"]),
      validate(lessonValidation.createLesson),
      asyncHandler(injectLessonManageController.createLesson)
    );
    this.router.get(
      Routes.ADMIN.FETCH_LESSONS,
      checkRoleBasedMiddleware(["admin"]),
      asyncHandler(injectLessonManageController.getLessons)
    );
    this.router.get(
      Routes.ADMIN.FETCH_LESSON,
      checkRoleBasedMiddleware(["admin"]),
      asyncHandler(injectLessonManageController.fetchLesson)
    );
    this.router.put(
      Routes.ADMIN.UPDATE_LESSON,
      checkRoleBasedMiddleware(["admin"]),
      validate(lessonValidation.updateLesson),
      asyncHandler(injectLessonManageController.updateLesson)
    );

    this.router.delete(
      Routes.ADMIN.DELETE_LESSON,
      checkRoleBasedMiddleware(["admin"]),
      asyncHandler(injectLessonManageController.deleteLesson)
    );

    this.router.post(
      Routes.ADMIN.CREATE_REWARD,
      checkRoleBasedMiddleware(["admin"]),
      validate(createRewardSchema),
      asyncHandler(injectRewardManageController.createReward)
    );

    this.router.get(
      Routes.ADMIN.FETCH_REWARS,
      checkRoleBasedMiddleware(["admin"]),
      asyncHandler(injectRewardManageController.getRewards)
    );
    this.router.get(
      Routes.ADMIN.FETCH_REWARD_BY_ID,
      checkRoleBasedMiddleware(["admin"]),
      asyncHandler(injectRewardManageController.getRewardById)
    );
    this.router.put(
      Routes.ADMIN.UPDATE_REWARD,
      checkRoleBasedMiddleware(["admin"]),
      validate(updateRewardSchema),
      asyncHandler(injectRewardManageController.updateReward)
    );
    this.router.delete(
      Routes.ADMIN.DELETE_REWARD,
      checkRoleBasedMiddleware(["admin"]),
      asyncHandler(injectRewardManageController.deleteReward)
    );
    //goals
    this.router.post(
      Routes.ADMIN.CREATE_GOAL,
      checkRoleBasedMiddleware(["admin"]),
      validate(createGoalSchema),
      asyncHandler(injectGoalManageController.createGoal)
    );
    this.router.get(
      Routes.ADMIN.FETCH_GOALS,
      checkRoleBasedMiddleware(["admin"]),
      asyncHandler(injectGoalManageController.getGoals)
    );
    this.router.get(
      Routes.ADMIN.FETCH_GOAL_BY_ID,
      checkRoleBasedMiddleware(["admin"]),
      asyncHandler(injectGoalManageController.getGoalById)
    );
    this.router.put(
      Routes.ADMIN.UPDATE_GOAL,
      checkRoleBasedMiddleware(["admin"]),
      validate(updateGoalSchema),
      asyncHandler(injectGoalManageController.updateGoal)
    );
    this.router.delete(
      Routes.ADMIN.DELETE_GOAL,
      checkRoleBasedMiddleware(["admin"]),
      asyncHandler(injectGoalManageController.deleteGoal)
    );

    //challenges
    this.router.post(
      Routes.ADMIN.CREATE_CHALLENGE,
      checkRoleBasedMiddleware(["admin"]),
      validate(challengeValidation.create),
      asyncHandler(injectChallengeManageController.createChallenge)
    );
    this.router.get(
      Routes.ADMIN.FETCH_CHALLENGES,
      checkRoleBasedMiddleware(["admin"]),
      asyncHandler(injectChallengeManageController.getChallenges)
    );
    this.router.get(
      Routes.ADMIN.FETCH_CHALLENGE_BY_ID,
      checkRoleBasedMiddleware(["admin"]),
      asyncHandler(injectChallengeManageController.getChallengeById)
    );
    this.router.put(
      Routes.ADMIN.UPDATE_CHALLENGE,
      checkRoleBasedMiddleware(["admin"]),
      validate(challengeValidation.update),
      asyncHandler(injectChallengeManageController.updateChallenge)
    );
    this.router.delete(
      Routes.ADMIN.DELETE_CHALLENGE,
      checkRoleBasedMiddleware(["admin"]),
      asyncHandler(injectChallengeManageController.deleteChallenge)
    );

    //daily assign challenge
    this.router.post(
      Routes.ADMIN.CREATE_DAILY_ASSIGN_CHALLENGE,
      checkRoleBasedMiddleware(["admin"]),
      validate(dailyAssignChallengeValidation.create),
      asyncHandler(injectDailyAssignChallengeManageController.createDailyAssignChallenge)
    );

    this.router.get(
      Routes.ADMIN.FETCH_DAILY_ASSIGN_CHALLENGE,
      checkRoleBasedMiddleware(["admin"]),
      asyncHandler(injectDailyAssignChallengeManageController.getDailyAssignChallenges)
    );

    this.router.get(
      Routes.ADMIN.FETCH_DAILY_ASSIGN_CHALLENGE_BY_ID,
      checkRoleBasedMiddleware(["admin"]),
      asyncHandler(injectDailyAssignChallengeManageController.getDailyAssignChallengeById)
    );

    this.router.put(
      Routes.ADMIN.UPDATE_DAILY_ASSIGN_CHALLENGE,
      checkRoleBasedMiddleware(["admin"]),
      validate(dailyAssignChallengeValidation.update),
      asyncHandler(injectDailyAssignChallengeManageController.updateDailyAssignChallenge)
    );

    this.router.delete(
      Routes.ADMIN.DELETE_DAILY_ASSIGN_CHALLENGE,
      checkRoleBasedMiddleware(["admin"]),
      asyncHandler(injectDailyAssignChallengeManageController.deleteDailyAssignChallenge)
    );

    // Subscription routes
    this.router.post(
      Routes.ADMIN.CREATE_SUBSCRIPTION_PLAN,
      checkRoleBasedMiddleware(["admin"]),
      asyncHandler(injectSubscriptionPlanController.createSubscriptionPlan)
    );
    this.router.get(
      Routes.ADMIN.FETCH_SUBSCRIPTION_NORMAL_PLANS,
      checkRoleBasedMiddleware(["admin"]),
      asyncHandler(injectSubscriptionPlanController.fetchNormalSubscriptionPlans)
    );
    this.router.get(
      Routes.ADMIN.FETCH_SUBSCRIPTION_COMPANY_PLANS,
      checkRoleBasedMiddleware(["admin"]),
      asyncHandler(injectSubscriptionPlanController.fetchCompanySubscriptionPlans)
    );

    this.router.put(
      Routes.ADMIN.UPDATE_SUBSCRIPTION_PLAN,
      checkRoleBasedMiddleware(["admin"]),
      asyncHandler(injectSubscriptionPlanController.updateSubscriptionPlan)
    );

    this.router.delete(
      Routes.ADMIN.DELETE_SUBSCRIPTION_PLAN,
      checkRoleBasedMiddleware(["admin"]),
      asyncHandler(injectSubscriptionPlanController.deleteSubscriptionPlan)
    );

    //achievement management routes
    this.router.post(
      Routes.ADMIN.CREATE_ACHIVEMENT,
      checkRoleBasedMiddleware(["admin"]),
      validate(achievementValidation.create),
      asyncHandler(injectAchievementManageController.createAchievement)
    );

    this.router.get(
      Routes.ADMIN.FETCH_ACHIVEMENTS,
      checkRoleBasedMiddleware(["admin"]),
      asyncHandler(injectAchievementManageController.getAllAchievements)
    );

    this.router.get(
      Routes.ADMIN.FETCH_ACHIVEMENT_BY_ID,
      checkRoleBasedMiddleware(["admin"]),
      asyncHandler(injectAchievementManageController.getAchievementById)
    );

    this.router.put(
      Routes.ADMIN.UPDATE_ACHIVEMENT,
      checkRoleBasedMiddleware(["admin"]),
      validate(achievementValidation.update),
      asyncHandler(injectAchievementManageController.updateAchievement)
    );

    this.router.delete(
      Routes.ADMIN.DELETE_ACHIVEMENT,
      checkRoleBasedMiddleware(["admin"]),
      asyncHandler(injectAchievementManageController.deleteAchievement)
    );
  }
  getRouter() {
    return this.router;
  }
}
