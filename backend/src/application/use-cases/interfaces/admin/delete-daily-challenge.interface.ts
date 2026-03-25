export interface IDeleteDailyAssignChallengeUseCase {
  execute(id: string): Promise<void>;
}
