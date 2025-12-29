import { CompanyReApplyDTO } from "../../../../application/DTOs/user/CompanyReApplyDTO"
export interface ICompanyReApplyUseCase{
    execute(data:CompanyReApplyDTO):Promise<void>
}