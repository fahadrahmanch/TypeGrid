export interface IConfirmSubscriptionUseCase {
  execute(userId: string, planId: string, providerTransactionId: string): Promise<void>;
}
