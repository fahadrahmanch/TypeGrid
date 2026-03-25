import { ICreateChallengeUseCase } from "../../interfaces/admin/create-challenge.interface";
import { IChallengeRepository } from "../../../../domain/interfaces/repository/admin/challenge-repository.interface";
import { ChallengeEntity } from "../../../../domain/entities/challenge.entity";
import { CreateChallengeDTO, ChallengeResponseDTO } from "../../../DTOs/admin/challenge.dto";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { MESSAGES } from "../../../../domain/constants/messages";

export class CreateChallengeUseCase implements ICreateChallengeUseCase {
    constructor(private readonly _challengeRepository: IChallengeRepository) {}
    async execute(challenge: CreateChallengeDTO): Promise<ChallengeResponseDTO> {
        const isExist = await this._challengeRepository.findOne({ title: challenge.title });
        if (isExist) {
            throw new CustomError(HttpStatusCodes.CONFLICT, MESSAGES.CHALLENGE_ALREADY_EXISTS);
        }
        const challengeEntity = new ChallengeEntity(challenge);
        const newChallenge = await this._challengeRepository.create(challengeEntity.toObject());
        return newChallenge.toObject() as ChallengeResponseDTO;
    }
}
