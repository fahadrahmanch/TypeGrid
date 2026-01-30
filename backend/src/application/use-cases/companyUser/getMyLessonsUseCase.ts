import { IGetMyLessonsUseCase } from "../interfaces/companyUser/IGetMyLessonsUseCase";
import { IBaseRepository } from "../../../domain/interfaces/repository/IBaseRepository";
import { MESSAGES } from "../../../domain/constants/messages";
import { GetMyLessonsResponseDTO } from "../../DTOs/companyUser/GetMyLessonsResponseDTO";
export class getMyLessonsUseCase implements IGetMyLessonsUseCase{
    constructor(
    private _baseAssignmentLessonRepository:IBaseRepository<any>,
    private _baseRepoUser:IBaseRepository<any>,
    private _baseRepoLesson:IBaseRepository<any>
    ){}
    async execute(userId:string):Promise<GetMyLessonsResponseDTO>{
    
    const user=await this._baseRepoUser.findById(userId)
    if(!user){
        throw new Error(MESSAGES.AUTH_USER_NOT_FOUND)
    }

const assignedLessons =await this._baseAssignmentLessonRepository.find({ userId },{ populate: {path: "lessonId",select: 'text wpm accuracy level title category createdBy'}});
console.log("assigbed lessons in use case",assignedLessons)
const completed= assignedLessons.reduce((acc,curr)=>{
    if(curr.status==='completed'){
    return acc+1
    }
    return acc
},0)
 return {
    lessons: assignedLessons,
    completed,
    total: assignedLessons.length,
  };
  

    }
}