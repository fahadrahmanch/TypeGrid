export interface IAuthUseCase {
  execute(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<void>;
}
