export interface IFinishContestUseCase {
  execute(contestId: string, result: any[]): Promise<void>;
}
