import { IContestRepository } from "../../../../domain/interfaces/repository/company/contest-repository.interface";
import { IDeleteContestUseCase } from "../../interfaces/companyAdmin/delete-contest.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";

/**
 * Use case for deleting a contest by its ID.
 */
export class DeleteContestUseCase implements IDeleteContestUseCase {
  constructor(private readonly _contestRepository: IContestRepository) {}

  async execute(contestId: string): Promise<void> {
    const contest = await this._contestRepository.findById(contestId);

    if (!contest) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.CONTEST_NOT_FOUND);
    }

    await this._contestRepository.delete(contestId);
  }
}