import { AssignedLessonDTO } from "../../../DTOs/companyUser/get-assign-lesson-response.dto";
export interface IGetAssignLessonUseCase {
  execute(assignmentId: string): Promise<AssignedLessonDTO>;
}
