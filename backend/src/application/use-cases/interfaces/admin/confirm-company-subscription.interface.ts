export interface IConfirmCompanySubscriptionUseCase {
  execute(userId: string, planId: string, providerTransactionId: string): Promise<void>;
}
