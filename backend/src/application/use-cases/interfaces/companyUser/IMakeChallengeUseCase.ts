import { ChallengeDTO } from "../../../DTOs/companyUser/challengeDTO"
export interface IMakeChallengeUseCase{
    execute(senderId:string,receiverId:string):Promise<ChallengeDTO>
}