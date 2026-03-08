import { getUsersUseCase } from "../../application/use-cases/admin/getUsersUseCase";
import { userManageController } from "../controllers/admin/userManageController";
import { authRepository } from "../../infrastructure/db/repositories/auth/authRepository";
import { getCompanysUseCase } from "../../application/use-cases/admin/getCompanysUseCase";
import { CompanyRepository } from "../../infrastructure/db/repositories/company/CompanyRepository";
import { Company } from "../../infrastructure/db/models/company/companySchema";
import { companyManageController } from "../controllers/admin/companyManageController";
import { companyApproveRejectUsecase } from "../../application/use-cases/admin/companyApproveRejectUsecase";
import { User } from "../../infrastructure/db/models/user/userSchema";
import { UserRepository } from "../../infrastructure/db/repositories/user/UserRepository";
import { blockUserUseCase } from "../../application/use-cases/admin/blockUserUseCase";
import { EmailService } from "../../application/services/emailService";
import { LessonManageController } from "../controllers/admin/lessonManageController";
import { createLessonUseCase } from "../../application/use-cases/admin/lessonManagementUseCases/createLessonUseCase";
import { Lesson } from "../../infrastructure/db/models/admin/lessonSchema";
import { LessonRepository } from "../../infrastructure/db/repositories/admin/LessonRepository";
import { getLessonUseCase } from "../../application/use-cases/admin/lessonManagementUseCases/getLessonUseCase";
import { updateLessonUseCase } from "../../application/use-cases/admin/lessonManagementUseCases/updateLessonUseCase";
import { deleteLessonUseCase } from "../../application/use-cases/admin/lessonManagementUseCases/deleteLessonUseCase";
const authRepo = new authRepository();
const userRepository = new UserRepository(User);
const BlockUserUseCase = new blockUserUseCase(userRepository);
const companyRepository = new CompanyRepository(Company);
const GetUsers = new getUsersUseCase(authRepo);
const getCompanyUseCase = new getCompanysUseCase(companyRepository);
const emailService = new EmailService();
const CompanyApproveRejectUseCase = new companyApproveRejectUsecase(
  companyRepository,
  userRepository,
  emailService,
);
const lessonRepository = new LessonRepository(Lesson);
const lessonCreateUseCase = new createLessonUseCase(lessonRepository);
const GetLessonUseCase = new getLessonUseCase(lessonRepository);
const UpdateLessonUseCase = new updateLessonUseCase(lessonRepository);
const DeleteLessonUseCase = new deleteLessonUseCase(lessonRepository);
export const injectCompanyManageController = new companyManageController(
  getCompanyUseCase,
  CompanyApproveRejectUseCase,
);
export const injectUserManageController = new userManageController(
  GetUsers,
  BlockUserUseCase,
);
export const injectLessonManageController = new LessonManageController(
  lessonCreateUseCase,
  GetLessonUseCase,
  UpdateLessonUseCase,
  DeleteLessonUseCase,
);
