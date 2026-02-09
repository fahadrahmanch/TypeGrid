import { IChangeStatusUseCase } from "../../interfaces/user/quickPlayUseCases/IChangeStatusUseCase";
import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { MESSAGES } from "../../../../domain/constants/messages";
export class changeStatusUseCase implements IChangeStatusUseCase {
  constructor(
    private readonly _BasecompetitionRepository: IBaseRepository<any>,
  ) {}

  async execute(competitionId: string, status: string): Promise<void> {
      if (!competitionId) {
        throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
      }

      if (!status) {
        throw new Error(MESSAGES.SOMETHING_WENT_WRONG);
      }
        const competition = await this._BasecompetitionRepository.findById(competitionId);
        if (!competition) {
          throw new Error(MESSAGES.COMPETITION_NOT_FOUND);
        }
        competition.status = status;
        await this._BasecompetitionRepository.update(competition);
  }
}
