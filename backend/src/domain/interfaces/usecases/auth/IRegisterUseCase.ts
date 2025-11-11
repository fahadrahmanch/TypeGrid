export interface IRegisterUseCase{
  createUser(data: { name: string; email: string; password: string }): Promise<void>;
}

