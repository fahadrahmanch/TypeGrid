
export interface IUpdateCompanyContestStatusUseCase{
    execute(contestId:string,status:string):Promise<void>
}