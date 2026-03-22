import { ICompanyChallengeRepository } from "../../../../domain/interfaces/repository/company/company-challenge-repository.interface";
import { ISaveChallengeResultUseCase } from "../../interfaces/companyUser/save-challenge-result.interface";
import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/competition-repository.interface";
import { IResultRepository } from "../../../../domain/interfaces/repository/result-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { ResultEntity } from "../../../../domain/entities/result.entity";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
export class SaveChallengeResultUseCase implements ISaveChallengeResultUseCase {
    constructor(
        private readonly _challengeRepository: ICompanyChallengeRepository,
        private readonly _competitionRepository: ICompetitionRepository,
        private readonly _resultRepository: IResultRepository,
    ) {}

    async execute(gameId: string, resultArray: any[]): Promise<void> {
       
        const challenge = await this._challengeRepository.findById(gameId);
        if(!challenge){
            throw new CustomError(404,MESSAGES.CHALLENGE_NOT_FOUND);
        }
        const competition = await this._competitionRepository.findById(challenge.getCompetitionId());
        if(!competition){
            throw new CustomError(404,MESSAGES.COMPETITION_NOT_FOUND);
        }
        challenge.complete();
        competition.endCompetition();
          for (const res of resultArray) {
              const resultEntity = new ResultEntity({
                userId: res.userId,
                competitionId: gameId,
                type: "oneToOne",
                result: {
                  wpm: res.wpm,
                  accuracy: Number(res.accuracy),
                  errors: res.errors,
                  time: res?.timeTaken || 0,
                  rank: res.rank,
                },
              });
     
        await this._challengeRepository.update(challenge.toObject());
        await this._competitionRepository.update(competition.toObject());
        await this._resultRepository.create(resultEntity.toObject());
    }
}
}