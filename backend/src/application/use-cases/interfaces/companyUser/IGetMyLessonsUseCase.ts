import { GetMyLessonsResponseDTO } from "../../../DTOs/companyUser/GetMyLessonsResponseDTO";

export interface IGetMyLessonsUseCase{
    execute(userId:string):Promise<GetMyLessonsResponseDTO>
}