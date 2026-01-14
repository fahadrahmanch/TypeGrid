export interface IJoinGroupPlayGroupUseCase{
    execute(joinLink:string,userId:string):Promise<void>
}