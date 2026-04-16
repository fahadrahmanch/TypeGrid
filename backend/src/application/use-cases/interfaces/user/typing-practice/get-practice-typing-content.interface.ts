import { PracticeTypingDTO } from '../../../../../application/DTOs/user/practice-typing.dto';

export interface IGetPracticeTypingContentUseCase {
  execute(level: string, category: string): Promise<PracticeTypingDTO>;
  getLessonById(lessonId: string): Promise<PracticeTypingDTO>;
}
