import { IStartChallengeUseCase } from "../../interfaces/companyUser/IStartChallengeUseCase";
import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";

export class startChallengeUseCase implements IStartChallengeUseCase {

    constructor(
        private _baseRepoChallenge: IBaseRepository<any>,
        private _baseRepoCompetition: IBaseRepository<any>
    ) {}

    async execute(challengeId: string): Promise<void> {

        const challenge = await this._baseRepoChallenge.findById(challengeId);

        if (!challenge) {
            throw new Error("Challenge not found");
        }
        const competitionId = challenge.competitionId;
        if (!competitionId) {
            throw new Error("Competition not found for this challenge");
        }

        const competition = await this._baseRepoCompetition.findById(competitionId);

        if (!competition) {
            throw new Error("Competition does not exist");
        }

        if (competition.status !== "ongoing") {

            await this._baseRepoCompetition.updateById(
                competitionId,
                { status: "ongoing" }
            );

        }

    }
}