
export interface IConfirmCompanySubscriptionUseCase {
    execute(userId: string, planId: string): Promise<void>;
}