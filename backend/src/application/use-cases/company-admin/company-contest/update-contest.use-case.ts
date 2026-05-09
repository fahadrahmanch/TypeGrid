import { CreateContestDTO } from "../../../DTOs/companyAdmin/company-contest.dto";
import { IUpdateContestUseCase } from "../../interfaces/companyAdmin/update-contest.interface";
import { IContestRepository } from "../../../../domain/interfaces/repository/company/contest-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { mapContestDTOAdmin } from "../../../mappers/companyAdmin/company-contest.mapper";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";

/**
 * Use case for updating an existing contest.
 * And returns the updated contest information mapped to DTO format.
 */
export class UpdateContestUseCase implements IUpdateContestUseCase {
  constructor(private readonly _contestRepository: IContestRepository) {}

  async execute(contestId: string, data: CreateContestDTO): Promise<CreateContestDTO> {
    const contest = await this._contestRepository.findById(contestId);

    if (!contest) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.CONTEST_NOT_FOUND);
    }

    if (data.date && data.startTime) {
      data.startTime = new Date(`${data.date}T${data.startTime}:00`);
    }

    const updatedContest = await this._contestRepository.update({
      ...contest.toObject(),
      ...data,
      groupId: data.targetGroup !== undefined ? (data.targetGroup || null) : contest.toObject().groupId,
      duration: data.duration ? Number(data.duration) * 60 : contest.toObject().duration,
      maxParticipants: data.maxParticipants ? Number(data.maxParticipants) : contest.toObject().maxParticipants,
      rewards: data.rewards ? data.rewards.map(r => ({
        rank: r.rank,
        prize: Number(r.prize)
      })) : contest.toObject().rewards
    });
    if (!updatedContest) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.CONTEST_NOT_FOUND);
    }
    return mapContestDTOAdmin(updatedContest.toObject());
  }
}
