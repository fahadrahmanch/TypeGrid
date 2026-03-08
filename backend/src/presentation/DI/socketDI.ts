import { GroupSocketController } from "../../infrastructure/socket/groupSocketController";
import { RemoveMemberGroupPlayGroupUseCase } from "../../application/use-cases/user/group-play/RemoveMemberGroupPlayGroupUseCase";
import { Group } from "../../infrastructure/db/models/user/groupSchema";
import { User } from "../../infrastructure/db/models/user/userSchema";
import { UserRepository } from "../../infrastructure/db/repositories/user/UserRepository";
import { ValidateGroupPlayMemberUseCase } from "../../application/use-cases/user/group-play/ValidateGroupPlayMemberUseCase";
import { Competition } from "../../infrastructure/db/models/user/competitionSchema";
import { CompetitionRepository } from "../../infrastructure/db/repositories/user/CompetitionRepository";
import { finishGroupPlayUseCase } from "../../application/use-cases/user/group-play/finishGroupPlayUseCase";
import { Result } from "../../infrastructure/db/models/user/resultSchema";
import { ResultRepository } from "../../infrastructure/db/repositories/user/ResultRepository";
import { quickSocketController } from "../../infrastructure/socket/quickSocketController";
import { getJoinMemberUseCase } from "../../application/use-cases/user/quick-play/getJoinMemberUseCase";
import { finishQuickPlayResultUseCase } from "../../application/use-cases/user/quick-play/finishQuickPlayUseCase";
import { contestSocketController } from "../../infrastructure/socket/contestSocketController";
import { finishContestUseCase } from "../../application/use-cases/companyUser/finishContestUseCase";
import { GroupRepository } from "../../infrastructure/db/repositories/user/GroupRepository";
import { Contest } from "../../infrastructure/db/models/company/companyContestSchema";
import { ContestRepository } from "../../infrastructure/db/repositories/company/ContestRepository";
import { challengeSocketController } from "../../infrastructure/socket/challengeSocketController";
import { startChallengeUseCase } from "../../application/use-cases/companyUser/challenges/startChallengeUseCase";
import { CompanyChallenge } from "../../infrastructure/db/models/company/companyChallengeSchema";
import { CompanyChallengeRepository } from "../../infrastructure/db/repositories/company/CompanyChallengeRepository";

const competitionRepository = new CompetitionRepository(Competition);
const groupRepository = new GroupRepository(Group);
const userRepository = new UserRepository(User);
const resultRepository = new ResultRepository(Result);
const contestRepository = new ContestRepository(Contest);
const challengeRepository = new CompanyChallengeRepository(CompanyChallenge);
const removeMemberUseCase = new RemoveMemberGroupPlayGroupUseCase(
  groupRepository,
  userRepository,
);
const validateGroupPlayMemberUseCase = new ValidateGroupPlayMemberUseCase(
  groupRepository,
  competitionRepository,
);
const FinishGroupPlayUseCase = new finishGroupPlayUseCase(
  competitionRepository,
  groupRepository,
  resultRepository,
);
const getJoinMemberUseCaseInstance = new getJoinMemberUseCase(
  competitionRepository,
  userRepository,
);
const FinishQuickPlayResultUseCase = new finishQuickPlayResultUseCase(
  competitionRepository,
  resultRepository,
);
const FinishContestUseCase = new finishContestUseCase(
  contestRepository,
  resultRepository,
);
const StartChallengeUseCase = new startChallengeUseCase(
  challengeRepository,
  competitionRepository,
);
export const injectChallengeSocketController = new challengeSocketController(
  StartChallengeUseCase,
);
export const injectContestSocketController = new contestSocketController(
  FinishContestUseCase,
);
export const injectQuickSocketController = new quickSocketController(
  getJoinMemberUseCaseInstance,
  FinishQuickPlayResultUseCase,
);
export const injectGroupSocketController = new GroupSocketController(
  removeMemberUseCase,
  validateGroupPlayMemberUseCase,
  FinishGroupPlayUseCase,
);
