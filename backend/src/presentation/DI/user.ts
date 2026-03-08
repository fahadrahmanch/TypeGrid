import { companyRequestController } from "../controllers/user/companyRequestController";
import { companyRequestUseCase } from "../../application/use-cases/user/companyRequestUseCase";
import { CompanyRepository } from "../../infrastructure/db/repositories/company/CompanyRepository";
import { UserRepository } from "../../infrastructure/db/repositories/user/UserRepository";
import { LessonRepository } from "../../infrastructure/db/repositories/admin/LessonRepository";
import { CompetitionRepository } from "../../infrastructure/db/repositories/user/CompetitionRepository";
import { GroupRepository } from "../../infrastructure/db/repositories/user/GroupRepository";
import { ResultRepository } from "../../infrastructure/db/repositories/user/ResultRepository";
import { Company } from "../../infrastructure/db/models/company/companySchema";
import { userController } from "../controllers/user/userController";
import { TokenService } from "../../application/services/tokenService";
import { findUserUseCase } from "../../application/use-cases/user/findUserUseCase";
import { User } from "../../infrastructure/db/models/user/userSchema";
import { updateUserUseCase } from "../../application/use-cases/user/updateUserUseCase";
import { getCompanyUseCase } from "../../application/use-cases/user/getCompanyUseCase";
import { companyReApplyUseCase } from "../../application/use-cases/user/companyReApplyUseCase";
import { typingPracticeController } from "../controllers/user/typingPracticeController";
import { getPracticeTypingContentUseCase } from "../../application/use-cases/user/TypingPractice/getPracticeTypingContentUseCase";
import { Lesson } from "../../infrastructure/db/models/admin/lessonSchema";
import { groupPlayController } from "../controllers/user/groupPlayController";
import { CreateGroupPlayRoomUseCase } from "../../application/use-cases/user/group-play/CreateGroupPlayGroupUseCase";
import { Group } from "../../infrastructure/db/models/user/groupSchema";
import { GetGroupPlayGroupUseCase } from "../../application/use-cases/user/group-play/GetGroupPlayGroupUseCase";
import { editGroupUseCase } from "../../application/use-cases/user/group-play/editGroupUseCase";
import { joinGroupPlayGroupUseCase } from "../../application/use-cases/user/group-play/JoinGroupPlayGroupUseCase";
import { RemoveMemberGroupPlayGroupUseCase } from "../../application/use-cases/user/group-play/RemoveMemberGroupPlayGroupUseCase";
import { StartGameGroupPlayGroupUseCase } from "../../application/use-cases/user/group-play/StartGameGroupPlayGroupUseCase";
import { Competition } from "../../infrastructure/db/models/user/competitionSchema";
import { ChangeGroupStatusUseCase } from "../../application/use-cases/user/group-play/ChangeGroupStatusUseCase";
import { SoloPlayController } from "../controllers/user/soloPlayController";
import { CreateSoloPlayUseCase } from "../../application/use-cases/user/Solo-play/createSoloPlayUseCase";
import { SoloPlayResultUseCase } from "../../application/use-cases/user/Solo-play/soloPlayResultUsecase";
import { Result } from "../../infrastructure/db/models/user/resultSchema";
import { newGroupPlayUseCase } from "../../application/use-cases/user/group-play/newGroupPlayUseCase";
import { QuickPlayController } from "../controllers/user/quickPlayController";
import { startQuickPlayUseCase } from "../../application/use-cases/user/quick-play/startQuickPlayUseCase";
import { changeStatusUseCase } from "../../application/use-cases/user/quick-play/changeStatusUseCase";
import { ChangePasswordUseCase } from "../../application/use-cases/user/changePasswordUseCase";
import { HashService } from "../../application/services/hashService";

const userRepository = new UserRepository(User);
const companyRepository = new CompanyRepository(Company);
const lessonRepository = new LessonRepository(Lesson);
const CompanyRequestUseCase = new companyRequestUseCase(
  companyRepository,
  userRepository,
);
const tokenService = new TokenService();
const FindUserUseCase = new findUserUseCase(userRepository);
const GetCompanyUseCase = new getCompanyUseCase(companyRepository);
const CompanyReApplyUseCase = new companyReApplyUseCase(
  companyRepository,
  userRepository,
);
const UpdateUserUseCase = new updateUserUseCase(userRepository);
const hashService = new HashService();
const changePasswordUseCase = new ChangePasswordUseCase(
  userRepository,
  hashService,
);
// typing practice dependencies
const GetPracticeTypingContentUseCase = new getPracticeTypingContentUseCase(
  lessonRepository,
);

// group play
const groupRepository = new GroupRepository(Group);
const competitionRepository = new CompetitionRepository(Competition);
const createGroupPlayRoomUseCase = new CreateGroupPlayRoomUseCase(
  groupRepository,
  userRepository,
);
const getGroupPlayGroupUseCaseInstance = new GetGroupPlayGroupUseCase(
  groupRepository,
  userRepository,
);
const EditGroupUseCase = new editGroupUseCase(groupRepository);
const JoinGroupPlayGroupUseCase = new joinGroupPlayGroupUseCase(
  groupRepository,
  userRepository,
);
const removeMemberGroupPlayGroupUseCase = new RemoveMemberGroupPlayGroupUseCase(
  groupRepository,
  userRepository,
);
const startGameGroupPlayGroupUseCase = new StartGameGroupPlayGroupUseCase(
  competitionRepository,
  groupRepository,
  lessonRepository,
  userRepository,
);
const changeGroupStatusUseCase = new ChangeGroupStatusUseCase(groupRepository);
const newGroupPlayUsecase = new newGroupPlayUseCase(
  groupRepository,
  userRepository,
  competitionRepository,
  lessonRepository,
);

// solo play
const resultRepository = new ResultRepository(Result);
const createSoloPlayUseCase = new CreateSoloPlayUseCase(
  lessonRepository,
  competitionRepository,
  userRepository,
);
const soloPlayResultUseCase = new SoloPlayResultUseCase(
  competitionRepository,
  userRepository,
  resultRepository,
);
export const injectSoloPlayController = new SoloPlayController(
  createSoloPlayUseCase,
  soloPlayResultUseCase,
);

// quick play
const StartQuickPlayUseCase = new startQuickPlayUseCase(
  competitionRepository,
  userRepository,
  lessonRepository,
);
const ChangeStatusUseCase = new changeStatusUseCase(competitionRepository);
export const injectQuickPlayController = new QuickPlayController(
  StartQuickPlayUseCase,
  ChangeStatusUseCase,
);

export const injectGroupPlayController = new groupPlayController(
  createGroupPlayRoomUseCase,
  getGroupPlayGroupUseCaseInstance,
  EditGroupUseCase,
  JoinGroupPlayGroupUseCase,
  removeMemberGroupPlayGroupUseCase,
  startGameGroupPlayGroupUseCase,
  changeGroupStatusUseCase,
  newGroupPlayUsecase,
);

export const injectTypingPracticeController = new typingPracticeController(
  GetPracticeTypingContentUseCase,
);
export const injectCompanyRequestController = new companyRequestController(
  CompanyRequestUseCase,
  tokenService,
  FindUserUseCase,
  GetCompanyUseCase,
  CompanyReApplyUseCase,
);
export const injectUserController = new userController(
  tokenService,
  FindUserUseCase,
  UpdateUserUseCase,
  changePasswordUseCase,
);
