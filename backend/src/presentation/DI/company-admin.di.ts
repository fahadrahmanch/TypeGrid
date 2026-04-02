import { CompanyUserController } from "../controllers/company-admin/users/company-user.controller";
import { AddUserUseCase } from "../../application/use-cases/company-admin/users/add-user.use-case";
import { User } from "../../infrastructure/db/models/user/user.schema";
import { UserRepository } from "../../infrastructure/db/repositories/user/user.repository";
import { HashService } from "../../application/services/hash.service";
import { FindUserUseCase } from "../../application/use-cases/user/find-user.use-case";
import { GetCompanyUsersUseCase } from "../../application/use-cases/company-admin/users/get-company-users.use-case";
import { DeleteUserUseCase } from "../../application/use-cases/company-admin/users/delete-user.use-case";
import { Lesson } from "../../infrastructure/db/models/admin/lesson.schema";
import { LessonRepository } from "../../infrastructure/db/repositories/admin/lesson.repository";
import { CompanyLessonManageController } from "../controllers/company-admin/company-lesson-manage.controller";
import { CreateCompanyLessonUseCase } from "../../application/use-cases/company-admin/company-lesson/create-company-lesson.use-case";
import { GetCompanyLessonsUseCase } from "../../application/use-cases/company-admin/company-lesson/get-company-lesson.use-case";
import { GetLessonUseCase } from "../../application/use-cases/company-admin/company-lesson/get-lesson.use-case";
import { UpdateCompanyLessonUseCase } from "../../application/use-cases/company-admin/company-lesson/update-company-lesson.use-case";
import { DeleteCompanyLessonUseCase } from "../../application/use-cases/company-admin/company-lesson/delete-company-lesson.use-case";
import { GetAdminLessonUseCase } from "../../application/use-cases/company-admin/company-lesson/get-admin-lesson.use-case";
import { AssignLessonUseCase } from "../../application/use-cases/company-admin/company-lesson/assign-lesson.use-case";
import { LessonAssignment } from "../../infrastructure/db/models/company/lesson-assignment.schema";
import { LessonAssignmentRepository } from "../../infrastructure/db/repositories/company/lesson-assignment.repository";
import { CompanyGroupController } from "../controllers/company-admin/company-group.controller";
import { CreateCompanyGroupUseCase } from "../../application/use-cases/company-admin/company-group/create-company-group.use-case";
import { CompanyGroup } from "../../infrastructure/db/models/company/company-group.schema";
import { CompanyGroupRepositroy } from "../../infrastructure/db/repositories/company/company-group.repository";
import { GetCompanyGroupsUseCase } from "../../application/use-cases/company-admin/company-group/get-company-groups.use-case";
import { CompanyContestManagementController } from "../controllers/company-admin/company-contest-management.controller";
import { CreateCompanyContestUseCase } from "../../application/use-cases/company-admin/company-contest/create-company-contest.use-case";
import { Contest } from "../../infrastructure/db/models/company/company-contest.schema";
import { ContestRepository } from "../../infrastructure/db/repositories/company/contest.repository";
import { GetCompanyContestsUseCase } from "../../application/use-cases/company-admin/company-contest/get-company-contests.use-case";
import { UpdateCompanyContestStatusUseCase } from "../../application/use-cases/company-admin/company-contest/update-company-contest-status.use-case";
import { GetContestParticipantsUseCase } from "../../application/use-cases/company-admin/company-contest/get-contest-participants.use-case";
import { GetContestUseCase } from "../../application/use-cases/company-admin/company-contest/get-contest.use-case";
import { UpdateContestUseCase } from "../../application/use-cases/company-admin/company-contest/update-contest.use-case";
import { DeleteContestUseCase } from "../../application/use-cases/company-admin/company-contest/delete-company-contest.use-case";
import { GetContestResultUseCase } from "../../application/use-cases/company-admin/company-contest/get-contest-result-use-case";
import { ResultRepository } from "../../infrastructure/db/repositories/result.repository";
import { Result } from "../../infrastructure/db/models/user/result.schema";
import { AuthRepository } from "../../infrastructure/db/repositories/auth/auth.repository";
const userRepository = new UserRepository(User);
const hashService = new HashService();
const authRepository = new AuthRepository();
const findUserUseCaseInstance = new FindUserUseCase(authRepository);
const addUserUseCaseInstance = new AddUserUseCase(authRepository, hashService);
const getCompanyUsersUseCaseInstance = new GetCompanyUsersUseCase(
  userRepository,
);
const deleteUserUseCaseInstance = new DeleteUserUseCase(userRepository);

