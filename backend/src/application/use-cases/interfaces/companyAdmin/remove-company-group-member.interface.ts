export interface IRemoveCompanyGroupMemberUseCase {
  execute(groupId: string, memberId: string, adminUserId: string): Promise<void>;
}
