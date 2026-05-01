import { AnotherUserProfileDTO } from "../../../DTOs/user/another-user-profile.dto";

export interface IGetAnotherUserProfileUseCase {
  execute(userId: string, requesterRole: string): Promise<AnotherUserProfileDTO | null>;
}
