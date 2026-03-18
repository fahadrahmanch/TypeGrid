import { IGetUsersUseCase } from "../../interfaces/admin/get-users.interface";
import { IAuthRepository } from "../../../../domain/interfaces/repository/user/auth-repository.interface";
import { UserDTO } from "../../../DTOs/admin/user-management.dto";
import { mapUserToDTO } from "../../../mappers/admin/user-manage.mapper";

/**
 * Use case responsible for retrieving all users.
 */
export class GetUsersUseCase implements IGetUsersUseCase {

  constructor(private readonly authRepository: IAuthRepository) {}

  /**
   * Retrieves all users from the authentication repository and maps them to DTOs.
   */
  async execute(search:string,status:string,page:number,limit:number): Promise<{users:UserDTO[],total:number}> {

    const data = await this.authRepository.getUsers(search,status,page,limit);
    const users = data.users.map(mapUserToDTO);
    return {users,total:data.total};

  }

}