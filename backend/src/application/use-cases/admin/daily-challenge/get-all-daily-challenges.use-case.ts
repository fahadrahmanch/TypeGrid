import { IGetDailyAssignChallengesUseCase } from "../../interfaces/admin/get-daily-challenges.interface";
import { IDailyAssignChallengeRepository } from "../../../../domain/interfaces/repository/admin/daily-challenge-repository.interface";
import { DailyAssignChallengeResponseDTO } from "../../../DTOs/admin/daily-challenge.dto";
import { DailyAssignChallengeMapper } from "../../../mappers/admin/daily-assign-challenge.mapper";
import { IChallengeRepository } from "../../../../domain/interfaces/repository/admin/challenge-repository.interface";

export class GetDailyAssignChallengesUseCase implements IGetDailyAssignChallengesUseCase {
  constructor(
    private readonly _dailyAssignChallengeRepository: IDailyAssignChallengeRepository,
    private readonly _challengeRepository: IChallengeRepository
  ) {}

  async execute( date: string, page: number, limit: number) : Promise<{ dailyChallenges: DailyAssignChallengeResponseDTO[]; total: number }>{
    
    const { dailyChallenges, total } = await this._dailyAssignChallengeRepository.getDailyAssignChallenges(date, page, limit);
    const result = await Promise.all(
      dailyChallenges.map(async (dailyChallenge) => {
        const challenge = await this._challengeRepository.findById(dailyChallenge.getChallengeId());
        if(!challenge){
          throw new Error("Challenge not found");
        }
        return DailyAssignChallengeMapper({
          ...dailyChallenge.toObject(),
          challengeId: {
            _id: challenge.getId(),
            title: challenge.getTitle()
          }
        });
      })
    )
    return {dailyChallenges:result,total}
  }
}

