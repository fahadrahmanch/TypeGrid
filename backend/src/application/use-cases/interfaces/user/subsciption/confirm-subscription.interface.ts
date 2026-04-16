export interface IConfirmSubscriptionUseCase {
  execute(userId: string, planId: string): Promise<void>;
}
