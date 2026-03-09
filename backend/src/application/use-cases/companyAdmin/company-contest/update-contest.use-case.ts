import { CreateContestDTO } from "../../../DTOs/companyAdmin/company-contest.dto";
import { IUpdateContestUseCase } from "../../interfaces/companyAdmin/update-contest.interface";
import { IContestRepository } from "../../../../domain/interfaces/repository/company/contest-repository.interface";
import { ContestEntity } from "../../../../domain/entities/company-contest.entity";
import { MESSAGES } from "../../../../domain/constants/messages";
import { mapContestDTOAdmin } from "../../../mappers/companyAdmin/company-contest.mapper";
export class UpdateContestUseCase implements IUpdateContestUseCase {
  constructor(private contestRepository: IContestRepository) {}
  async execute(
    constestId: string,
    data: CreateContestDTO,
  ): Promise<CreateContestDTO> {
    const contest = await this.contestRepository.findById(constestId);

    if (!contest) {
      throw new Error(MESSAGES.CONTEST_NOT_FOUND);
    }
    if (data.date && data.startTime) {
      data.startTime = new Date(`${data.date}T${data.startTime}:00`);
    }
    const contestEntity = new ContestEntity(contest);
    Object.assign(contestEntity, data);
    const updatedContest = await this.contestRepository.update(contestEntity);
    return mapContestDTOAdmin(updatedContest);
  }
}
