import { IDiscussionDTO } from "../../../DTOs/user/get-discussions.dto";

export interface IGetMyDiscussionsUseCase {
  execute(userId: string): Promise<IDiscussionDTO[]>;
}
