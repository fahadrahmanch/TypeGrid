import { IGetChallengeUseCase } from "../../interfaces/admin/get-challenge.interface";
import { IChallengeRepository } from "../../../../domain/interfaces/repository/admin/challenge-repository.interface";
import { ChallengeResponseDTO } from "../../../DTOs/admin/challenge.dto";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { MESSAGES } from "../../../../domain/constants/messages";
import { mapToChallengeDTO } from "../../../mappers/admin/challenge-management.mapper";

export class GetChallengeUseCase implements IGetChallengeUseCase {
  constructor(private readonly _challengeRepository: IChallengeRepository) {}
  async execute(id: string): Promise<ChallengeResponseDTO> {
    const challenge = await this._challengeRepository.findById(id);
    if (!challenge) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.CHALLENGE_NOT_FOUND,
      );
    }
    return mapToChallengeDTO(challenge);
  }
}
