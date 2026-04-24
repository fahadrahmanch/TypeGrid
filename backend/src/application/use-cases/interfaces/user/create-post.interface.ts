export interface ICreatePostUseCase {
  execute(userId: string, data: { title: string; content: string }): Promise<void>;
}
