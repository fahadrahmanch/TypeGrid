export interface ISetKeyboardLayoutUseCase {
  execute(userId: string, keyboardLayout: string): Promise<void>;
}
