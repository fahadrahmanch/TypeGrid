import { IDeleteChallengeUseCase } from "../../interfaces/admin/delete-challenge.interface";
import { IChallengeRepository } from "../../../../domain/interfaces/repository/admin/challenge-repository.interface";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { MESSAGES } from "../../../../domain/constants/messages";

export class DeleteChallengeUseCase implements IDeleteChallengeUseCase {
  constructor(private readonly _challengeRepository: IChallengeRepository) {}
  async execute(id: string): Promise<void> {
    const existing = await this._challengeRepository.findById(id);
    if (!existing) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.CHALLENGE_NOT_FOUND,
      );
    }
    await this._challengeRepository.delete(id);
  }
}
