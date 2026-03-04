import { IGetSentChallengeUseCase } from "../../interfaces/companyUser/IGetSentChallengeUseCase"
import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository"
import { SentChallengeDTO, mapSentChallengeToDTO } from "../../../DTOs/companyUser/challengeDTO"

export class getSentChallengesUseCase implements IGetSentChallengeUseCase {

    constructor(
        private _baseRepoChallenge: IBaseRepository<any>,
        private _baseRepoUser: IBaseRepository<any>
    ) {}

    async execute(userId: string): Promise<SentChallengeDTO[]> {

        const challenges = await this._baseRepoChallenge.find({
            senderId: userId,
            status: "pending"
        })

        const mappedChallenges: SentChallengeDTO[] = challenges.map((challenge: any) =>
            mapSentChallengeToDTO(challenge)
        )

        return mappedChallenges
    }
}