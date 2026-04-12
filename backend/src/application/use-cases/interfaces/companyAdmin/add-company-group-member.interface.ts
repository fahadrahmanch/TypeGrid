export interface IAddCompanyGroupMemberUseCase {
  execute(groupId: string, memberId: string, adminUserId: string): Promise<void>;
}
