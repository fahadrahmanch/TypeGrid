export interface IGetCompanyUseCase{
    execute(companyId:string):Promise<any>
}