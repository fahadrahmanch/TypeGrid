import { GetUsersUseCase } from "../../application/use-cases/admin/users/get-users.use-case";
import { UserManageController } from "../controllers/admin/user-manage.controller";
import { AuthRepository } from "../../infrastructure/db/repositories/auth/auth.repository";
import { GetCompaniesUseCase } from "../../application/use-cases/admin/company-management/get-companies.use-case";
import { CompanyRepository } from "../../infrastructure/db/repositories/company/company.repository";
import { Company } from "../../infrastructure/db/models/company/company.schema";
import { CompanyManageController } from "../controllers/admin/company-manage.controller";
import { ApproveCompanyUseCase } from "../../application/use-cases/admin/company-management/approve-company.use-case";
import { RejectCompanyUseCase } from "../../application/use-cases/admin/company-management/reject-company.use-case";
import { User } from "../../infrastructure/db/models/user/user.schema";
import { UserRepository } from "../../infrastructure/db/repositories/user/user.repository";
import { BlockUserUseCase } from "../../application/use-cases/admin/users/block-user.use-case";
import { EmailService } from "../../infrastructure/services/email.service";
import { LessonManageController } from "../controllers/admin/lesson-manage.controller";
import { CreateLessonUseCase } from "../../application/use-cases/admin/lesson-management/create-lesson.use-case";
import { Lesson } from "../../infrastructure/db/models/admin/lesson.schema";
import { LessonRepository } from "../../infrastructure/db/repositories/admin/lesson.repository";
import { GetLessonUseCase } from "../../application/use-cases/admin/lesson-management/get-lesson.use-case";
import { UpdateLessonUseCase } from "../../application/use-cases/admin/lesson-management/update-lesson.use-case";
import { DeleteLessonUseCase } from "../../application/use-cases/admin/lesson-management/delete-lesson.use-case";
import { GetLessonsUseCase } from "../../application/use-cases/admin/lesson-management/get-lessons.use-case";
import { RewardManageController } from "../controllers/admin/reward-manage.controller";
import { CreateRewardUseCase } from "../../application/use-cases/admin/reward/create-reward.use-case";
import { RewardRepository } from "../../infrastructure/db/repositories/admin/reward.repository";
import { Reward } from "../../infrastructure/db/models/admin/reward.schema";
import { GetRewardsUseCase } from "../../application/use-cases/admin/reward/get-rewards.use-case";
import { GetRewardByIdUseCase } from "../../application/use-cases/admin/reward/get-reward-by-id.use-case";
import { UpdateRewardUseCase } from "../../application/use-cases/admin/reward/update-reward.use-case";
import { DeleteRewardUseCase } from "../../application/use-cases/admin/reward/delete-reward.use-case";
import { GoalManageController } from "../controllers/admin/goal-manage.controller";
import { GoalRepository } from "../../infrastructure/db/repositories/admin/goal.repository";
import { Goal } from "../../infrastructure/db/models/admin/goal.schema";
import { CreateGoalUseCase } from "../../application/use-cases/admin/goal/create-goal.use-case";
import { GetGoalUseCase } from "../../application/use-cases/admin/goal/get-goal.use-case";
import { GetGoalsUseCase } from "../../application/use-cases/admin/goal/get-goals.use-case";
import { UpdateGoalUseCase } from "../../application/use-cases/admin/goal/update-goal.use-case";
import { DeleteGoalUseCase } from "../../application/use-cases/admin/goal/delete-goal.use-case";
import { ChallengeManageController } from "../controllers/admin/challenge-manage.controller";
import { ChallengeRepository } from "../../infrastructure/db/repositories/admin/challenge.repository";
import { AdminChallenge } from "../../infrastructure/db/models/admin/challenge.schema";
import { DailyChallenge } from "../../infrastructure/db/models/admin/daily-challenge.schema";
import { CreateChallengeUseCase } from "../../application/use-cases/admin/challenge/create-challenge.use-case";
import { GetChallengeUseCase } from "../../application/use-cases/admin/challenge/get-challenge.use-case";
import { GetChallengesUseCase } from "../../application/use-cases/admin/challenge/get-challenges.use-case";
import { UpdateChallengeUseCase } from "../../application/use-cases/admin/challenge/update-challenge.use-case";
import { DeleteChallengeUseCase } from "../../application/use-cases/admin/challenge/delete-challenge.use-case";
import { DailyAssignChallengeManageController } from "../controllers/admin/daily-challenge-assign.controller";
import { DailyAssignChallengeRepository } from "../../infrastructure/db/repositories/admin/daily-challenge.repository";
import { CreateDailyAssignChallengeUseCase } from "../../application/use-cases/admin/daily-challenge/create-daily-challenge.use-case";
import { GetDailyAssignChallengeUseCase } from "../../application/use-cases/admin/daily-challenge/get-daily-challenge.use-case";
import { UpdateDailyAssignChallengeUseCase } from "../../application/use-cases/admin/daily-challenge/update-daily-challenge.use-case";
import { DeleteDailyAssignChallengeUseCase } from "../../application/use-cases/admin/daily-challenge/delete-daily-challenge.use-case";
import { GetDailyAssignChallengesUseCase } from "../../application/use-cases/admin/daily-challenge/get-all-daily-challenges.use-case";
import { DailyChallengeProgress } from "../../infrastructure/db/models/user/daily-challenge-progess.schema";
import { DailyChallengeProgressRepository } from "../../infrastructure/db/repositories/user/daily-challenge-progress.repository";
import { SubscriptionPlanRepository } from "../../infrastructure/db/repositories/admin/subscription-plan.repository";
import { SubscriptionController } from "../controllers/admin/subscription.controller";
import { SubscriptionPlan } from "../../infrastructure/db/models/admin/subscription-plan.schema";
import { CreateSubscriptionPlanUseCase } from "../../application/use-cases/admin/subscription/create-subscription-plan.use-case";
import { FetchNormalSubscriptionPlansUseCase } from "../../application/use-cases/admin/subscription/fetch-normal-subscription-plans.use-case";
import { FetchCompanySubscriptionPlansUseCase } from "../../application/use-cases/admin/subscription/fetch-company-subscription-plans.use-case";
import { AchievementModel } from "../../infrastructure/db/models/admin/acheivment.schema";
import { AchievementRepository } from "../../infrastructure/db/repositories/user/achievement.repository";
import { CreateAchievementUseCase } from "../../application/use-cases/admin/acheivment/create-acheivement.use-case";
import { GetAchievementsUseCase } from "../../application/use-cases/admin/acheivment/get-achievements.use-case";
import { GetAchievementByIdUseCase } from "../../application/use-cases/admin/acheivment/get-achievement-by-id.use-case";
import { UpdateAchievementUseCase } from "../../application/use-cases/admin/acheivment/update-achievement.use-case";
import { DeleteAchievementUseCase } from "../../application/use-cases/admin/acheivment/delete-achievement.use-case";
import { AchievementManageController } from "../controllers/admin/acheivement-manage.controller";
const authRepo = new AuthRepository();
const userRepository = new UserRepository(User);
const blockUserUseCase = new BlockUserUseCase(userRepository);
const companyRepository = new CompanyRepository(Company);
const getUsersUseCase = new GetUsersUseCase(authRepo);
const getCompaniesUseCase = new GetCompaniesUseCase(companyRepository);
const emailService = new EmailService();
const approveCompanyUseCase = new ApproveCompanyUseCase(
  companyRepository,
  userRepository,
  emailService,
);
const rejectCompanyUseCase = new RejectCompanyUseCase(
  companyRepository,
  emailService,
);
const lessonRepository = new LessonRepository(Lesson);
const createLessonUseCase = new CreateLessonUseCase(lessonRepository);
const getLessonUseCase = new GetLessonUseCase(lessonRepository);
const updateLessonUseCase = new UpdateLessonUseCase(lessonRepository);
const deleteLessonUseCase = new DeleteLessonUseCase(lessonRepository);
const getLessonsUseCase = new GetLessonsUseCase(lessonRepository);
const rewardRepository = new RewardRepository(Reward);
const getRewardsUseCase = new GetRewardsUseCase(rewardRepository);
const createRewardUseCase = new CreateRewardUseCase(rewardRepository);
const getRewardByIdUseCase = new GetRewardByIdUseCase(rewardRepository);
const updateRewardUseCase = new UpdateRewardUseCase(rewardRepository);
const deleteRewardUseCase = new DeleteRewardUseCase(rewardRepository);

