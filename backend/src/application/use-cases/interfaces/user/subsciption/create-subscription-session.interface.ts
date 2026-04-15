export interface ICreateSubscriptionSessionUseCase {
    execute(userId: string, planId: string): Promise<string>;
}
