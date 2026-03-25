export interface IDeleteGoalUseCase {
  execute(id: string): Promise<void>;
}
