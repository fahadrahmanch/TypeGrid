import { IAddUserUseCase } from "../../interfaces/companyAdmin/IAddUserUseCase";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/IUserRepository";
import { AuthUserEntity } from "../../../../domain/entities";
import { IHashService } from "../../../../domain/interfaces/services/IHashService";
import { MESSAGES } from "../../../../domain/constants/messages";

export class addUserUseCase implements IAddUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private _hashService: IHashService,
  ) {}
  async addUser(data: any): Promise<AuthUserEntity> {
    const exists = await this.userRepository.FindByEmail(data.email);
    if (exists) {
      throw new Error(MESSAGES.AUTH_EMAIL_EXISTS);
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
