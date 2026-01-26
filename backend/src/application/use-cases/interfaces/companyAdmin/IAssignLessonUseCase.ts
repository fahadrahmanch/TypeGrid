
export interface IAssignLessonUseCase{
    execute(userId:string,users:string[],lessons:string[],deadline:string):Promise<void>
}