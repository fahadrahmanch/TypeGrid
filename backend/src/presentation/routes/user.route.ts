import express from "express";
import { Routes } from "./main.route";
import { injectCompanyRequestController } from "../DI/user.di";
import { injectUserController } from "../DI/user.di";
import { checkRoleBasedMiddleware } from "../middlewares/check-role-based.middleware";
import { injectTypingPracticeController } from "../DI/user.di";
import { injectGroupPlayController } from "../DI/user.di";
import { injectSoloPlayController } from "../DI/user.di";
import { injectQuickPlayController } from "../DI/user.di";
import { injectDailyChallengeController } from "../DI/user.di";
import { injectLeaderboardController } from "../DI/user.di";
import { injectSubscriptionController } from "../DI/user.di";
import { injectPaymentController } from "../DI/user.di";
import { checkFeatureMiddleware } from "../DI/user.di";
import { injectUserAchievementController } from "../DI/user.di";
import { injectDiscussionController } from "../DI/user.di";
import { asyncHandler } from "../../utils/async-handler";
export class UserRoutes {
  private router: express.Router;
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post(
      Routes.USERS.VERIFY_COMPANY,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectCompanyRequestController.companyRequestDetails)
    );

    this.router.get(
      Routes.USERS.GET_PROFILE,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectUserController.getProfile)
    );

    this.router.put(
      Routes.USERS.UPDATE_PROFILE,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectUserController.updateProfile)
    );
    this.router.put(
      Routes.USERS.CHANGE_PASSWORD,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectUserController.changePassword)
    );
    this.router.get(
      Routes.USERS.GET_COMPANY_STATUS,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectCompanyRequestController.getCompanyStatus)
    );

    this.router.put(
      Routes.USERS.RE_VERIFY_COMPANY,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectCompanyRequestController.reApplyCompanyDetails)
    );

    // typing practice routes
    this.router.get(
      Routes.USERS.GET_RANDOM_PRACTICE_LESSON,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectTypingPracticeController.getRandomPracticeLesson)
    );

    this.router.get(
      Routes.USERS.GET_LESSON_BY_ID,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectTypingPracticeController.getLessonById)
    );

    // group
    this.router.post(
      Routes.USERS.GROUP_PLAY.CREATE_GROUP,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      checkFeatureMiddleware("Group Play"),
      asyncHandler(injectGroupPlayController.createGroup)
    );

    this.router.get(
      Routes.USERS.GROUP_PLAY.GET_GROUP,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectGroupPlayController.getGroup)
    );
    this.router.patch(
      Routes.USERS.GROUP_PLAY.EDIT_GROUP,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectGroupPlayController.editGroup)
    );
    this.router.patch(
      Routes.USERS.GROUP_PLAY.JOIN_GROUP,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectGroupPlayController.joinGroup)
    );
    this.router.delete(
      Routes.USERS.GROUP_PLAY.REMOVE_MEMBER,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectGroupPlayController.removeMember)
    );
    this.router.post(
      Routes.USERS.GROUP_PLAY.START_GAME,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectGroupPlayController.startGame)
    );
    this.router.post(
      Routes.USERS.GROUP_PLAY.NEW_GAME,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectGroupPlayController.newGame)
    );

    //solo
    this.router.post(
      Routes.USERS.SOLO_PLAY.SOLO_CREATE,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      checkFeatureMiddleware("Solo Play"),
      asyncHandler(injectSoloPlayController.createSoloPlay)
    );
    this.router.post(
      Routes.USERS.SOLO_PLAY.RESULT_SOLO_PLAY,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectSoloPlayController.result)
    );

    //quick play
    this.router.post(
      Routes.USERS.QUICK_PLAY.START_QUICK_PLAY,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      checkFeatureMiddleware("Quick Play"),
      asyncHandler(injectQuickPlayController.startQuickPlay)
    );
    this.router.post(
      Routes.USERS.QUICK_PLAY.CHANGE_STATUS,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      checkFeatureMiddleware("Quick Play"),
      asyncHandler(injectQuickPlayController.changeStatus)
    );

    //challenge
    this.router.get(
      Routes.USERS.GET_TODAY_CHALLENGE,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectDailyChallengeController.getTodayChallenge)
    );
    this.router.post(
      Routes.USERS.DAILY_CHALLENGE_FINISHED,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectDailyChallengeController.dailyChallengeFinished)
    );
    this.router.get(
      Routes.USERS.DAILY_CHALLENGE_STATISTICS,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectDailyChallengeController.getStatistics)
    );

    // leaderboard
    this.router.get(
      Routes.USERS.LEADERBOARD,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectLeaderboardController.getLeaderboard)
    );

    //subscription
    this.router.get(
      Routes.USERS.SUBSCRIPTION,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectSubscriptionController.getNormalSubscriptionPlans)
    );
    this.router.get(
      Routes.USERS.COMPANY_PLANS,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectSubscriptionController.getCompanySubscriptionPlans)
    );
    this.router.get(
      Routes.USERS.SUBSCRIPTION_DETAILS,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectSubscriptionController.getSubscriptionDetails)
    );
    this.router.post(
      Routes.USERS.CREATE_SESSION,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectPaymentController.createSession)
    );
    this.router.post(
      Routes.USERS.CONFIRM_SUBSCRIPTION,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectPaymentController.confirmSubscription)
    );
    this.router.post(
      Routes.USERS.CONFIRM_COMPANY_SUBSCRIPTION,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectPaymentController.confirmCompanySubscription)
    );
    this.router.post(
      Routes.USERS.CREATE_COMPANY_SESSION,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectPaymentController.createCompanySession)
    );

    // achievements
    this.router.get(
      Routes.USERS.ACHIEVEMENTS.GET_ALL,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectUserAchievementController.allAchievements)
    );

  this.router.get(
      Routes.USERS.GET_COMPANY_DETAILS,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectUserController.userHaveCompany)
  );

  this.router.get(
    Routes.USERS.GET_ANOTHER_PROFILE,
    checkRoleBasedMiddleware(["user", "companyAdmin", "admin"]),
    asyncHandler(injectUserController.getAnotherUserProfile)
  );
    
    // discussions
    this.router.post(
      Routes.USERS.CREATE_POST,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectDiscussionController.createPost)
    );
    this.router.get(
      Routes.USERS.GET_ALL_DISCUSSIONS,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectDiscussionController.getAllDiscussions)
    );
    this.router.post(
      Routes.USERS.CREATE_COMMENT,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectDiscussionController.createComment)
    );
    this.router.post(
      Routes.USERS.CREATE_REPLY,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectDiscussionController.createReply)
    );
    this.router.get(
      Routes.USERS.GET_MY_DISCUSSIONS,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectDiscussionController.getMyDiscussions)
    );
    this.router.get(
      Routes.USERS.GET_DISCUSSION_BY_ID,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectDiscussionController.getDiscussionById)
    );
    this.router.delete(
      Routes.USERS.DELETE_DISCUSSION,
      checkRoleBasedMiddleware(["user", "companyAdmin"]),
      asyncHandler(injectDiscussionController.deleteDiscussion)
    );
  }
  getRouter() {
    return this.router;
  }
}
