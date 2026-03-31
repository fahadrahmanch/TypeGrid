import { MyLessonsController } from "../controllers/company-user/my-lessons.controller";
import { LessonAssignment } from "../../infrastructure/db/models/company/lesson-assignment.schema";
import { LessonAssignmentRepository } from "../../infrastructure/db/repositories/company/lesson-assignment.repository";
import { GetMyLessonsUseCase } from "../../application/use-cases/company-user/lessons/get-my-lessons.use-case";
import { User } from "../../infrastructure/db/models/user/user.schema";
import { UserRepository } from "../../infrastructure/db/repositories/user/user.repository";
import { Lesson } from "../../infrastructure/db/models/admin/lesson.schema";
import { LessonRepository } from "../../infrastructure/db/repositories/admin/lesson.repository";
import { GetAssignLessonUseCase } from "../../application/use-cases/company-user/lessons/get-assign-lesson.use-case";
import { SaveLessonResultUseCase } from "../../application/use-cases/company-user/lessons/save-lesson-result.use-case";
import { LessonResult } from "../../infrastructure/db/models/company/lesson-result.schema";
import { LessonResultRepository } from "../../infrastructure/db/repositories/company/lesson-result.repository";
import { ContestsController } from "../controllers/company-user/contests.controller";
import { GetOpenContestsUseCase } from "../../application/use-cases/company-user/contest/get-open-contests.use-case";
import { Contest } from "../../infrastructure/db/models/company/company-contest.schema";
import { ContestRepository } from "../../infrastructure/db/repositories/company/contest.repository";
import { JoinOrLeaveContestUseCase } from "../../application/use-cases/company-user/contest/join-or-leave-contest.use-case";
import { GetGroupContestUseCase } from "../../application/use-cases/company-user/contest/get-group-contest.use-case";
import { CompanyGroup } from "../../infrastructure/db/models/company/company-group.schema";
import { CompanyGroupRepositroy } from "../../infrastructure/db/repositories/company/company-group.repository";
import { GetContestUseCase } from "../../application/use-cases/company-user/contest/get-contest.use-case";
import { GetContestDataUseCase } from "../../application/use-cases/company-user/contest/get-contest-data.use-case";
import { ChallengesController } from "../controllers/company-user/challenges.controller";
import { GetCompanyUsersUseCase } from "../../application/use-cases/company-user/get-company-users.use-case";
import { MakeChallengeUseCase } from "../../application/use-cases/company-user/challenges/make-challenge.use-case";
import { CompanyChallenge } from "../../infrastructure/db/models/company/company-challenge.schema";
import { CompanyChallengeRepository } from "../../infrastructure/db/repositories/company/company-challenge.repository";
import { Competition } from "../../infrastructure/db/models/user/competition.schema";
import { CompetitionRepository } from "../../infrastructure/db/repositories/user/competition.repository";
import { GetSentChallengeUseCase } from "../../application/use-cases/company-user/challenges/get-sent-challenge.use-case";
import { GetChallengesUseCase } from "../../application/use-cases/company-user/challenges/get-challenges.use-case";
import { AcceptChallengeUseCase } from "../../application/use-cases/company-user/challenges/accept-challenge.use-case";
import { GetChallengeGameDataUseCase } from "../../application/use-cases/company-user/challenges/get-challenge-game-data.use-case";
import { LeaderBoardController } from "../controllers/company-user/company-leaderboard.controller";
import { CompanyUserStatsRepository } from "../../infrastructure/db/repositories/company/company-user-stats.repository";
import { CompanyUserStats } from "../../infrastructure/db/models/company/company-user-stats.schema";
import { GetCompanyLeaderboardUseCase } from "../../application/use-cases/company-user/stats/get-company-leaderboard.use-case";
import { StreakRepository } from "../../infrastructure/db/repositories/user/streak.repository";
import { Streak } from "../../infrastructure/db/models/user/streak.schema";
import { RejectChallengeUseCase } from "../../application/use-cases/company-user/challenges/reiect-challenge.use-case";

