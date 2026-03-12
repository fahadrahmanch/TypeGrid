import { AuthUserEntity } from "../../../../domain/entities";
export interface IGoogleAuthUseCase {
  execute(
    name: string,
    email: string,
    googleId: string,
  ): Promise<AuthUserEntity>;
}
