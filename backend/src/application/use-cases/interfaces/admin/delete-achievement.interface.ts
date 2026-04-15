export interface IDeleteAchievementUseCase {
  execute(id: string): Promise<void>;
}
