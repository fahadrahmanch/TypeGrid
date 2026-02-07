import { IAssignLessonUseCase } from "../../interfaces/companyAdmin/IAssignLessonUseCase";
import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { MESSAGES } from "../../../../domain/constants/messages";
import { LessonAssignment } from "../../../../infrastructure/db/models/company/lesssonAssigmentSchema";
export class assignLessonUseCase implements IAssignLessonUseCase{
    constructor(
    private _baseRepoAssignLesson:IBaseRepository<any>,
    private _baseRepoUser:IBaseRepository<any>,
    private _baseRepoLeson:IBaseRepository<any>

    ){}
async execute(userId: string, users: string[], lessons: string[],deadline:string): Promise<void> {
    const user=await this._baseRepoUser.findById(userId);
    if(!user){
        throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const companyId=user.CompanyId;
    if(!companyId){
        throw new Error(MESSAGES.COMPANY_NOT_FOUND);
    }
    for(let i =0;i<users.length;i++){
        for(let j=0;j<lessons.length;j++){
          const assigned=  new LessonAssignment({
                userId:users[i],
                lessonId:lessons[j],
                status:"assigned",
                companyId:companyId,
                deadlineAt:deadline
            });
            await this._baseRepoAssignLesson.create(assigned);
        }
    }
    
}
}