export interface IApproveCompanyUseCase {
  execute(companyId: string): Promise<void>;
}
