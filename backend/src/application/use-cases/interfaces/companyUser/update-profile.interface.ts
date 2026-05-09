export interface IUpdateProfileUseCase {
  execute(userId: string, data: any): Promise<void>;
}
