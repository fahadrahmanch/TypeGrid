import { IFindUserByemailUseCase } from "../interfaces/auth/find-user-by-email.interface";
import { IAuthRepository } from "../../../domain/interfaces/repository/user/auth-repository.interface";
import { AuthUserEntity } from "../../../domain/entities";
import { IUserDocument } from "../../../infrastructure/db/types/documents";
/**
 * Finds a user by their email address.
 */
export class FindUserByEmailUseCase implements IFindUserByemailUseCase {
  constructor(private readonly _authRepository: IAuthRepository) {}

  async execute(email: string) {
    return this._authRepository.findByEmail(email);
  }
}