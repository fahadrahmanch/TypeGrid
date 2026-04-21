import { CompanyRequestController } from '../controllers/user/company-request.controller';
import { CompanyRequestUseCase } from '../../application/use-cases/user/company-request.use-case';
import { CompanyRepository } from '../../infrastructure/db/repositories/company/company.repository';
import { UserRepository } from '../../infrastructure/db/repositories/user/user.repository';
import { LessonRepository } from '../../infrastructure/db/repositories/admin/lesson.repository';
import { CompetitionRepository } from '../../infrastructure/db/repositories/user/competition.repository';
import { GroupRepository } from '../../infrastructure/db/repositories/user/group.repository';
import { ResultRepository } from '../../infrastructure/db/repositories/user/result.repository';
import { Company } from '../../infrastructure/db/models/company/company.schema';
import { UserController } from '../controllers/user/user.controller';
import { TokenService } from '../../application/services/token.service';
import { FindUserUseCase } from '../../application/use-cases/user/find-user.use-case';
import { User } from '../../infrastructure/db/models/user/user.schema';
import { UpdateUserUseCase } from '../../application/use-cases/user/update-user.use-case';
import { GetCompanyUseCase } from '../../application/use-cases/user/get-company.use-case';
import { ICheckUserCompanyUseCase } from '../../application/use-cases/interfaces/user/check-user-company.interface';
import { CheckUserCompanyUseCase } from '../../application/use-cases/user/check-user-company.use-case';
import { CompanyReApplyUseCase } from '../../application/use-cases/user/company-re-apply.use-case';
import { TypingPracticeController } from '../controllers/user/typing-practice.controller';
import { GetPracticeTypingContentUseCase } from '../../application/use-cases/user/typing-practice/get-practice-typing-content.use-case';
import { Lesson } from '../../infrastructure/db/models/admin/lesson.schema';
import { GroupPlayController } from '../controllers/user/group-play.controller';
import { CreateGroupPlayRoomUseCase } from '../../application/use-cases/user/group-play/create-group-play-group.use-case';
import { Group } from '../../infrastructure/db/models/user/group.schema';
import { GetGroupPlayGroupUseCase } from '../../application/use-cases/user/group-play/get-group-play-group.use-case';
import { EditGroupUseCase } from '../../application/use-cases/user/group-play/edit-group.use-case';
import { JoinGroupPlayGroupUseCase } from '../../application/use-cases/user/group-play/join-group-play-group.use-case';
import { RemoveMemberGroupPlayGroupUseCase } from '../../application/use-cases/user/group-play/remove-member-group-play-group.use-case';
import { StartGameGroupPlayGroupUseCase } from '../../application/use-cases/user/group-play/start-game-group-play-group.use-case';
import { Competition } from '../../infrastructure/db/models/user/competition.schema';
import { ChangeGroupStatusUseCase } from '../../application/use-cases/user/group-play/change-group-status.use-case';
import { SoloPlayController } from '../controllers/user/solo-play.controller';
import { CreateSoloPlayUseCase } from '../../application/use-cases/user/solo-play/create-solo-play.use-case';
import { SoloPlayResultUseCase } from '../../application/use-cases/user/solo-play/solo-play-result.use-case';
import { Result } from '../../infrastructure/db/models/user/result.schema';
import { NewGroupPlayUseCase } from '../../application/use-cases/user/group-play/new-group-play.use-case';
import { QuickPlayController } from '../controllers/user/quick-play.controller';
import { StartQuickPlayUseCase } from '../../application/use-cases/user/quick-play/start-quick-play.use-case';
import { ChangeStatusUseCase } from '../../application/use-cases/user/quick-play/change-status.use-case';
import { ChangePasswordUseCase } from '../../application/use-cases/user/change-password.use-case';
import { HashService } from '../../application/services/hash.service';
import { AuthRepository } from '../../infrastructure/db/repositories/auth/auth.repository';
import { GetTodayChallengeUseCase } from '../../application/use-cases/user/daily-challenge/get-daily-challenge.use-case';
import { DailyAssignChallengeRepository } from '../../infrastructure/db/repositories/admin/daily-challenge.repository';
import { DailyChallenge } from '../../infrastructure/db/models/admin/daily-challenge.schema';
import { DailyChallengeController } from '../controllers/user/daily-challenge.controller';
import { ChallengeRepository } from '../../infrastructure/db/repositories/admin/challenge.repository';
import { AdminChallenge } from '../../infrastructure/db/models/admin/challenge.schema';
import { GoalRepository } from '../../infrastructure/db/repositories/admin/goal.repository';
import { Goal } from '../../infrastructure/db/models/admin/goal.schema';
import { RewardRepository } from '../../infrastructure/db/repositories/admin/reward.repository';
import { Reward } from '../../infrastructure/db/models/admin/reward.schema';
import { StreakRepository } from '../../infrastructure/db/repositories/user/streak.repository';
import { Streak } from '../../infrastructure/db/models/user/streak.schema';
import { DailyChallengeProgress } from '../../infrastructure/db/models/user/daily-challenge-progess.schema';
import { DailyChallengeProgressRepository } from '../../infrastructure/db/repositories/user/daily-challenge-progress.repository';
import { DailyChallengeFinishedUseCase } from '../../application/use-cases/user/daily-challenge/daily-challenge-finsihed.use-case';
import { GetDailyChallengeStatsUseCase } from '../../application/use-cases/user/daily-challenge/get-daily-challenge-stats.use-case';
import { StatsRepository } from '../../infrastructure/db/repositories/user/stats.repository';
import { StatsModel } from '../../infrastructure/db/models/stats.schema';
import { GetLeaderboardUseCase } from '../../application/use-cases/user/leaderboard/get-leaderboard.use-case';
import { LeaderboardController } from '../controllers/user/leaderboard.controller';
import { SubscriptionController } from '../controllers/user/subscription.controller';
import { SubscriptionPlanRepository } from '../../infrastructure/db/repositories/admin/subscription-plan.repository';
import { SubscriptionPlan } from '../../infrastructure/db/models/admin/subscription-plan.schema';
import { GetNormalPlansUseCase } from '../../application/use-cases/user/subsciption/get-normal-plans.use-case';
import { GetCompanyPlansUseCase } from '../../application/use-cases/user/subsciption/get-company-plans.use-case';
import { CreateSubscriptionSessionUseCase } from '../../application/use-cases/user/subsciption/create-subscription-session.use-case';
import { ConfirmSubscriptionUseCase } from '../../application/use-cases/user/subsciption/confirm-subscription.use-case';
import { GetSubscriptionDetailsUseCase } from '../../application/use-cases/user/subsciption/get-subscription-details.use-case';
import { UserSubscriptionRepository } from '../../infrastructure/db/repositories/user/user-subscription.repository';
import { UserSubscription } from '../../infrastructure/db/models/user/user.subscription.schema';
import { StripeService } from '../../infrastructure/services/stripe.service';
import { PaymentController } from '../controllers/user/payment.controller';
import { CheckFeatureAccessUseCase } from '../../application/use-cases/user/check-feature-access-use.case';
import { createCheckFeature } from '../middlewares/check-feature.middleware';
import { ConfirmCompanySubscriptionUseCase } from '../../application/use-cases/user/subsciption/confirm-company-subcription.use-case';
import { AchievementRepository } from '../../infrastructure/db/repositories/user/achievement.repository';
import { UserAchievementRepository } from '../../infrastructure/db/repositories/user/user-achievement.repository';
import { AchievementModel } from '../../infrastructure/db/models/admin/acheivment.schema';
import { UserAchievement } from '../../infrastructure/db/models/user/user-achievement.schema';
import { AchievementService } from '../../application/services/achievement.service';
import { GetAllAchievementsUseCase } from '../../application/use-cases/user/achievements/get-all-achievements.use-case';
import { UserAchievementController } from '../controllers/user/user-achievment.controller';

