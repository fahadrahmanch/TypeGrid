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
  async execute(): Promise<UserDTO[]> {

    const users = await this.authRepository.find({ role: "user" });

    return users.map(mapUserToDTO);

  }

}