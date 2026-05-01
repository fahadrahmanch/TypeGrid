import { CompanyReApplyDTO } from "../../../../application/DTOs/user/company-re-apply.dto";
export interface ICompanyReApplyUseCase {
  execute(data: CompanyReApplyDTO): Promise<void>;
}
