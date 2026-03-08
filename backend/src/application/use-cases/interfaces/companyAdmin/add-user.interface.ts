import AuthUserEntity from "../../../../domain/entities/auth-user.entity";

export interface IAddUserUseCase {
  addUser(data: any): Promise<AuthUserEntity>;
}
