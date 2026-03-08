import { IContestRepository } from "../../../../domain/interfaces/repository/company/contest-repository.interface";
import { IDeleteContestUseCase } from "../../interfaces/companyAdmin/delete-contest.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
export class DeleteContestUseCase implements IDeleteContestUseCase {
  constructor(private contestRepository: IContestRepository) {}
  async delete(contestId: string): Promise<void> {
    const contest = await this.contestRepository.findById(contestId);
    if (!contest) {
      throw new Error(MESSAGES.CONTEST_NOT_FOUND);
    }
    await this.contestRepository.delete(contestId);
  }
}
