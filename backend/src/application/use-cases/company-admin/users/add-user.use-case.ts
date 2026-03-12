import { IAddUserUseCase } from "../../interfaces/companyAdmin/add-user.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { AuthUserEntity } from "../../../../domain/entities";
import { IHashService } from "../../../../domain/interfaces/services/hash-service.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { AddUserDTO } from "../../../DTOs/companyAdmin/add-uset.dto";

/**
 * Use case responsible for creating a new company user.
 */

export class AddUserUseCase implements IAddUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private _hashService: IHashService,
  ) {}

  async addUser(data: AddUserDTO): Promise<AuthUserEntity> {
    const existingUser = await this.userRepository.FindByEmail(data.email);
    if (existingUser) {
      throw new CustomError(
        HttpStatusCodes.CONFLICT,
        MESSAGES.AUTH_EMAIL_EXISTS,
      );
    }
    const hashedPassword = await this._hashService.hash(data.password);
    const newUser = new AuthUserEntity({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      CompanyId: data.CompanyId,
      role: data.role || "companyUser",
      KeyBoardLayout: "QWERTY",
      status: "active",
    });
    return await this.userRepository.create(newUser);
  }
}
