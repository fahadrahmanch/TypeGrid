import { CompanyUserController } from "../controllers/company-admin/users/CompanyUserController";
import { addUserUseCase } from "../../application/use-cases/companyAdmin/users/addUserUseCase";
import { User } from "../../infrastructure/db/models/user/userSchema";
import { BaseRepository } from "../../infrastructure/db/base/BaseRepository";
import { HashService } from "../../application/services/hashService";
import { TokenService } from "../../application/services/tokenService";
import { findUserUseCase } from "../../application/use-cases/user/findUserUseCase";
import { getCompanyUsersUseCase } from "../../application/use-cases/companyAdmin/users/getCompanyUsersUseCase";
import { deleteCompanyUserUseCase } from "../../application/use-cases/companyAdmin/users/deleteUserUseCase";
import { Lesson } from "../../infrastructure/db/models/admin/lessonSchema";
import {CompanyLessonManageController} from "../controllers/company-admin/CompanyLessonManageController";
import { CreateCompanyLessonUseCase } from "../../application/use-cases/companyAdmin/companyLessonUseCases/createCompanyLessonUseCase";
import { getCompanyLessonUseCase } from "../../application/use-cases/companyAdmin/companyLessonUseCases/getCompanyLessonUseCase";
import { getLessonUseCase } from "../../application/use-cases/companyAdmin/companyLessonUseCases/getLessonUseCase";
import { updateCompanyLessonUseCase } from "../../application/use-cases/companyAdmin/companyLessonUseCases/updateCompanyLessonUseCase";
import { deleteCompanyLessonUseCase } from "../../application/use-cases/companyAdmin/companyLessonUseCases/deleteCompanyLessonUseCase";
import { getAdminLessonsUseCase } from "../../application/use-cases/companyAdmin/companyLessonUseCases/getAdminLessonUseCase";
import { assignLessonUseCase } from "../../application/use-cases/companyAdmin/companyLessonUseCases/assignLessonUseCase";
import { LessonAssignment } from "../../infrastructure/db/models/company/lesssonAssigmentSchema";
import { CompanyGroupController } from "../controllers/company-admin/companyGroupController";
import { createCompanyGroupUseCase } from "../../application/use-cases/companyAdmin/companyGroupUseCase/createCompanyGroupUseCase";
import { CompanyGroup } from "../../infrastructure/db/models/company/companyGroupSchema";
import { getCompanyGroupsUseCase } from "../../application/use-cases/companyAdmin/companyGroupUseCase/getCompanyGroupsUseCase";
const baseRepoUser=new BaseRepository(User);
const tokenService=new TokenService();
const hashService = new HashService();
const FindUserUseCase=new findUserUseCase(baseRepoUser);
const AddUserUseCase=new addUserUseCase(baseRepoUser,hashService);
const GetCompanyUsersUseCase=new getCompanyUsersUseCase(baseRepoUser);
const DeleteCompanyUserUseCase=new deleteCompanyUserUseCase(baseRepoUser);


//lesson
const baseRepoLesson=new BaseRepository(Lesson);
const baseRepoAssignLesson=new BaseRepository(LessonAssignment);

const createCompanyLessonUseCase=new CreateCompanyLessonUseCase(baseRepoLesson,baseRepoUser);
const GetLessonUseCase=new getLessonUseCase(baseRepoLesson);
const GetCompanyLessonUseCase=new getCompanyLessonUseCase(baseRepoLesson,baseRepoUser);
const UpdateCompanyLessonUseCase=new updateCompanyLessonUseCase(baseRepoLesson);
const DeleteCompanyLessonUseCase=new deleteCompanyLessonUseCase(baseRepoLesson);
const GetAdminLessonsUseCase=new getAdminLessonsUseCase(baseRepoLesson);
const AssignLessonUseCase=new assignLessonUseCase(baseRepoAssignLesson,baseRepoUser,baseRepoLesson);
const baseRepoCompanyGroup=new BaseRepository(CompanyGroup)
const CreateCompanyGroupUseCase=new createCompanyGroupUseCase(baseRepoUser,baseRepoCompanyGroup)
const GetCompanygroupUseCase=new getCompanyGroupsUseCase(baseRepoUser,baseRepoCompanyGroup)
export const injectCompanyGroupController=new CompanyGroupController(CreateCompanyGroupUseCase,GetCompanygroupUseCase)
export const injectCompanyLessonManageController=new CompanyLessonManageController(createCompanyLessonUseCase,GetCompanyLessonUseCase,GetLessonUseCase,UpdateCompanyLessonUseCase,DeleteCompanyLessonUseCase,GetAdminLessonsUseCase,AssignLessonUseCase);

export const injectCompanyUserController=new CompanyUserController(AddUserUseCase,tokenService,FindUserUseCase,GetCompanyUsersUseCase,DeleteCompanyUserUseCase);