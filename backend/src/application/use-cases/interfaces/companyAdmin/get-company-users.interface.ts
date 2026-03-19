import { UserEntity } from "../../../../domain/entities";
export interface IGetCompanyUsersUseCase {
  execute(CompanyId: string): Promise<UserEntity[]>;
}
