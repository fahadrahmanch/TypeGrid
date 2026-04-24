import { IDiscussionDTO } from '../../../DTOs/user/get-discussions.dto';

export interface IGetAllDiscussionsUseCase {
  execute(page: number, limit: number): Promise<IDiscussionDTO[]>;
}
