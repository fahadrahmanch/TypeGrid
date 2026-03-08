import { IUserRepository } from "../../../../domain/interfaces/repository/user/IUserRepository";
import { AuthUserEntity } from "../../../../domain/entities";
import { IGetCompanyUsersUseCase } from "../../interfaces/companyAdmin/IGetCompanyUsersUseCase";
export class getCompanyUsersUseCase implements IGetCompanyUsersUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute(CompanyId: string): Promise<AuthUserEntity[]> {
    const CompanyUsers = await this.userRepository.find({
      CompanyId: CompanyId,
      role: "companyUser",
    });
    return CompanyUsers;
  }
}
