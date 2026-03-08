export interface IContestRepository<T> {
  getGroupContests(groupsId: string[]): Promise<any>;
  isJoined(contestId: string, userId: string): Promise<any>;
}
