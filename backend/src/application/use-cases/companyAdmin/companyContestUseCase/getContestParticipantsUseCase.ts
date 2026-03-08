import { IContestRepository } from "../../../../domain/interfaces/repository/company/IContestRepository";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/IUserRepository";
import { IGetContestParticipantsUseCase } from "../../interfaces/companyAdmin/IGetContestParticipantsUseCase";
import { MESSAGES } from "../../../../domain/constants/messages";
import { ParticipantsDTO } from "../../../DTOs/companyAdmin/CompanyContestDTO";
export class getContestParticipantsUseCase implements IGetContestParticipantsUseCase {
  constructor(
    private contestRepository: IContestRepository,
    private userRepository: IUserRepository,
  ) {}
  async execute(contestId: string, userId: string): Promise<ParticipantsDTO[]> {
    const contest = await this.contestRepository.findById(contestId);
    if (!contest) {
      throw new Error(MESSAGES.CONTEST_NOT_FOUND);
    }
    let participants = await Promise.all(
      (contest as any).participants.map(async (item: any) => {
        const user = await this.userRepository.findById(item);
        return {
          name: (user as any).name,
          email: (user as any).email,
        };
      }),
    );

    return participants;
  }
}
