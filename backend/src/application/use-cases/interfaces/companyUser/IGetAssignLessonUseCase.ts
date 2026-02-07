import { AssignedLessonDTO } from "../../../DTOs/companyUser/GetAssignLessonResponseDTO";
export interface IGetAssignLessonUseCase{
    execute(assignmentId:string):Promise<AssignedLessonDTO>
}