const statsRepository = new StatsRepository(StatsModel);
const userRepository = new UserRepository(User);
const authRepository = new AuthRepository();
const companyRepository = new CompanyRepository(Company);
const achievementRepository = new AchievementRepository(AchievementModel);
const userAchievementRepository = new UserAchievementRepository(UserAchievement);
const achievementServiceInstance = new AchievementService(
  achievementRepository,
  userAchievementRepository,
  statsRepository
);
const lessonRepository = new LessonRepository(Lesson);
const companyRequestUseCaseInstance = new CompanyRequestUseCase(companyRepository, userRepository);
const tokenService = new TokenService();
const findUserUseCaseInstance = new FindUserUseCase(authRepository);
const getCompanyUseCaseInstance = new GetCompanyUseCase(companyRepository);
const companyReApplyUseCaseInstance = new CompanyReApplyUseCase(companyRepository, userRepository);
const updateUserUseCaseInstance = new UpdateUserUseCase(userRepository);
const hashService = new HashService();
const changePasswordUseCaseInstance = new ChangePasswordUseCase(userRepository, hashService);
// typing practice dependencies
const getPracticeTypingContentUseCaseInstance = new GetPracticeTypingContentUseCase(lessonRepository);

// group play
const groupRepository = new GroupRepository(Group);
const competitionRepository = new CompetitionRepository(Competition);
const createGroupPlayRoomUseCaseInstance = new CreateGroupPlayRoomUseCase(groupRepository, userRepository);
const getGroupPlayGroupUseCaseInstance = new GetGroupPlayGroupUseCase(groupRepository, userRepository);
const editGroupUseCaseInstance = new EditGroupUseCase(groupRepository);
const joinGroupPlayGroupUseCaseInstance = new JoinGroupPlayGroupUseCase(groupRepository, userRepository);
const removeMemberGroupPlayGroupUseCaseInstance = new RemoveMemberGroupPlayGroupUseCase(
  groupRepository,
  userRepository
);
const startGameGroupPlayGroupUseCaseInstance = new StartGameGroupPlayGroupUseCase(
  competitionRepository,
  groupRepository,
  lessonRepository,
  userRepository
);
const changeGroupStatusUseCaseInstance = new ChangeGroupStatusUseCase(groupRepository);
const newGroupPlayUseCaseInstance = new NewGroupPlayUseCase(
  groupRepository,
  userRepository,
  competitionRepository,
  lessonRepository
);

