import { companyRequestController } from "../controllers/user/companyRequestController";
import { companyRequestUseCase } from "../../application/use-cases/user/companyRequestUseCase";
import { BaseRepository } from "../../infrastructure/db/base/BaseRepository";
import { Company } from "../../infrastructure/db/models/company/companySchema";
import { userController } from "../controllers/user/userController";
import { TokenService } from "../../application/services/tokenService";
import { findUserUseCase } from "../../application/use-cases/user/findUserUseCase";
import { User } from "../../infrastructure/db/models/user/userSchema";
import { AuthUserEntity } from "../../domain/entities";
import { updateUserUseCase } from "../../application/use-cases/user/updateUserUseCase";
import { getCompanyUseCase } from "../../application/use-cases/user/getCompanyUseCase";
import { companyReApplyUseCase } from "../../application/use-cases/user/companyReApplyUseCase";
import { typingPracticeController } from "../controllers/user/typingPracticeController";    
import { getPracticeTypingContentUseCase } from "../../application/use-cases/user/TypingPractice/getPracticeTypingContentUseCase";
import { Lesson } from "../../infrastructure/db/models/admin/lessonSchema";
import { groupPlayController } from "../controllers/user/groupPlayController";
import { CreateGroupPlayRoomUseCase } from "../../application/use-cases/user/group-play/CreateGroupPlayGroupUseCase";
import { Group } from "../../infrastructure/db/models/user/groupSchema";
import { getGroupPlayGroupUseCase } from "../../application/use-cases/user/group-play/GetGroupPlayGroupUseCase";
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
const baseRepoCompany=new BaseRepository(Company);
const baseRepoUser=new BaseRepository<AuthUserEntity>(User);
const CompanyRequestUseCase=new companyRequestUseCase(baseRepoCompany,baseRepoUser);
const tokenService=new TokenService();
const FindUserUseCase=new findUserUseCase(baseRepoUser);
const GetCompanyUseCase=new getCompanyUseCase(baseRepoCompany);
const CompanyReApplyUseCase=new companyReApplyUseCase(baseRepoCompany,baseRepoUser);
const UpdateUserUseCase=new updateUserUseCase(baseRepoUser);
const hashService=new HashService();
const changePasswordUseCase=new ChangePasswordUseCase(baseRepoUser,hashService);
// typing practice  dependencies
const baseRepoLesson=new BaseRepository(Lesson);
const GetPracticeTypingContentUseCase=new getPracticeTypingContentUseCase(baseRepoLesson);

// group play
const baseRepoGroup=new BaseRepository(Group);
const baseRepoCompetion=new BaseRepository(Competition);
const createGroupPlayRoomUseCase =new CreateGroupPlayRoomUseCase(baseRepoGroup,baseRepoUser);
const GetGroupPlayGroupUseCase=new getGroupPlayGroupUseCase(baseRepoGroup,baseRepoUser);
const EditGroupUseCase=new editGroupUseCase(baseRepoGroup);
const JoinGroupPlayGroupUseCase=new joinGroupPlayGroupUseCase(baseRepoGroup,baseRepoUser);
const removeMemberGroupPlayGroupUseCase=new RemoveMemberGroupPlayGroupUseCase(baseRepoGroup,baseRepoUser);
const startGameGroupPlayGroupUseCase=new StartGameGroupPlayGroupUseCase(baseRepoCompetion,baseRepoGroup,baseRepoLesson,baseRepoUser);
const changeGroupStatusUseCase=new ChangeGroupStatusUseCase(baseRepoGroup);
const newGroupPlayUsecase=new newGroupPlayUseCase(baseRepoGroup,baseRepoUser,baseRepoCompetion,baseRepoLesson);

// solo play
const baseRepoResult=new BaseRepository(Result);
const createSoloPlayUseCase=new CreateSoloPlayUseCase(baseRepoLesson,baseRepoCompetion,baseRepoUser);
const soloPlayResultUseCase=new SoloPlayResultUseCase(baseRepoCompetion,baseRepoUser,baseRepoResult);
export const injectSoloPlayController=new SoloPlayController(createSoloPlayUseCase,soloPlayResultUseCase);

//quick play
const StartQuickPlayUseCase=new startQuickPlayUseCase(baseRepoCompetion,baseRepoUser,baseRepoLesson);
const ChangeStatusUseCase=new changeStatusUseCase(baseRepoCompetion);
export const injectQuickPlayController=new QuickPlayController(StartQuickPlayUseCase,ChangeStatusUseCase);


export const injectGroupPlayController=new groupPlayController(createGroupPlayRoomUseCase, GetGroupPlayGroupUseCase,EditGroupUseCase,JoinGroupPlayGroupUseCase,removeMemberGroupPlayGroupUseCase,startGameGroupPlayGroupUseCase,changeGroupStatusUseCase,newGroupPlayUsecase);

export const injectTypingPracticeController=new typingPracticeController(GetPracticeTypingContentUseCase);
export const injectCompanyRequestController=new companyRequestController(CompanyRequestUseCase,tokenService,FindUserUseCase,GetCompanyUseCase,CompanyReApplyUseCase);
export const injectUserController =new userController(tokenService,FindUserUseCase,UpdateUserUseCase,changePasswordUseCase);