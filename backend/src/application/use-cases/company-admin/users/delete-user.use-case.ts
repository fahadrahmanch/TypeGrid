import { IDeleteCompanyUserUseCase } from "../../interfaces/companyAdmin/delete-company-user.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";

/**
 * Use case responsible for deleting a company user.
 */
export class DeleteUserUseCase implements IDeleteCompanyUserUseCase {

  constructor(private readonly userRepository: IUserRepository) {}


  async execute(userId: string): Promise<void> {

    if (!userId) {
      throw new CustomError(
        HttpStatusCodes.BAD_REQUEST,
        MESSAGES.INVALID_REQUEST
      );
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.AUTH_USER_NOT_FOUND
      );
    }

    const deleted = await this.userRepository.delete(userId);

    if (!deleted) {
      throw new CustomError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        MESSAGES.SOMETHING_WENT_WRONG
      );
    }
  }
}