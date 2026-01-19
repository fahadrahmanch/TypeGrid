
export interface IDeleteLessonUseCase {
    execute(lessonId: string): Promise<void>;
}