export interface ISaveChallengeResultUseCase {
  execute(gameId: string, resultArray: any[]): Promise<void>;
}
