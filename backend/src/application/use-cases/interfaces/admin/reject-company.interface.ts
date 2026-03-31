export interface IRejectCompanyUseCase {
  execute(companyId: string, rejectionReason: string): Promise<void>;
}
