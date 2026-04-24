export interface IAssignGroupLessonUseCase {
  execute(userId: string, groups: string[], lessons: string[], deadline: string): Promise<void>;
}
