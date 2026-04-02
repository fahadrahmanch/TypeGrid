export interface IDeleteRewardUseCase {
  execute(id: string): Promise<void>;
}
