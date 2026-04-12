export interface IDeleteCompanyGroupUseCase {
  execute(groupId: string, adminUserId: string): Promise<void>;
}
