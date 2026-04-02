export interface ILeaveQuickPlayUseCase {
  execute(competitionId: string, userId: string): Promise<void>;
}
