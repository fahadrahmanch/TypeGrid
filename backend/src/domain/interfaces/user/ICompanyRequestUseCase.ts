export interface ICompanyRequestUseCase{
    execute(companyName:string,address:string,email:string,number:string):Promise<void>
}