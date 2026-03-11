import { IDeleteCompanyUserUseCase } from "../../interfaces/companyAdmin/delete-company-user.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
export class DeleteUserUseCase implements IDeleteCompanyUserUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute(companyUserId: string): Promise<void> {
    if (!companyUserId) {
      throw new CustomError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        MESSAGES.SOMETHING_WENT_WRONG,
      );
    }
    await this.userRepository.delete(companyUserId);
  }
}
