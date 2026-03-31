import { ICompanyChallengeRepository } from "../../../../domain/interfaces/repository/company/company-challenge-repository.interface";
import { IRejectChallengeUseCase } from "../../interfaces/companyUser/reject-challenge.interface";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { MESSAGES } from "../../../../domain/constants/messages";
import { appEvents } from "../../../events/AppEvents";

export class RejectChallengeUseCase implements IRejectChallengeUseCase {
    constructor(
        private readonly _challengeRepository: ICompanyChallengeRepository,
    ) {}

    async execute(challengeId: string): Promise<void> {
        const challenge = await this._challengeRepository.findById(challengeId);
        if (!challenge) {
            throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.CHALLENGE_NOT_FOUND);
        }
        challenge.setStatus("declined");
        await this._challengeRepository.update(challenge.toObject());
        appEvents.emit("challenge.rejected", {
            challengeId,
            senderId: challenge.getSenderId(),
            status: "declined",
        });
    }
}