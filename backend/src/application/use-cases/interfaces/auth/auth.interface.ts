export interface IAuthUseCase {
  execute(data: { name: string; email: string }): Promise<void>;
}
