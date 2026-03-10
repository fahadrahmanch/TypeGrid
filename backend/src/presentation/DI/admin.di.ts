import { GetUsersUseCase } from "../../application/use-cases/admin/get-users.use-case";
import { UserManageController } from "../controllers/admin/user-manage.controller";
import { AuthRepository } from "../../infrastructure/db/repositories/auth/auth.repository";
import { GetCompaniesUseCase } from "../../application/use-cases/admin/get-companies.use-case";
import { CompanyRepository } from "../../infrastructure/db/repositories/company/company.repository";
import { Company } from "../../infrastructure/db/models/company/company.schema";
import { CompanyManageController } from "../controllers/admin/company-manage.controller";
import { CompanyApproveRejectUseCase } from "../../application/use-cases/admin/company-approve-reject.use-case";
import { User } from "../../infrastructure/db/models/user/user.schema";
import { UserRepository } from "../../infrastructure/db/repositories/user/user.repository";
import { BlockUserUseCase } from "../../application/use-cases/admin/block-user.use-case";
import { EmailService } from "../../infrastructure/services/email.service";
import { LessonManageController } from "../controllers/admin/lesson-manage.controller";
import { CreateLessonUseCase } from "../../application/use-cases/admin/lesson-management/create-lesson.use-case";
import { Lesson } from "../../infrastructure/db/models/admin/lesson.schema";
import { LessonRepository } from "../../infrastructure/db/repositories/admin/lesson.repository";
import { GetLessonUseCase } from "../../application/use-cases/admin/lesson-management/get-lesson.use-case";
import { UpdateLessonUseCase } from "../../application/use-cases/admin/lesson-management/update-lesson.use-case";
import { DeleteLessonUseCase } from "../../application/use-cases/admin/lesson-management/delete-lesson.use-case";
import { GetLessonsUseCase } from "../../application/use-cases/admin/lesson-management/get-lessons.use-case";
const authRepo = new AuthRepository();
const userRepository = new UserRepository(User);
const blockUserUseCase = new BlockUserUseCase(userRepository);
const companyRepository = new CompanyRepository(Company);
const getUsersUseCase = new GetUsersUseCase(authRepo);
const getCompaniesUseCase = new GetCompaniesUseCase(companyRepository);
const emailService = new EmailService();
const companyApproveRejectUseCase = new CompanyApproveRejectUseCase(
  companyRepository,
  userRepository,
  emailService,
);
const lessonRepository = new LessonRepository(Lesson);
const createLessonUseCase = new CreateLessonUseCase(lessonRepository);
const getLessonUseCase = new GetLessonUseCase(lessonRepository);
const updateLessonUseCase = new UpdateLessonUseCase(lessonRepository);
const deleteLessonUseCase = new DeleteLessonUseCase(lessonRepository);
const getLessonsUseCase = new GetLessonsUseCase(lessonRepository);
export const injectCompanyManageController = new CompanyManageController(
  getCompaniesUseCase,
  companyApproveRejectUseCase,
);
export const injectUserManageController = new UserManageController(
  getUsersUseCase,
  blockUserUseCase,
);
export const injectLessonManageController = new LessonManageController(
  createLessonUseCase,
  getLessonUseCase,
  updateLessonUseCase,
  deleteLessonUseCase,
  getLessonsUseCase,
);
