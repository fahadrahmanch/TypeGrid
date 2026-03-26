
export interface IDailyChallengeFinishedUseCase {
    execute(userId: string, wpm: number, accuracy: number): Promise<void>;
}