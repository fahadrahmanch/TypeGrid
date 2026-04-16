import { IGetAssignLessonUseCase } from '../../interfaces/companyUser/get-assign-lesson.interface';
import { MESSAGES } from '../../../../domain/constants/messages';
import { ILessonAssignmentRepository } from '../../../../domain/interfaces/repository/company/lesson-assignment-repository.interface';
import { ILessonRepository } from '../../../../domain/interfaces/repository/admin/lesson-repository.interface';
import { AssignedLessonDTO } from '../../../DTOs/companyUser/get-assign-lesson-response.dto';
import { CustomError } from '../../../../domain/entities/custom-error.entity';
import { HttpStatusCodes } from '../../../../domain/enums/http-status-codes.enum';

export class GetAssignLessonUseCase implements IGetAssignLessonUseCase {
  constructor(
    private readonly _lessonAssignmentRepository: ILessonAssignmentRepository,
    private readonly _lessonRepository: ILessonRepository
  ) {}

  async execute(assignmentId: string): Promise<AssignedLessonDTO> {
    const assignment = await this._lessonAssignmentRepository.findById(assignmentId);
    if (!assignment) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.ASSIGNED_LESSON_NOT_FOUND);
    }

    const lesson = await this._lessonRepository.findById(assignment.getLessonId());
    if (!lesson) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.LESSON_NOT_FOUND);
    }

    return {
      id: assignment.getId() ?? '',
      status: assignment.getStatus(),
      deadlineAt: assignment.getDeadlineAt(),
      lesson: {
        id: lesson._id ?? '',
        title: lesson.title ?? '',
        text: lesson.text,
        level: lesson.level,
        wpm: lesson.wpm,
        accuracy: lesson.accuracy,
      },
    };
  }
}
