
export interface IRejectChallengeUseCase {
    execute(challengeId: string): Promise<void>;
}