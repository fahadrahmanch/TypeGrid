import { IContestDocument } from "../../../../infrastructure/db/types/documents";
export interface IContestRepository<IContestDocument> {
  getGroupContests(groupsId: string[]): Promise<any>;
  isJoined(contestId: string, userId: string): Promise<any>;
}
