import { CreateContestDTO } from "../../../DTOs/companyAdmin/CompanyContestDTO";
import { IUpdateContestUseCase } from "../../interfaces/companyAdmin/IUpdateContestUseCase";
import { IContestRepository } from "../../../../domain/interfaces/repository/company/IContestRepository";
import { ContestEntity } from "../../../../domain/entities/companyContestEntity";
import { MESSAGES } from "../../../../domain/constants/messages";
import { mapContestDTOAdmin } from "../../../DTOs/companyAdmin/CompanyContestDTO";
export class updateContestUse implements IUpdateContestUseCase {
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
    const contestEntity = contest;
    Object.assign(contestEntity, data);
    const updatedContest = await this.contestRepository.update(contestEntity);
    return mapContestDTOAdmin(updatedContest as any);
  }
}
