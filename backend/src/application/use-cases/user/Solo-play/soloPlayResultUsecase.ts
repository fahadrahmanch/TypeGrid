import { ISoloPlayResultUseCase } from "../../interfaces/user/soloPlayUserCases/ISoloPlayResultUseCase";
import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/ICompetitionRepository";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/IUserRepository";
import { IResultRepository } from "../../../../domain/interfaces/repository/company/IResultRepository";
import { CompetitionEntity } from "../../../../domain/entities/CompetitionEntity";
import { ResultEntity } from "../../../../domain/entities/ResultEntity";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/customError";
import { HttpStatusCodes } from "../../../../domain/enums/httpStatusCodes";
export class SoloPlayResultUseCase implements ISoloPlayResultUseCase {
  constructor(
    private _competitionRepo: ICompetitionRepository,
    private _userRepo: IUserRepository,
    private _resultRepo: IResultRepository,
  ) {}

  async execute(userId: string, gameId: string, result: any): Promise<void> {
    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.AUTH_USER_NOT_FOUND,
      );
    }
    const competition = await this._competitionRepo.findById(gameId);

    if (!competition) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.COMPETITION_NOT_FOUND,
      );
    }
    const competitionEntity = competition as any;
    competitionEntity.endCompetition();
    await this._competitionRepo.update(competitionEntity);
    const resultEntity = new ResultEntity({
      userId,
      competitionId: gameId,
      type: "solo",
      result,
    });
    const resultObject = resultEntity.toObject();
    await this._resultRepo.create(resultObject);
  }
}
