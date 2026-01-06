export interface IAuthUseCase{
  createUser(data: { name: string; email: string; password: string }): Promise<void>;
}

