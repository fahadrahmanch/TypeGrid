import { IGoogleAuthUseCase } from '../../interfaces/auth/google-auth.interface';
import { IAuthRepository } from '../../../../domain/interfaces/repository/user/auth-repository.interface';
import { AuthUserEntity } from '../../../../domain/entities';
import { MESSAGES } from '../../../../domain/constants/messages';
import { CustomError } from '../../../../domain/entities/custom-error.entity';
import { HttpStatusCodes } from '../../../../domain/enums/http-status-codes.enum';

/**
 * Handles Google OAuth authentication.
 * Creates a new user if not found, or returns the existing user.
 */
export class GoogleAuthUseCase implements IGoogleAuthUseCase {
  constructor(private readonly _authRepository: IAuthRepository) {}

  async execute(name: string, email: string, googleId: string): Promise<AuthUserEntity> {
    const user = await this._authRepository.findByEmail(email);

    if (!user) {
      const newUser = new AuthUserEntity({ name, email, googleId });
      return this._authRepository.create(newUser) as Promise<AuthUserEntity>;
    }

    if (user.status === 'block') {
      throw new CustomError(HttpStatusCodes.FORBIDDEN, MESSAGES.AUTH_ACCOUNT_BLOCKED);
    }

    return user as AuthUserEntity;
  }
}
