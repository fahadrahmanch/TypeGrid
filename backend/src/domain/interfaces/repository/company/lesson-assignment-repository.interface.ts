import { LessonAssignmentEntity } from "../../../../domain/entities/assign-lesson.entity";
import { IBaseRepository } from "../base-repository.interface";

export interface ILessonAssignmentRepository extends IBaseRepository<LessonAssignmentEntity> {
    getPendingUsers(companyId: string): Promise<LessonAssignmentEntity[]>;
}
