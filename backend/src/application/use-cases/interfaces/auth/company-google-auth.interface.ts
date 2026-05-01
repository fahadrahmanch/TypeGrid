import { AuthUserEntity } from "../../../../domain/entities";

export interface ICompanyGoogleAuthUseCase {
  execute(name: string, email: string): Promise<AuthUserEntity>;
}