const lessonAssignmentRepository = new LessonAssignmentRepository(
  LessonAssignment,
);
const userRepository = new UserRepository(User);
const lessonRepository = new LessonRepository(Lesson);
const lessonResultRepository = new LessonResultRepository(LessonResult);
const challengeRepository = new CompanyChallengeRepository(CompanyChallenge);
const competitionRepository = new CompetitionRepository(Competition);
const companyUserStatsRepository = new CompanyUserStatsRepository(CompanyUserStats);

const getAssignLessonUseCaseInstance = new GetAssignLessonUseCase(
  lessonAssignmentRepository,
  lessonRepository,
);
const getMyLessonsUseCaseInstance = new GetMyLessonsUseCase(
  lessonAssignmentRepository,
  userRepository,
  lessonRepository,
);
const saveLessonResultUseCaseInstance = new SaveLessonResultUseCase(
  lessonResultRepository,
  lessonAssignmentRepository,
  lessonRepository,
  companyUserStatsRepository,
);
const contestRepositoryInstance = new ContestRepository(Contest);
const getOpenContestsUseCaseInstance = new GetOpenContestsUseCase(
  contestRepositoryInstance,
  userRepository,
);
const joinOrLeaveContestUseCaseInstance = new JoinOrLeaveContestUseCase(
  contestRepositoryInstance,
  userRepository,
);
const companyGroupRepository = new CompanyGroupRepositroy(CompanyGroup);
const getGroupContestUseCaseInstance = new GetGroupContestUseCase(
  contestRepositoryInstance,
  companyGroupRepository,
);
const getContestUseCaseInstance = new GetContestUseCase(
  contestRepositoryInstance,
  userRepository,
);
const getContestDataUseCaseInstance = new GetContestDataUseCase(
  contestRepositoryInstance,
  userRepository,
);
const getCompanyUsersUseCaseInstance = new GetCompanyUsersUseCase(userRepository);

const makeChallengeUseCaseInstance = new MakeChallengeUseCase(
  challengeRepository,
  userRepository,
  competitionRepository,
  lessonRepository,
);
const getSentChallengeUseCaseInstance = new GetSentChallengeUseCase(
  challengeRepository,
);
const getChallengesUseCaseInstance = new GetChallengesUseCase(
  challengeRepository,
  userRepository,
);
const acceptChallengeUseCaseInstance = new AcceptChallengeUseCase(
  challengeRepository,
);
const getChallengeGameDataUseCaseInstance = new GetChallengeGameDataUseCase(
  challengeRepository,
  competitionRepository,
  userRepository,
  lessonRepository,
);

const getCompanyLeaderboardUseCaseInstance = new GetCompanyLeaderboardUseCase(
  companyUserStatsRepository,
  userRepository,
);

const rejectChallengeUseCaseInstance = new RejectChallengeUseCase(
  challengeRepository,
);

export const injectChallengesController = new ChallengesController(
  getCompanyUsersUseCaseInstance,
  makeChallengeUseCaseInstance,
  getSentChallengeUseCaseInstance,
  getChallengesUseCaseInstance,
  acceptChallengeUseCaseInstance,
  getChallengeGameDataUseCaseInstance,
  rejectChallengeUseCaseInstance,
);
export const injectContestController = new ContestsController(
  getOpenContestsUseCaseInstance,
  joinOrLeaveContestUseCaseInstance,
  getGroupContestUseCaseInstance,
  getContestUseCaseInstance,
  getContestDataUseCaseInstance,
);
export const injectMyLessonsController = new MyLessonsController(
  getMyLessonsUseCaseInstance,
  getAssignLessonUseCaseInstance,
  saveLessonResultUseCaseInstance,
);
export const injectLeaderBoardController = new LeaderBoardController(
  getCompanyLeaderboardUseCaseInstance,
);
