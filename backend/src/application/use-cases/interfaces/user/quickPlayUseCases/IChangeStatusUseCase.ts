export interface IChangeStatusUseCase {
  execute(competitionId: string, status: string): Promise<void>;
}   