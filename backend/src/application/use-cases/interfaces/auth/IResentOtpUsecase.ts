export interface IResentOtpUseCase{
execute(name:string,email:string):Promise<void>
}