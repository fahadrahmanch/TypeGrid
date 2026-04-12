export interface IUpdateCompanyPasswordUseCase {
  execute(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void>;
}
