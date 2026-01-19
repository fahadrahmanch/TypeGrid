export interface ICompanyApproveRejectUsecase{
    approve(companyId:string):Promise<void>
    reject(companyId:string,rejectionReason:string):Promise<void>
}