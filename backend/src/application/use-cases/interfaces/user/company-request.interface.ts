export interface ICompanyRequestUseCase {
  execute(
    OwnerId: string,
    companyName: string,
    address: string,
    email: string,
    number: string,
    planId: string,
    document: string
  ): Promise<void>;
}
