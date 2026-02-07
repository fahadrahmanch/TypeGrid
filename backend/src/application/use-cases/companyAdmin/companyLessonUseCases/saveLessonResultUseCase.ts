import { ISaveLessonResultUseCase } from "../../interfaces/companyUser/ISaveLessonResultUseCase";
import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { LessonResult } from "../../../../domain/entities/LessonResult";
import logger from "../../../../utils/logger";
export class saveLessonResultUseCase implements ISaveLessonResultUseCase{
    constructor(
        private _baseRepositoryLessonResult:IBaseRepository<any>,
        private _baseRepositoryLessonAssignment:IBaseRepository<any>
    ){}
    async execute(userId:string,assignmentId:string,result:any):Promise<void>{
        const assignmentLesson=await this._baseRepositoryLessonAssignment.findById(assignmentId);
        const status=result?.status==false?"progress":"completed";
        const { status: _ignored, ...safeResult } = result;
        if(!assignmentLesson){
            throw new Error("Assignment lesson not found");
        }
        const existingResult = await this._baseRepositoryLessonResult.findOne({
            userId,
            assignmentId
        });

        if(!existingResult){
            const lessonResult=new LessonResult({
                userId,
                assignmentId,
                companyId:assignmentLesson.companyId,
                lessonId:assignmentLesson.lessonId,
                status,
                ...safeResult
            });
            const saveResultObject=lessonResult.toPersistence();
            const saveResult=await this._baseRepositoryLessonResult.create(saveResultObject);
            if(!saveResult){
                throw new Error("Failed to save lesson result");
            }
            return;
        }
        if(assignmentLesson.status==="completed"){
            logger.info("already completed");
            return;
        }
        const lessonResult=new LessonResult({
            userId,
            assignmentId,
            companyId:assignmentLesson.companyId,
            lessonId:assignmentLesson.lessonId,
            status:status,
            ...safeResult
        });
        const saveResultObject=lessonResult.toPersistence();
        await this._baseRepositoryLessonAssignment.update({
            _id:assignmentId,
             status:status,
        });
        const saveResult=await this._baseRepositoryLessonResult.update({_id:existingResult._id,saveResultObject});
        if(!saveResult){
            throw new Error("Failed to save lesson result");
        }
    }
}