export interface IAcceptChallengeUseCase {
  execute(challengeId: string): Promise<void>;
}
