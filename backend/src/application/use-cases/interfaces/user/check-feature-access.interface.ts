export interface ICheckFeatureAccessUseCase {
    execute(userId: string, feature: string): Promise<boolean>;
}
