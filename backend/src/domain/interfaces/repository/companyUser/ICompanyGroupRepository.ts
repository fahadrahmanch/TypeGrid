export interface ICompanyGroupRepository<T> {
  getGroup(userId: string): Promise<T[] | null>;
}
