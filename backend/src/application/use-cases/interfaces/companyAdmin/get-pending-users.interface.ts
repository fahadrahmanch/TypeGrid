import { IPendingUserDTO } from "../../../DTOs/companyAdmin/get-pending-users.dto";

export interface IGetPendingUsersUseCase {
  execute(userId: string): Promise<{ total: number; users: IPendingUserDTO[], userIds: string[] }>;
}
