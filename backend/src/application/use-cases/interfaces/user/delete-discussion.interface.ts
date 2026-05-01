export interface IDeleteDiscussionUseCase {
  execute(discussionId: string): Promise<void>;
}
