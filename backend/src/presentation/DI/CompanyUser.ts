import { MyLessonsController } from "../controllers/company-user/MyLessonsController";
import { LessonAssignment } from "../../infrastructure/db/models/company/lesssonAssigmentSchema";
import { LessonAssignmentRepository } from "../../infrastructure/db/repositories/company/LessonAssignmentRepository";
import { getMyLessonsUseCase } from "../../application/use-cases/companyUser/getMyLessonsUseCase";
import { User } from "../../infrastructure/db/models/user/userSchema";
import { UserRepository } from "../../infrastructure/db/repositories/user/UserRepository";
import { Lesson } from "../../infrastructure/db/models/admin/lessonSchema";
import { LessonRepository } from "../../infrastructure/db/repositories/admin/LessonRepository";
import { getAssignLessonUseCase } from "../../application/use-cases/companyUser/getAssignLessonUseCase";
import { saveLessonResultUseCase } from "../../application/use-cases/companyAdmin/companyLessonUseCases/saveLessonResultUseCase";
import { LessonResult } from "../../infrastructure/db/models/company/LessonResultSchema";
import { LessonResultRepository } from "../../infrastructure/db/repositories/company/LessonResultRepository";
import { ContestsController } from "../controllers/company-user/ContestsController";
import { getOpenContestsUseCase } from "../../application/use-cases/companyUser/getOpenContestsUseCase";
import { Contest } from "../../infrastructure/db/models/company/companyContestSchema";
import { ContestRepository } from "../../infrastructure/db/repositories/company/ContestRepository";
import { joinOrLeaveContestUseCase } from "../../application/use-cases/companyUser/joinOrLeaveContestUseCase";
import { getGroupConstestsUsecase } from "../../application/use-cases/companyUser/getGroupContestsUseCase";
import { companyGroupRepositroy } from "../../infrastructure/db/repositories/companyUser/companyGroupRepository";
import { CompanyGroup } from "../../infrastructure/db/models/company/companyGroupSchema";
import { CompanyGroupRepository } from "../../infrastructure/db/repositories/company/CompanyGroupRepository";
import { contestRepository } from "../../infrastructure/db/repositories/companyUser/contestRepository";
import { getContestUseCase } from "../../application/use-cases/companyUser/getContestUseCase";
import { getContestDataUseCase } from "../../application/use-cases/companyUser/getContestDataUseCase";
import { challengesController } from "../controllers/company-user/ChallegesController";
import { getCompanyUsers } from "../../application/use-cases/companyUser/getCompanyUsers";
import { makeChallengeUseCase } from "../../application/use-cases/companyUser/challenges/makeChallengeUseCase";
import { CompanyChallenge } from "../../infrastructure/db/models/company/companyChallengeSchema";
import { CompanyChallengeRepository } from "../../infrastructure/db/repositories/company/CompanyChallengeRepository";
import { Competition } from "../../infrastructure/db/models/user/competitionSchema";
import { CompetitionRepository } from "../../infrastructure/db/repositories/user/CompetitionRepository";
import { getSentChallengesUseCase } from "../../application/use-cases/companyUser/challenges/getSendChallengesUseCase";
import { getChallengesUseCase } from "../../application/use-cases/companyUser/challenges/getChallengesUseCase";
import { acceptChallengeUseCase } from "../../application/use-cases/companyUser/challenges/acceptChallengeUseCase";
import { GetChallengeGameDataUseCase } from "../../application/use-cases/companyUser/challenges/getChallengeGameDataUseCase";
const lessonAssignmentRepository = new LessonAssignmentRepository(
  LessonAssignment,
);
const userRepository = new UserRepository(User);
const lessonRepository = new LessonRepository(Lesson);
const lessonResultRepository = new LessonResultRepository(LessonResult);
const challengeRepository = new CompanyChallengeRepository(CompanyChallenge);
const competitionRepository = new CompetitionRepository(Competition);
const GetAssignLessonUseCase = new getAssignLessonUseCase(
  lessonAssignmentRepository,
);
const GetMyLessonsUseCase = new getMyLessonsUseCase(
  lessonAssignmentRepository,
  userRepository,
  lessonRepository,
);
const SaveLessonResultUseCase = new saveLessonResultUseCase(
  lessonResultRepository,
  lessonAssignmentRepository,
);
const contestRepositoryInst = new ContestRepository(Contest);
const GetOpenContestsUseCase = new getOpenContestsUseCase(
  contestRepositoryInst,
  userRepository,
);
const JoinOrLeaveContestUseCase = new joinOrLeaveContestUseCase(
  contestRepositoryInst,
  userRepository,
);
const companyGroupRepository = new CompanyGroupRepository(CompanyGroup);
const contestRepositorySecond = new ContestRepository(Contest);
const GetGroupContestsUseCase = new getGroupConstestsUsecase(
  contestRepositoryInst,
  userRepository,
  companyGroupRepository,
  contestRepositorySecond,
);
const GetContestUseCase = new getContestUseCase(
  contestRepositoryInst,
  userRepository,
  contestRepositorySecond,
);
const GetContestDataUseCase = new getContestDataUseCase(
  contestRepositoryInst,
  userRepository,
  contestRepositorySecond,
);
const GetCompanyUsers = new getCompanyUsers(userRepository);

const MakeChallengeUseCase = new makeChallengeUseCase(
  challengeRepository,
  userRepository,
  competitionRepository,
  lessonRepository,
);
const GetSentChallengesUseCase = new getSentChallengesUseCase(
  challengeRepository,
  userRepository,
);
const GetAllChallengesUseCase = new getChallengesUseCase(
  challengeRepository,
  userRepository,
);
const AcceptChallengeUseCase = new acceptChallengeUseCase(
  challengeRepository,
  competitionRepository,
);
const GetGameDataChallengeUseCase = new GetChallengeGameDataUseCase(
  challengeRepository,
  competitionRepository,
  userRepository,
  lessonRepository,
);
export const injectChallengesController = new challengesController(
  GetCompanyUsers,
  MakeChallengeUseCase,
  GetSentChallengesUseCase,
  GetAllChallengesUseCase,
  AcceptChallengeUseCase,
  GetGameDataChallengeUseCase,
);
export const injectContestController = new ContestsController(
  GetOpenContestsUseCase,
  JoinOrLeaveContestUseCase,
  GetGroupContestsUseCase,
  GetContestUseCase,
  GetContestDataUseCase,
);
export const injectMyLessonsController = new MyLessonsController(
  GetMyLessonsUseCase,
  GetAssignLessonUseCase,
  SaveLessonResultUseCase,
);
