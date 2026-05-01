import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { IBlockUserUseCase } from "../../interfaces/admin/block-user.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";

/**
 * Use case for blocking or unblocking a user.
 *
 * This use case toggles the user's status between "block" and "active".
 */
export class BlockUserUseCase implements IBlockUserUseCase {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(userId: string): Promise<void> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }

    // Toggle user status
    user.status = user.status === "block" ? "active" : "block";

    await this._userRepository.update(user);
  }
}
