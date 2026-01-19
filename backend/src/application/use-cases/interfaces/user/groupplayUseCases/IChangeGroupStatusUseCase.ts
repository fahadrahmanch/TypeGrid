export interface IChangeGroupStatusUseCase{
    changeGroupStatus(groupId:string,status:string):Promise<void>
}