// solo play
const resultRepository = new ResultRepository(Result);
const createSoloPlayUseCase = new CreateSoloPlayUseCase(lessonRepository, competitionRepository, userRepository);
const soloPlayResultUseCaseInstance = new SoloPlayResultUseCase(
  competitionRepository,
  userRepository,
  resultRepository,
  statsRepository,
  lessonRepository,
  achievementServiceInstance
);
export const injectSoloPlayController = new SoloPlayController(createSoloPlayUseCase, soloPlayResultUseCaseInstance);

// quick play
const startQuickPlayUseCaseInstance = new StartQuickPlayUseCase(
  competitionRepository,
  userRepository,
  lessonRepository
);
const changeStatusUseCaseInstance = new ChangeStatusUseCase(competitionRepository);
export const injectQuickPlayController = new QuickPlayController(
  startQuickPlayUseCaseInstance,
  changeStatusUseCaseInstance
);

export const injectGroupPlayController = new GroupPlayController(
  createGroupPlayRoomUseCaseInstance,
  getGroupPlayGroupUseCaseInstance,
  editGroupUseCaseInstance,
  joinGroupPlayGroupUseCaseInstance,
  removeMemberGroupPlayGroupUseCaseInstance,
  startGameGroupPlayGroupUseCaseInstance,
  changeGroupStatusUseCaseInstance,
  newGroupPlayUseCaseInstance
);

export const injectTypingPracticeController = new TypingPracticeController(getPracticeTypingContentUseCaseInstance);
export const injectCompanyRequestController = new CompanyRequestController(
  companyRequestUseCaseInstance,
  tokenService,
  findUserUseCaseInstance,
  getCompanyUseCaseInstance,
  companyReApplyUseCaseInstance
);
const checkUserCompanyUseCaseInstance = new CheckUserCompanyUseCase(userRepository, companyRepository);

