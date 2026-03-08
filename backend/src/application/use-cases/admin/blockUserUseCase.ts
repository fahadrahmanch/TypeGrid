import { IUserRepository } from "../../../domain/interfaces/repository/user/IUserRepository";
import { IBlockUserUseCase } from "../interfaces/admin/IBlockUserUseCase";
import { MESSAGES } from "../../../domain/constants/messages";
import { CustomError } from "../../../domain/entities/customError";
import { HttpStatusCodes } from "../../../domain/enums/httpStatusCodes";
export class blockUserUseCase implements IBlockUserUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute(userId: string): Promise<void> {
    if (!userId) {
      throw new CustomError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        MESSAGES.SOMETHING_WENT_WRONG,
      );
    }
    const blockUser = await this.userRepository.findById(userId);
    if (!blockUser) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.AUTH_USER_NOT_FOUND,
      );
    }
    blockUser.status == "block"
      ? (blockUser.status = "active")
      : (blockUser.status = "block");
    await this.userRepository.update(blockUser);
  }
}
