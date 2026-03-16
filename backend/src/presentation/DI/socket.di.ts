import { GroupSocketController } from "../../infrastructure/socket/group-socket.controller";
import { RemoveMemberGroupPlayGroupUseCase } from "../../application/use-cases/user/group-play/remove-member-group-play-group.use-case";
import { Group } from "../../infrastructure/db/models/user/group.schema";
import { User } from "../../infrastructure/db/models/user/user.schema";
import { UserRepository } from "../../infrastructure/db/repositories/user/user.repository";
import { ValidateGroupPlayMemberUseCase } from "../../application/use-cases/user/group-play/validate-group-play-member.use-case";
import { Competition } from "../../infrastructure/db/models/user/competition.schema";
import { CompetitionRepository } from "../../infrastructure/db/repositories/user/competition.repository";
import { FinishGroupPlayUseCase } from "../../application/use-cases/user/group-play/finish-group-play.use-case";
import { Result } from "../../infrastructure/db/models/user/result.schema";
import { ResultRepository } from "../../infrastructure/db/repositories/user/result.repository";
import { QuickSocketController } from "../../infrastructure/socket/quick-socket.controller";
import { GetJoinMemberUseCase } from "../../application/use-cases/user/quick-play/get-join-member.use-case";
import { FinishQuickPlayUseCase } from "../../application/use-cases/user/quick-play/finish-quick-play.use-case";
import { ContestSocketController } from "../../infrastructure/socket/contest-socket.controller";
import { FinishContestUseCase } from "../../application/use-cases/company-user/contest/finish-contest.use-case";
import { GroupRepository } from "../../infrastructure/db/repositories/user/group.repository";
import { Contest } from "../../infrastructure/db/models/company/company-contest.schema";
import { ContestRepository } from "../../infrastructure/db/repositories/company/contest.repository";
import { ChallengeSocketController } from "../../infrastructure/socket/challenge-socket.controller";
import { StartChallengeUseCase } from "../../application/use-cases/company-user/challenges/start-challenge.use-case";
import { CompanyChallenge } from "../../infrastructure/db/models/company/company-challenge.schema";
import { CompanyChallengeRepository } from "../../infrastructure/db/repositories/company/company-challenge.repository";
import { LeaveQuickPlayUseCase } from "../../application/use-cases/user/quick-play/leave-quick-play.use-case";
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
const finishGroupPlayUseCaseInstance = new FinishGroupPlayUseCase(
  competitionRepository,
  groupRepository,
  resultRepository,
);
const getJoinMemberUseCaseInstance = new GetJoinMemberUseCase(
  competitionRepository,
  userRepository,
);
const finishQuickPlayUseCaseInstance = new FinishQuickPlayUseCase(
  competitionRepository,
  resultRepository,
);
const leaveQuickPlayUseCaseInstance = new LeaveQuickPlayUseCase(
  competitionRepository,
  userRepository,
);
const finishContestUseCaseInstance = new FinishContestUseCase(
  contestRepository,
  resultRepository,
);
const startChallengeUseCaseInstance = new StartChallengeUseCase(
  challengeRepository,
  competitionRepository,
);
export const injectChallengeSocketController = new ChallengeSocketController(
  startChallengeUseCaseInstance,
);
export const injectContestSocketController = new ContestSocketController(
  finishContestUseCaseInstance,
);
export const injectQuickSocketController = new QuickSocketController(
  getJoinMemberUseCaseInstance,
  finishQuickPlayUseCaseInstance,
  leaveQuickPlayUseCaseInstance,
);
export const injectGroupSocketController = new GroupSocketController(
  removeMemberUseCase,
  validateGroupPlayMemberUseCase,
  finishGroupPlayUseCaseInstance,
);
