import { MyLessonsController } from "../controllers/company-user/my-lessons.controller";
import { LessonAssignment } from "../../infrastructure/db/models/company/lesson-assignment.schema";
import { LessonAssignmentRepository } from "../../infrastructure/db/repositories/company/lesson-assignment.repository";
import { GetMyLessonsUseCase } from "../../application/use-cases/company-user/lessons/get-my-lessons.use-case";
import { User } from "../../infrastructure/db/models/user/user.schema";
import { UserRepository } from "../../infrastructure/db/repositories/user/user.repository";
import { Lesson } from "../../infrastructure/db/models/admin/lesson.schema";
import { LessonRepository } from "../../infrastructure/db/repositories/admin/lesson.repository";
import { GetAssignLessonUseCase } from "../../application/use-cases/company-user/lessons/get-assign-lesson.use-case";
import { SaveLessonResultUseCase } from "../../application/use-cases/company-admin/company-lesson/save-lesson-result.use-case";
import { LessonResult } from "../../infrastructure/db/models/company/lesson-result.schema";
import { LessonResultRepository } from "../../infrastructure/db/repositories/company/lesson-result.repository";
import { ContestsController } from "../controllers/company-user/contests.controller";
import { GetOpenContestsUseCase } from "../../application/use-cases/company-user/contest/get-open-contests.use-case";
import { Contest } from "../../infrastructure/db/models/company/company-contest.schema";
import { ContestRepository } from "../../infrastructure/db/repositories/company/contest.repository";
import { JoinOrLeaveContestUseCase } from "../../application/use-cases/company-user/contest/join-or-leave-contest.use-case";
import { GetGroupContestUseCase } from "../../application/use-cases/company-user/contest/get-group-contest.use-case";
import { CompanyGroup } from "../../infrastructure/db/models/company/company-group.schema";
import { CompanyGroupRepository } from "../../infrastructure/db/repositories/company/company-group.repository";
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

const lessonAssignmentRepository = new LessonAssignmentRepository(
  LessonAssignment,
);
const userRepository = new UserRepository(User);
const lessonRepository = new LessonRepository(Lesson);
const lessonResultRepository = new LessonResultRepository(LessonResult);
const challengeRepository = new CompanyChallengeRepository(CompanyChallenge);
const competitionRepository = new CompetitionRepository(Competition);

const getAssignLessonUseCaseInstance = new GetAssignLessonUseCase(
  lessonAssignmentRepository,
);
const getMyLessonsUseCaseInstance = new GetMyLessonsUseCase(
  lessonAssignmentRepository,
  userRepository,
);
const saveLessonResultUseCaseInstance = new SaveLessonResultUseCase(
  lessonResultRepository,
  lessonAssignmentRepository,
);
const contestRepositoryInst = new ContestRepository(Contest);
const getOpenContestsUseCaseInstance = new GetOpenContestsUseCase(
  contestRepositoryInst,
  userRepository,
);
const joinOrLeaveContestUseCaseInstance = new JoinOrLeaveContestUseCase(
  contestRepositoryInst,
  userRepository,
);
const companyGroupRepository = new CompanyGroupRepository(CompanyGroup);
const contestRepositorySecond = new ContestRepository(Contest);
const getGroupContestUseCaseInstance = new GetGroupContestUseCase(
  contestRepositoryInst,
  userRepository,
  companyGroupRepository,
  contestRepositorySecond,
);
const getContestUseCaseInstance = new GetContestUseCase(
  contestRepositoryInst,
  userRepository,
  contestRepositorySecond,
);
const getContestDataUseCaseInstance = new GetContestDataUseCase(
  contestRepositoryInst,
  userRepository,
  contestRepositorySecond,
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
  userRepository,
);
const getChallengesUseCaseInstance = new GetChallengesUseCase(
  challengeRepository,
  userRepository,
);
const acceptChallengeUseCaseInstance = new AcceptChallengeUseCase(
  challengeRepository,
  competitionRepository,
);
const getChallengeGameDataUseCaseInstance = new GetChallengeGameDataUseCase(
  challengeRepository,
  competitionRepository,
  userRepository,
  lessonRepository,
);

export const injectChallengesController = new ChallengesController(
  getCompanyUsersUseCaseInstance,
  makeChallengeUseCaseInstance,
  getSentChallengeUseCaseInstance,
  getChallengesUseCaseInstance,
  acceptChallengeUseCaseInstance,
  getChallengeGameDataUseCaseInstance,
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
