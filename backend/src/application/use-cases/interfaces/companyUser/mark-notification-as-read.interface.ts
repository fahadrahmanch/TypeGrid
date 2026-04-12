export interface IMarkNotificationAsReadUseCase {
  execute(receiptId: string): Promise<void>;
}
