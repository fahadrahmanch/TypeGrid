export interface ICreateNewPasswordUseCase{
    execute(email:string,password:string):Promise<void>
}