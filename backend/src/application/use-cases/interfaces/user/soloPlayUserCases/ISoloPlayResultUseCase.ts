
export interface ISoloPlayResultUseCase{
    execute(userId:string,gameId:string,result:any):Promise<void>
}