//lesson
const lessonRepository = new LessonRepository(Lesson);
const lessonAssignmentRepository = new LessonAssignmentRepository(
  LessonAssignment,
);

const createCompanyLessonUseCaseInstance = new CreateCompanyLessonUseCase(
  lessonRepository,
  userRepository,
);
const getLessonUseCaseInstance = new GetLessonUseCase(lessonRepository);
const getCompanyLessonUseCaseInstance = new GetCompanyLessonsUseCase(
  lessonRepository,
  userRepository,
);
const updateCompanyLessonUseCaseInstance = new UpdateCompanyLessonUseCase(
  lessonRepository,
);
const deleteCompanyLessonUseCaseInstance = new DeleteCompanyLessonUseCase(
  lessonRepository,
);
const getAdminLessonsUseCaseInstance = new GetAdminLessonUseCase(
  lessonRepository,
);
const assignLessonUseCaseInstance = new AssignLessonUseCase(
  lessonAssignmentRepository,
  userRepository,
);
const companyGroupRepository = new CompanyGroupRepositroy(CompanyGroup);
const contestRepository = new ContestRepository(Contest);
const createCompanyGroupUseCaseInstance = new CreateCompanyGroupUseCase(
  userRepository,
  companyGroupRepository,
);
const getCompanygroupUseCaseInstance = new GetCompanyGroupsUseCase(
  userRepository,
  companyGroupRepository,
);
const getCompanyContestsUseCaseInstance = new GetCompanyContestsUseCase(
  contestRepository,
  userRepository,
);
const createCompanyContestUseCaseInstance = new CreateCompanyContestUseCase(
  userRepository,
  companyGroupRepository,
  contestRepository,
  lessonRepository,
);
const updateCompanyContestStatusUseCaseInstance =
  new UpdateCompanyContestStatusUseCase(contestRepository);
const getContestParticipantsUseCaseInstance = new GetContestParticipantsUseCase(
  contestRepository,
  userRepository,
);
const getCompanyContestUseInstance = new GetContestUseCase(
  contestRepository,
  userRepository,
);
const updateContestUseCaseInstance = new UpdateContestUseCase(
  contestRepository,
);
const deleteContestUseCaseInstance = new DeleteContestUseCase(
  contestRepository,
);
const resultRepository = new ResultRepository(Result);
const getContestResultUseCaseInstance = new GetContestResultUseCase(
  contestRepository,
  resultRepository,
  userRepository,
);

export const injectCompanyContestManagementController =
  new CompanyContestManagementController(
    createCompanyContestUseCaseInstance,
    getCompanyContestsUseCaseInstance,
    updateCompanyContestStatusUseCaseInstance,
    getContestParticipantsUseCaseInstance,
    getCompanyContestUseInstance,
    updateContestUseCaseInstance,
    deleteContestUseCaseInstance,
    getContestResultUseCaseInstance,
  );
export const injectCompanyGroupController = new CompanyGroupController(
  createCompanyGroupUseCaseInstance,
  getCompanygroupUseCaseInstance,
);
export const injectCompanyLessonManageController =
  new CompanyLessonManageController(
    createCompanyLessonUseCaseInstance,
    getCompanyLessonUseCaseInstance,
    getLessonUseCaseInstance,
    updateCompanyLessonUseCaseInstance,
    deleteCompanyLessonUseCaseInstance,
    getAdminLessonsUseCaseInstance,
    assignLessonUseCaseInstance,
  );
export const injectCompanyUserController = new CompanyUserController(
  addUserUseCaseInstance,
  findUserUseCaseInstance,
  getCompanyUsersUseCaseInstance,
  deleteUserUseCaseInstance,
);
