import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { AuthUserEntity } from "../../../../domain/entities";
import { IGetCompanyUsersUseCase } from "../../interfaces/companyAdmin/get-company-users.interface";
export class GetCompanyUsersUseCase implements IGetCompanyUsersUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute(CompanyId: string): Promise<AuthUserEntity[]> {
    const CompanyUsers = await this.userRepository.find({
      CompanyId: CompanyId,
      role: "companyUser",
    });
    return CompanyUsers;
  }
}
