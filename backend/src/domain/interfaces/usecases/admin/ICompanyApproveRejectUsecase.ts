export interface ICompanyApproveRejectUsecase{
    approve(companyId:string):Promise<void>
    reject(companyId:string):Promise<void>
}