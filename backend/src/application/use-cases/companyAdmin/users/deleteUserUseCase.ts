import { IDeleteCompanyUserUseCase } from "../../interfaces/companyAdmin/IDeleteCompanyUserUseCase";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/IUserRepository";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/customError";
import { HttpStatusCodes } from "../../../../domain/enums/httpStatusCodes";
export class deleteCompanyUserUseCase implements IDeleteCompanyUserUseCase {
  constructor(private userRepository: IUserRepository) {}
  async deleteUser(companyUserId: string): Promise<void> {
    if (!companyUserId) {
      throw new CustomError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        MESSAGES.SOMETHING_WENT_WRONG,
      );
    }
    await this.userRepository.delete(companyUserId);
  }
}
