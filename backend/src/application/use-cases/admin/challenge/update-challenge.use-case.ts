import { IUpdateChallengeUseCase } from "../../interfaces/admin/update-challenge.interface";
import { IChallengeRepository } from "../../../../domain/interfaces/repository/admin/challenge-repository.interface";
import { ChallengeResponseDTO, UpdateChallengeDTO } from "../../../DTOs/admin/challenge.dto";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { MESSAGES } from "../../../../domain/constants/messages";
import { mapToChallengeDTO } from "../../../mappers/admin/challenge-management.mapper";

export class UpdateChallengeUseCase implements IUpdateChallengeUseCase {
  constructor(private readonly _challengeRepository: IChallengeRepository) {}
  async execute(id: string, challengeData: UpdateChallengeDTO): Promise<ChallengeResponseDTO> {
    const existing = await this._challengeRepository.findById(id);
    if (!existing) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.CHALLENGE_NOT_FOUND);
    }

    if (challengeData.title !== undefined) {
      const isExist = await this._challengeRepository.findOne({
        title: challengeData.title,
      });
      if (isExist && isExist.getId() !== id) {
        throw new CustomError(HttpStatusCodes.CONFLICT, MESSAGES.CHALLENGE_ALREADY_EXISTS);
      }
    }

    const updated = await this._challengeRepository.update({
      _id: id,
      ...challengeData,
    });
    if (!updated) {
      throw new CustomError(HttpStatusCodes.INTERNAL_SERVER_ERROR, MESSAGES.SOMETHING_WENT_WRONG);
    }

    return mapToChallengeDTO(updated);
  }
}
