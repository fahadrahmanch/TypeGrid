import { IContestRepository } from "../../../../domain/interfaces/repository/company/contest-repository.interface";
import { IUpdateCompanyContestStatusUseCase } from "../../interfaces/companyAdmin/update-company-contest-status.interface";
import { ContestEntity } from "../../../../domain/entities/company-contest.entity";
import { MESSAGES } from "../../../../domain/constants/messages";
export class UpdateCompanyContestStatusUseCase implements IUpdateCompanyContestStatusUseCase {
  constructor(private contestRepository: IContestRepository) {}

  async execute(contestId: string, status: string): Promise<void> {
    const contest = await this.contestRepository.findById(contestId);
    if (!contest) {
      throw new Error(MESSAGES.CONTEST_NOT_FOUND);
    }
    const contestEntity = new ContestEntity(contest);
    contestEntity.updateStatus(status);
    const updatedStatus = contestEntity.getStatus();

    await this.contestRepository.updateById(contestId, {
      status: updatedStatus,
      ...(updatedStatus === "ongoing" && { startTime: new Date() }),
    });
  }
}
