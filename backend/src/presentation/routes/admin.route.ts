import express, { Request, Response, NextFunction } from "express";
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
import { injectAchievementManageController } from "../DI/admin.di";
import { achievementValidation } from "../middlewares/validations/achievement.validation";
export class adminRouter {
  private router: express.Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }
  initializeRoutes() {
    //user management routes
    this.router.get(
      Routes.ADMIN.GET_USERS,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectUserManageController.getUsers(req, res, next);
      },
    );
    this.router.patch(
      Routes.ADMIN.UPDATE_USER_STATUS,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectUserManageController.updateUserStatus(req, res, next);
      },
    );

    //company management routes
    this.router.get(
      Routes.ADMIN.GET_COMPANYS,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyManageController.getCompanies(req, res, next);
      },
    );

    this.router.patch(
      "/companies/:companyId/status",
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectCompanyManageController.updateCompanyRequestStatus(
          req,
          res,
          next,
        );
      },
    );

    //lesson management routes
    this.router.post(
      Routes.ADMIN.CREATE_LESSON,
      checkRoleBasedMiddleware(["admin"]),
      validate(lessonValidation.createLesson),
      (req: Request, res: Response, next: NextFunction) => {
        injectLessonManageController.createLesson(req, res, next);
      },
    );
    this.router.get(
      Routes.ADMIN.FETCH_LESSONS,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectLessonManageController.getLessons(req, res, next);
      },
    );
    this.router.get(
      Routes.ADMIN.FETCH_LESSON,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectLessonManageController.fetchLesson(req, res, next);
      },
    );
    this.router.put(
      Routes.ADMIN.UPDATE_LESSON,
      checkRoleBasedMiddleware(["admin"]),
      validate(lessonValidation.updateLesson),
      (req: Request, res: Response, next: NextFunction) => {
        injectLessonManageController.updateLesson(req, res, next);
      },
    );

    this.router.delete(
      Routes.ADMIN.DELETE_LESSON,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectLessonManageController.deleteLesson(req, res, next);
      },
    );

    this.router.post(
      Routes.ADMIN.CREATE_REWARD,
      checkRoleBasedMiddleware(["admin"]),
      validate(createRewardSchema),
      (req: Request, res: Response, next: NextFunction) => {
        injectRewardManageController.createReward(req, res, next);
      },
    );

    this.router.get(
      Routes.ADMIN.FETCH_REWARS,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectRewardManageController.getRewards(req, res, next);
      },
    );
    this.router.get(
      Routes.ADMIN.FETCH_REWARD_BY_ID,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectRewardManageController.getRewardById(req, res, next);
      },
    );
    this.router.put(
      Routes.ADMIN.UPDATE_REWARD,
      checkRoleBasedMiddleware(["admin"]),
      validate(updateRewardSchema),
      (req: Request, res: Response, next: NextFunction) => {
        injectRewardManageController.updateReward(req, res, next);
      },
    );
    this.router.delete(
      Routes.ADMIN.DELETE_REWARD,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectRewardManageController.deleteReward(req, res, next);
      },
    );
    //goals
    this.router.post(
      Routes.ADMIN.CREATE_GOAL,
      checkRoleBasedMiddleware(["admin"]),
      validate(createGoalSchema),
      (req: Request, res: Response, next: NextFunction) => {
        injectGoalManageController.createGoal(req, res, next);
      },
    );
    this.router.get(
      Routes.ADMIN.FETCH_GOALS,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectGoalManageController.getGoals(req, res, next);
      },
    );
    this.router.get(
      Routes.ADMIN.FETCH_GOAL_BY_ID,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectGoalManageController.getGoalById(req, res, next);
      },
    );
    this.router.put(
      Routes.ADMIN.UPDATE_GOAL,
      checkRoleBasedMiddleware(["admin"]),
      validate(updateGoalSchema),
      (req: Request, res: Response, next: NextFunction) => {
        injectGoalManageController.updateGoal(req, res, next);
      },
    );
    this.router.delete(
      Routes.ADMIN.DELETE_GOAL,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectGoalManageController.deleteGoal(req, res, next);
      },
    );

    //challenges
    this.router.post(
      Routes.ADMIN.CREATE_CHALLENGE,
      checkRoleBasedMiddleware(["admin"]),
      validate(challengeValidation.create),
      (req: Request, res: Response, next: NextFunction) => {
        injectChallengeManageController.createChallenge(req, res, next);
      },
    );
    this.router.get(
      Routes.ADMIN.FETCH_CHALLENGES,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectChallengeManageController.getChallenges(req, res, next);
      },
    );
    this.router.get(
      Routes.ADMIN.FETCH_CHALLENGE_BY_ID,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectChallengeManageController.getChallengeById(req, res, next);
      },
    );
    this.router.put(
      Routes.ADMIN.UPDATE_CHALLENGE,
      checkRoleBasedMiddleware(["admin"]),
      validate(challengeValidation.update),
      (req: Request, res: Response, next: NextFunction) => {
        injectChallengeManageController.updateChallenge(req, res, next);
      },
    );
    this.router.delete(
      Routes.ADMIN.DELETE_CHALLENGE,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectChallengeManageController.deleteChallenge(req, res, next);
      },
    );

    //daily assign challenge
    this.router.post(
      Routes.ADMIN.CREATE_DAILY_ASSIGN_CHALLENGE,
      checkRoleBasedMiddleware(["admin"]),
      validate(dailyAssignChallengeValidation.create),
      (req: Request, res: Response, next: NextFunction) => {
        injectDailyAssignChallengeManageController.createDailyAssignChallenge(
          req,
          res,
          next,
        );
      },
    );

    this.router.get(
      Routes.ADMIN.FETCH_DAILY_ASSIGN_CHALLENGE,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectDailyAssignChallengeManageController.getDailyAssignChallenges(
          req,
          res,
          next,
        );
      },
    );

    this.router.get(
      Routes.ADMIN.FETCH_DAILY_ASSIGN_CHALLENGE_BY_ID,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectDailyAssignChallengeManageController.getDailyAssignChallengeById(
          req,
          res,
          next,
        );
      },
    );

    this.router.put(
      Routes.ADMIN.UPDATE_DAILY_ASSIGN_CHALLENGE,
      checkRoleBasedMiddleware(["admin"]),
      validate(dailyAssignChallengeValidation.update),
      (req: Request, res: Response, next: NextFunction) => {
        injectDailyAssignChallengeManageController.updateDailyAssignChallenge(
          req,
          res,
          next,
        );
      },
    );

    this.router.delete(
      Routes.ADMIN.DELETE_DAILY_ASSIGN_CHALLENGE,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectDailyAssignChallengeManageController.deleteDailyAssignChallenge(
          req,
          res,
          next,
        );
      },
    );

    // Subscription routes
    this.router.post(
      Routes.ADMIN.CREATE_SUBSCRIPTION_PLAN,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectSubscriptionPlanController.createSubscriptionPlan(req, res, next);
      },
    );
    this.router.get(
      Routes.ADMIN.FETCH_SUBSCRIPTION_NORMAL_PLANS,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectSubscriptionPlanController.fetchNormalSubscriptionPlans(req, res, next);
      },
    );
    this.router.get(
      Routes.ADMIN.FETCH_SUBSCRIPTION_COMPANY_PLANS,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectSubscriptionPlanController.fetchCompanySubscriptionPlans(req, res, next);
      },
    );

    this.router.put(
      Routes.ADMIN.UPDATE_SUBSCRIPTION_PLAN,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectSubscriptionPlanController.updateSubscriptionPlan(req, res, next);
      },
    );

    this.router.delete(
      Routes.ADMIN.DELETE_SUBSCRIPTION_PLAN,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectSubscriptionPlanController.deleteSubscriptionPlan(req, res, next);
      },
    );

    //achievement management routes
    this.router.post(
      Routes.ADMIN.CREATE_ACHIVEMENT,
      checkRoleBasedMiddleware(["admin"]),
      validate(achievementValidation.create),
      (req: Request, res: Response, next: NextFunction) => {
        injectAchievementManageController.createAchievement(req, res, next);
      },
    );

    this.router.get(
      Routes.ADMIN.FETCH_ACHIVEMENTS,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        injectAchievementManageController.getAllAchievements(req, res, next);
      },
    );

    this.router.get(
      Routes.ADMIN.FETCH_ACHIVEMENT_BY_ID,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        console.log("get achievement by id");
        injectAchievementManageController.getAchievementById(req, res, next);
      },
    );

    this.router.put(
      Routes.ADMIN.UPDATE_ACHIVEMENT,
      checkRoleBasedMiddleware(["admin"]),
      validate(achievementValidation.update),
      (req: Request, res: Response, next: NextFunction) => {
        injectAchievementManageController.updateAchievement(req, res, next);
      },
    );

    this.router.delete(
      Routes.ADMIN.DELETE_ACHIVEMENT,
      checkRoleBasedMiddleware(["admin"]),
      (req: Request, res: Response, next: NextFunction) => {
        console.log("delete achievement");
        injectAchievementManageController.deleteAchievement(req, res, next);
      },
    );
  }
  getRouter() {
    return this.router;
  }
}
