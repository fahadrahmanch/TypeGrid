export interface IDeleteContestUseCase {
  delete(contest: string): Promise<void>;
}
