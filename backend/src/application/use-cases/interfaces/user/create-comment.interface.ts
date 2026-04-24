export interface ICreateCommentUseCase {
  execute(userId: string, discussionId: string, content: string): Promise<void>;
}
