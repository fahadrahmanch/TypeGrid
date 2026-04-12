import { IUserRepository } from "../../../domain/interfaces/repository/user/user-repository.interface";
import { ISetKeyboardLayoutUseCase } from "../interfaces/companyUser/set-keyboard-layout.interface";

export class SetKeyboardLayoutUseCase implements ISetKeyboardLayoutUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string, keyboardLayout: string): Promise<void> {
    
    console.log("keyboard layout", keyboardLayout);
    await this.userRepository.updateById(userId, { KeyBoardLayout: keyboardLayout });
  }
}
