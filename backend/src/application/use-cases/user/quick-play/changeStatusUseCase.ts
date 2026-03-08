import { IChangeStatusUseCase } from "../../interfaces/user/quickPlayUseCases/IChangeStatusUseCase";
import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/ICompetitionRepository";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/customError";
import { HttpStatusCodes } from "../../../../domain/enums/httpStatusCodes";
export class changeStatusUseCase implements IChangeStatusUseCase {
  constructor(
    private readonly _BasecompetitionRepository: ICompetitionRepository,
  ) {}

  async execute(competitionId: string, status: string): Promise<void> {
    if (!competitionId) {
      throw new CustomError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        MESSAGES.SOMETHING_WENT_WRONG,
      );
    }

    if (!status) {
      throw new CustomError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        MESSAGES.SOMETHING_WENT_WRONG,
      );
    }
    const competition =
      await this._BasecompetitionRepository.findById(competitionId);
    if (!competition) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.COMPETITION_NOT_FOUND,
      );
    }
    (competition as any).status = status;
    await this._BasecompetitionRepository.update(competition);
  }
}
