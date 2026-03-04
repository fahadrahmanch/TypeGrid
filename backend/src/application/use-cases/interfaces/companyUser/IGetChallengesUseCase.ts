import { ChallengeDTO } from "../../../DTOs/companyUser/challengeDTO"
export interface IGetChallengesUseCase{
    execute(userId:string):Promise<ChallengeDTO[]>
}