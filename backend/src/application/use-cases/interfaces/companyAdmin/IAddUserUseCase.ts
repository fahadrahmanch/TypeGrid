import AuthUserEntity from "../../../../domain/entities/AuthUserEntity";

export interface IAddUserUseCase {
  addUser(data: any): Promise<AuthUserEntity>;
}
