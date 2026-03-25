export interface IDeleteChallengeUseCase {
  execute(id: string): Promise<void>;
}
