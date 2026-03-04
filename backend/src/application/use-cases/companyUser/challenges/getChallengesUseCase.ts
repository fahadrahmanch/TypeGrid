import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { IGetChallengesUseCase } from "../../interfaces/companyUser/IGetChallengesUseCase";
import { ChallengeDTO,mapChallengeToDTO } from "../../../DTOs/companyUser/challengeDTO";
export class getChallengesUseCase implements IGetChallengesUseCase{
    constructor(
        private _baseRepoChallange:IBaseRepository<any>,
        private _baseRepoUser:IBaseRepository<any>
    ){}
    async execute(userId: string): Promise<ChallengeDTO[]> {
        let sendChallanges=await this._baseRepoChallange.find({senderId:userId})
 if (sendChallanges.length) {
  sendChallanges = await Promise.all(
    sendChallanges.map(async (item) => {
      const opponent = await this._baseRepoUser.findById(item.receiverId)
      const type=item.status==='completed'?'completed':"sent"
      return {
        ...item,
        type,
        opponent
      }
    })
  )
}
        
        let receiveChallenges=await this._baseRepoChallange.find({receiverId:userId})
        if (receiveChallenges.length) {
  receiveChallenges = await Promise.all(
    receiveChallenges.map(async (item) => {
      const opponent = await this._baseRepoUser.findById(item.senderId)
      const type=item.status==='completed'?'completed':"received"
      return {
        ...item,
        type,
        opponent
      }
    })
  )
}
        const challenges=[...sendChallanges,...receiveChallenges]
  
        const mappedChallenges: ChallengeDTO[] = challenges.map((challenge: any) =>
                    mapChallengeToDTO(challenge)
                )
        return mappedChallenges
    }
}
