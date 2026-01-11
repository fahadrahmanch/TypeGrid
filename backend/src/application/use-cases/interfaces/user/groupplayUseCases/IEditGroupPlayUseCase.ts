export interface IEditGroupPlayUseCase{
    execute(difficulty:string,maxPlayers:number):Promise<void>
}