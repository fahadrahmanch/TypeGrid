import { IDiscussionDetailDTO } from "../../../DTOs/user/get-discussion-detail.dto";

export interface IGetDiscussionByIdUseCase {
  execute(id: string): Promise<IDiscussionDetailDTO | null>;
}
