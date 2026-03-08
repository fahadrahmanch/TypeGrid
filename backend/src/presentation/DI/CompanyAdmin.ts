import { CompanyUserController } from "../controllers/company-admin/users/CompanyUserController";
import { addUserUseCase } from "../../application/use-cases/companyAdmin/users/addUserUseCase";
import { User } from "../../infrastructure/db/models/user/userSchema";
import { UserRepository } from "../../infrastructure/db/repositories/user/UserRepository";
import { HashService } from "../../application/services/hashService";
import { TokenService } from "../../application/services/tokenService";
import { findUserUseCase } from "../../application/use-cases/user/findUserUseCase";
import { getCompanyUsersUseCase } from "../../application/use-cases/companyAdmin/users/getCompanyUsersUseCase";
import { deleteCompanyUserUseCase } from "../../application/use-cases/companyAdmin/users/deleteUserUseCase";
import { Lesson } from "../../infrastructure/db/models/admin/lessonSchema";
import { LessonRepository } from "../../infrastructure/db/repositories/admin/LessonRepository";
import { CompanyLessonManageController } from "../controllers/company-admin/CompanyLessonManageController";
import { CreateCompanyLessonUseCase } from "../../application/use-cases/companyAdmin/companyLessonUseCases/createCompanyLessonUseCase";
import { getCompanyLessonUseCase } from "../../application/use-cases/companyAdmin/companyLessonUseCases/getCompanyLessonUseCase";
import { getLessonUseCase } from "../../application/use-cases/companyAdmin/companyLessonUseCases/getLessonUseCase";
import { updateCompanyLessonUseCase } from "../../application/use-cases/companyAdmin/companyLessonUseCases/updateCompanyLessonUseCase";
import { deleteCompanyLessonUseCase } from "../../application/use-cases/companyAdmin/companyLessonUseCases/deleteCompanyLessonUseCase";
import { getAdminLessonsUseCase } from "../../application/use-cases/companyAdmin/companyLessonUseCases/getAdminLessonUseCase";
import { assignLessonUseCase } from "../../application/use-cases/companyAdmin/companyLessonUseCases/assignLessonUseCase";
import { LessonAssignment } from "../../infrastructure/db/models/company/lesssonAssigmentSchema";
import { LessonAssignmentRepository } from "../../infrastructure/db/repositories/company/LessonAssignmentRepository";
import { CompanyGroupController } from "../controllers/company-admin/companyGroupController";
import { createCompanyGroupUseCase } from "../../application/use-cases/companyAdmin/companyGroupUseCase/createCompanyGroupUseCase";
import { CompanyGroup } from "../../infrastructure/db/models/company/companyGroupSchema";
import { CompanyGroupRepository } from "../../infrastructure/db/repositories/company/CompanyGroupRepository";
import { getCompanyGroupsUseCase } from "../../application/use-cases/companyAdmin/companyGroupUseCase/getCompanyGroupsUseCase";
import { CompanyContestManagementController } from "../controllers/company-admin/companyContestManagementController";
import { createCompanyContestUseCase } from "../../application/use-cases/companyAdmin/companyContestUseCase/createCompanyContestUseCase";
import { Contest } from "../../infrastructure/db/models/company/companyContestSchema";
import { ContestRepository } from "../../infrastructure/db/repositories/company/ContestRepository";
import { getCompanyContestsUseCase } from "../../application/use-cases/companyAdmin/companyContestUseCase/getContestsUseCase";
import { updateCompanyContestStatusUseCase } from "../../application/use-cases/companyAdmin/companyContestUseCase/updateCompanyContestStatusUseCase";
import { getContestParticipantsUseCase } from "../../application/use-cases/companyAdmin/companyContestUseCase/getContestParticipantsUseCase";
import { getContestUseCase } from "../../application/use-cases/companyAdmin/companyContestUseCase/getContestUseCase";
import { updateContestUse } from "../../application/use-cases/companyAdmin/companyContestUseCase/updateContestUseCase";
import { deleteCompanyContestUse } from "../../application/use-cases/companyAdmin/companyContestUseCase/deleteCompanyContestUseCase";
const userRepository = new UserRepository(User);
const tokenService = new TokenService();
const hashService = new HashService();
const FindUserUseCase = new findUserUseCase(userRepository);
const AddUserUseCase = new addUserUseCase(userRepository, hashService);
const GetCompanyUsersUseCase = new getCompanyUsersUseCase(userRepository);
const DeleteCompanyUserUseCase = new deleteCompanyUserUseCase(userRepository);

//lesson
const lessonRepository = new LessonRepository(Lesson);
const lessonAssignmentRepository = new LessonAssignmentRepository(
  LessonAssignment,
);

const createCompanyLessonUseCase = new CreateCompanyLessonUseCase(
  lessonRepository,
  userRepository,
);
const GetLessonUseCase = new getLessonUseCase(lessonRepository);
const GetCompanyLessonUseCase = new getCompanyLessonUseCase(
  lessonRepository,
  userRepository,
);
const UpdateCompanyLessonUseCase = new updateCompanyLessonUseCase(
  lessonRepository,
);
const DeleteCompanyLessonUseCase = new deleteCompanyLessonUseCase(
  lessonRepository,
);
const GetAdminLessonsUseCase = new getAdminLessonsUseCase(lessonRepository);
const AssignLessonUseCase = new assignLessonUseCase(
  lessonAssignmentRepository,
  userRepository,
  lessonRepository,
);
const companyGroupRepository = new CompanyGroupRepository(CompanyGroup);
const contestRepository = new ContestRepository(Contest);
const CreateCompanyGroupUseCase = new createCompanyGroupUseCase(
  userRepository,
  companyGroupRepository,
);
const GetCompanygroupUseCase = new getCompanyGroupsUseCase(
  userRepository,
  companyGroupRepository,
);
const GetCompanyContestsUseCase = new getCompanyContestsUseCase(
  contestRepository,
  userRepository,
);
const CreateCompanyContestUseCase = new createCompanyContestUseCase(
  userRepository,
  companyGroupRepository,
  contestRepository,
  lessonRepository,
);
const UpdateCompanyContestStatusUseCase = new updateCompanyContestStatusUseCase(
  contestRepository,
);
const GetContestParticipantsUseCase = new getContestParticipantsUseCase(
  contestRepository,
  userRepository,
);
const GetCompanyContestUse = new getContestUseCase(
  contestRepository,
  userRepository,
);
const UpdateContestUseCase = new updateContestUse(contestRepository);
const DeleteContestUseCase = new deleteCompanyContestUse(contestRepository);
export const injectCompanyContestManagementController =
  new CompanyContestManagementController(
    CreateCompanyContestUseCase,
    GetCompanyContestsUseCase,
    UpdateCompanyContestStatusUseCase,
    GetContestParticipantsUseCase,
    GetCompanyContestUse,
    UpdateContestUseCase,
    DeleteContestUseCase,
  );
export const injectCompanyGroupController = new CompanyGroupController(
  CreateCompanyGroupUseCase,
  GetCompanygroupUseCase,
);
export const injectCompanyLessonManageController =
  new CompanyLessonManageController(
    createCompanyLessonUseCase,
    GetCompanyLessonUseCase,
    GetLessonUseCase,
    UpdateCompanyLessonUseCase,
    DeleteCompanyLessonUseCase,
    GetAdminLessonsUseCase,
    AssignLessonUseCase,
  );
export const injectCompanyUserController = new CompanyUserController(
  AddUserUseCase,
  tokenService,
  FindUserUseCase,
  GetCompanyUsersUseCase,
  DeleteCompanyUserUseCase,
);
