export interface ICreateLessonUseCase {
  execute(lessonData: any): Promise<void>;
}