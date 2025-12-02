export interface IGetCompanyUseCase{
    execute(companyId:string):Promise<void>
}