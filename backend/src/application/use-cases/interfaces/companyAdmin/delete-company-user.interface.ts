export interface IDeleteCompanyUserUseCase {
  execute(companyUserId: string): Promise<void>;
}
