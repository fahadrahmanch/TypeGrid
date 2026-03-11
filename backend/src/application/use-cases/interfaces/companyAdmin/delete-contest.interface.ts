export interface IDeleteContestUseCase {
  execute(contestId: string): Promise<void>;
}
