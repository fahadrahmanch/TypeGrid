import { GetMyLessonsResponseDTO } from "../../../DTOs/companyUser/get-my-lessons-response.dto";

export interface IGetMyLessonsUseCase {
  execute(userId: string): Promise<GetMyLessonsResponseDTO>;
}
