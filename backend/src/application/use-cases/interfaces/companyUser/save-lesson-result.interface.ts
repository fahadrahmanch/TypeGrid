import { LessonResultDTO } from '../../../DTOs/companyUser/lesson-result.dto';
export interface ISaveLessonResultUseCase {
  execute(userId: string, assignmentId: string, result: LessonResultDTO): Promise<void>;
}
