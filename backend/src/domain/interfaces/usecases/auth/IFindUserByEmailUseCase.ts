export interface IFindUserByemailUseCase{
    execute(userId: string):Promise<any>
}