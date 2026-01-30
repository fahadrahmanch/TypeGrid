export interface ISaveLessonResultUseCase{
    execute(userId:string,assignmentId:string,result:any):Promise<void>
}