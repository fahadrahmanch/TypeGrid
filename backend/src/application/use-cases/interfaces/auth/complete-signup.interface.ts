export interface ICompleteSignupUseCase {
  execute(
    otp: string,
    name: string,
    email: string,
    password: string,
  ): Promise<void>;
}
