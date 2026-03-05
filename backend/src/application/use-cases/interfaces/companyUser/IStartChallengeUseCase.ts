
export interface IStartChallengeUseCase{
    execute(challengeId:string):Promise<void>
}