
export interface IDeleteCompanyLessonUseCase{
    execute(lessonId:string):Promise<void>
}