import { IContestRepository } from "../../../../domain/interfaces/repository/company/contest-repository.interface";
import { IUpdateCompanyContestStatusUseCase } from "../../interfaces/companyAdmin/update-company-contest-status.interface";
import { ContestEntity } from "../../../../domain/entities/company-contest.entity";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";

/**
 * Use case for updating the status of a company contest.
 */
export class UpdateCompanyContestStatusUseCase implements IUpdateCompanyContestStatusUseCase {
  constructor(private readonly _contestRepository: IContestRepository) {}

  async execute(contestId: string, status: string): Promise<void> {
    const contest = await this._contestRepository.findById(contestId);

    if (!contest) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.CONTEST_NOT_FOUND,
      );
    }

    const contestEntity = new ContestEntity(contest);
    contestEntity.updateStatus(status);
    const updatedStatus = contestEntity.getStatus();

    await this._contestRepository.updateById(contestId, {
      status: updatedStatus,
      ...(updatedStatus === "ongoing" && { startTime: new Date() }),
    });
  }
}