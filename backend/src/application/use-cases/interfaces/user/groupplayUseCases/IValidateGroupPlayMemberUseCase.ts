export interface IValidateGroupPlayMemberUseCase {
  execute(groupId: string, userId: string): Promise<boolean>;
}