export const injectUserController = new UserController(
  findUserUseCaseInstance,
  updateUserUseCaseInstance,
  changePasswordUseCaseInstance,
  checkUserCompanyUseCaseInstance
);

// daily challenge
const dailyChallengeRepository = new DailyAssignChallengeRepository(DailyChallenge);
const streakRepository = new StreakRepository(Streak);
const challengeRepository = new ChallengeRepository(AdminChallenge);
const goalRepository = new GoalRepository(Goal);
const dailyChallengeProgressRepository = new DailyChallengeProgressRepository(DailyChallengeProgress);
const rewardRepository = new RewardRepository(Reward);
const getTodayChallengeUseCaseInstance = new GetTodayChallengeUseCase(
  dailyChallengeRepository,
  challengeRepository,
  goalRepository,
  rewardRepository,
  lessonRepository
);
const dailyChallengeFinishedUseCaseInstance = new DailyChallengeFinishedUseCase(
  dailyChallengeRepository,
  challengeRepository,
  goalRepository,
  rewardRepository,
  dailyChallengeProgressRepository,
  streakRepository,
  statsRepository
);
const getDailyChallengeStatsUseCaseInstance = new GetDailyChallengeStatsUseCase(
  dailyChallengeProgressRepository,
  streakRepository,
  dailyChallengeRepository
);
export const injectDailyChallengeController = new DailyChallengeController(
  getTodayChallengeUseCaseInstance,
  dailyChallengeFinishedUseCaseInstance,
  getDailyChallengeStatsUseCaseInstance
);

// leaderboard
const getLeaderboardUseCaseInstance = new GetLeaderboardUseCase(statsRepository, userRepository);
const subscriptionRepository = new SubscriptionPlanRepository(SubscriptionPlan);
const getNormalPlansUseCaseInstance = new GetNormalPlansUseCase(subscriptionRepository);
const getCompanyPlansUseCaseInstance = new GetCompanyPlansUseCase(subscriptionRepository);
const userSubscriptionRepository = new UserSubscriptionRepository(UserSubscription);
const getSubscriptionDetailsUseCaseInstance = new GetSubscriptionDetailsUseCase(
  userSubscriptionRepository,
  companyRepository,
  subscriptionRepository,
  userRepository
);
export const injectSubscriptionController = new SubscriptionController(
  getNormalPlansUseCaseInstance,
  getCompanyPlansUseCaseInstance,
  getSubscriptionDetailsUseCaseInstance
);
const confirmSubscriptionUseCaseInstance = new ConfirmSubscriptionUseCase(
  subscriptionRepository,
  userSubscriptionRepository,
  userRepository
);
const stripeService = new StripeService();
const createSubscriptionSessionUseCaseInstance = new CreateSubscriptionSessionUseCase(
  subscriptionRepository,
  stripeService
);
const confirmCompanySubscriptionUseCaseInstance = new ConfirmCompanySubscriptionUseCase(
  subscriptionRepository,
  userSubscriptionRepository,
  userRepository,
  companyRepository
);
export const injectPaymentController = new PaymentController(
  createSubscriptionSessionUseCaseInstance,
  confirmSubscriptionUseCaseInstance,
  confirmCompanySubscriptionUseCaseInstance
);
export const injectLeaderboardController = new LeaderboardController(getLeaderboardUseCaseInstance);

const checkFeatureAccessUseCaseInstance = new CheckFeatureAccessUseCase(
  userSubscriptionRepository,
  subscriptionRepository
);

export const checkFeatureMiddleware = createCheckFeature(checkFeatureAccessUseCaseInstance);

// achievements
const getAllAchievementsUseCaseInstance = new GetAllAchievementsUseCase(
  achievementRepository,
  userAchievementRepository
);
export const injectUserAchievementController = new UserAchievementController(getAllAchievementsUseCaseInstance);