export const injectRewardManageController = new RewardManageController(
  createRewardUseCase,
  getRewardsUseCase,
  getRewardByIdUseCase,
  updateRewardUseCase,
  deleteRewardUseCase,
);
export const injectCompanyManageController = new CompanyManageController(
  getCompaniesUseCase,
  approveCompanyUseCase,
  rejectCompanyUseCase,
);
export const injectUserManageController = new UserManageController(
  getUsersUseCase,
  blockUserUseCase,
);
export const injectLessonManageController = new LessonManageController(
  createLessonUseCase,
  getLessonUseCase,
  updateLessonUseCase,
  deleteLessonUseCase,
  getLessonsUseCase,
);

const goalRepository = new GoalRepository(Goal);
const createGoalUseCase = new CreateGoalUseCase(goalRepository);
const getGoalUseCase = new GetGoalUseCase(goalRepository);
const updateGoalUseCase = new UpdateGoalUseCase(goalRepository);
const deleteGoalUseCase = new DeleteGoalUseCase(goalRepository);
const getGoalsUseCase = new GetGoalsUseCase(goalRepository);

export const injectGoalManageController = new GoalManageController(
  createGoalUseCase,
  getGoalUseCase,
  updateGoalUseCase,
  deleteGoalUseCase,
  getGoalsUseCase,
);
const dailyChallengeProgressRepository = new DailyChallengeProgressRepository(DailyChallengeProgress);

