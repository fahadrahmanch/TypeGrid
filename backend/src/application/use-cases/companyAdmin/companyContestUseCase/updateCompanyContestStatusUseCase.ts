import { IContestRepository } from "../../../../domain/interfaces/repository/company/IContestRepository";
import { IUpdateCompanyContestStatusUseCase } from "../../interfaces/companyAdmin/IUpdateCompanyContestStatusUseCase";
import { ContestEntity } from "../../../../domain/entities/companyContestEntity";
import { MESSAGES } from "../../../../domain/constants/messages";
export class updateCompanyContestStatusUseCase implements IUpdateCompanyContestStatusUseCase {
  constructor(private contestRepository: IContestRepository) {}

  async execute(contestId: string, status: string): Promise<void> {
    const contest = await this.contestRepository.findById(contestId);
    if (!contest) {
      throw new Error(MESSAGES.CONTEST_NOT_FOUND);
    }
    const contestEntity = contest;
    contestEntity.updateStatus(status);
    const updatedStatus = contestEntity.getStatus();

    await this.contestRepository.updateById(contestId, {
      status: updatedStatus,
      ...(updatedStatus === "ongoing" && { startTime: new Date() }),
    });
  }
}
