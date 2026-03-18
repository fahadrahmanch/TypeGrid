export interface IContestRepository {
  getGroupContests(groupsId: string[]): Promise<any>;
  isJoined(contestId: string, userId: string): Promise<any>;
}
