import { AuthUserEntity } from "../../../../domain/entities";
export interface ILoginUseCase {
  execute(
    email: string,
    password: string,
    allowedRoles: string[],
  ): Promise<AuthUserEntity | void>;
}