const challengeRepository = new ChallengeRepository(AdminChallenge);
const createChallengeUseCase = new CreateChallengeUseCase(challengeRepository);
const getChallengeUseCase = new GetChallengeUseCase(challengeRepository);
const updateChallengeUseCase = new UpdateChallengeUseCase(challengeRepository);
const deleteChallengeUseCase = new DeleteChallengeUseCase(challengeRepository);
const getChallengesUseCase = new GetChallengesUseCase(challengeRepository);

export const injectChallengeManageController = new ChallengeManageController(
  createChallengeUseCase,
  getChallengeUseCase,
  updateChallengeUseCase,
  deleteChallengeUseCase,
  getChallengesUseCase,
);

const dailyChallengeRepository = new DailyAssignChallengeRepository(
  DailyChallenge,
);
const createDailyAssignChallengeUseCase = new CreateDailyAssignChallengeUseCase(
  dailyChallengeRepository,
  challengeRepository,
);
const getDailyAssignChallengeUseCase = new GetDailyAssignChallengeUseCase(
  dailyChallengeRepository,
  challengeRepository,
);
const updateDailyAssignChallengeUseCase = new UpdateDailyAssignChallengeUseCase(
  dailyChallengeRepository,
  challengeRepository,
);
const deleteDailyAssignChallengeUseCase = new DeleteDailyAssignChallengeUseCase(
  dailyChallengeRepository,
);
const getDailyAssignChallengesUseCase = new GetDailyAssignChallengesUseCase(
  dailyChallengeRepository,
  challengeRepository,
);


const subscriptionPlanRepository = new SubscriptionPlanRepository(SubscriptionPlan);
const createSubscriptionPlanUseCase = new CreateSubscriptionPlanUseCase(subscriptionPlanRepository);
const fetchNormalSubscriptionPlansUseCase = new FetchNormalSubscriptionPlansUseCase(subscriptionPlanRepository);
const fetchCompanySubscriptionPlansUseCase = new FetchCompanySubscriptionPlansUseCase(subscriptionPlanRepository);
// const getSubscriptionPlanUseCase = new GetSubscriptionPlanUseCase(subscriptionPlanRepository);
// const updateSubscriptionPlanUseCase = new UpdateSubscriptionPlanUseCase(subscriptionPlanRepository);
// const deleteSubscriptionPlanUseCase = new DeleteSubscriptionPlanUseCase(subscriptionPlanRepository);
// const getSubscriptionPlansUseCase = new GetSubscriptionPlansUseCase(subscriptionPlanRepository);

export const injectSubscriptionPlanController = new SubscriptionController(
  createSubscriptionPlanUseCase,
  fetchNormalSubscriptionPlansUseCase,
  fetchCompanySubscriptionPlansUseCase,
);

export const injectDailyAssignChallengeManageController =
  new DailyAssignChallengeManageController(
    createDailyAssignChallengeUseCase,
    getDailyAssignChallengeUseCase,
    updateDailyAssignChallengeUseCase,
    deleteDailyAssignChallengeUseCase,
    getDailyAssignChallengesUseCase,
  );

const achievementRepository = new AchievementRepository(AchievementModel);
const createAchievementUseCase = new CreateAchievementUseCase(achievementRepository);
const getAchievementsUseCase = new GetAchievementsUseCase(achievementRepository);
const getAchievementByIdUseCase = new GetAchievementByIdUseCase(achievementRepository);
const updateAchievementUseCase = new UpdateAchievementUseCase(achievementRepository);
const deleteAchievementUseCase = new DeleteAchievementUseCase(achievementRepository);

export const injectAchievementManageController = new AchievementManageController(
  createAchievementUseCase,
  getAchievementsUseCase,
  getAchievementByIdUseCase,
  updateAchievementUseCase,
  deleteAchievementUseCase,
);
