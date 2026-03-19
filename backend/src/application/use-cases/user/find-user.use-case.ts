import { IFindUserUseCase } from "../interfaces/user/find-user.interface";
import { IAuthRepository } from "../../../domain/interfaces/repository/user/auth-repository.interface";
import { AuthUserEntity } from "../../../domain/entities";
export class FindUserUseCase implements IFindUserUseCase {
  constructor(private authRepository: IAuthRepository) {}
  async execute(email: string): Promise<AuthUserEntity | null> {
    return await this.authRepository.findByEmail(email);
  }
}
