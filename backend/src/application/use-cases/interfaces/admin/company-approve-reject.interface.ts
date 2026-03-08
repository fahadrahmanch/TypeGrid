export interface ICompanyApproveRejectUseCase {
  approve(companyId: string): Promise<void>;
  reject(companyId: string, rejectionReason: string): Promise<void>;
}
