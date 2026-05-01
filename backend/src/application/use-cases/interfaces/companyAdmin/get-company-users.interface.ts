import { UserEntity } from "../../../../domain/entities";
export interface IGetCompanyUsersUseCase {
  execute(CompanyId: string, search: string, page: number, limit: number): Promise<{ users: UserEntity[]; total: number }>;
}
