export interface ICreateReplyUseCase {
  execute(userId: string, commentId: string, content: string): Promise<void>;
}
