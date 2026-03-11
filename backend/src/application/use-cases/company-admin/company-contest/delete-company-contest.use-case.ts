import { IContestRepository } from "../../../../domain/interfaces/repository/company/contest-repository.interface";
import { IDeleteContestUseCase } from "../../interfaces/companyAdmin/delete-contest.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatus } from "../../../../presentation/constants/httpStatus";
export class DeleteContestUseCase implements IDeleteContestUseCase {
  constructor(private contestRepository: IContestRepository) {}
  async execute(contestId: string): Promise<void> {
    const contest = await this.contestRepository.findById(contestId);
    if (!contest) {
      throw new CustomError(HttpStatus.NOT_FOUND, MESSAGES.CONTEST_NOT_FOUND);
    }
    await this.contestRepository.delete(contestId);
  }
}
