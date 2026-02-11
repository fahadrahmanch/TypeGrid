import { IBaseRepository } from "../../../domain/interfaces/repository/IBaseRepository";
import { IChangePasswordUseCase } from "../interfaces/user/IChangePasswordUseCase";
import { IHashService } from "../../../domain/interfaces/services/IHashService";

export class ChangePasswordUseCase implements IChangePasswordUseCase {
    constructor(
        private readonly baseUserRepository: IBaseRepository<any>,
        private readonly hashService: IHashService,
    ) {}

    async execute(userId: string, currentPassword: string, newPassword: string): Promise<void> {
        const user = await this.baseUserRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        console.log("userid",userId)
        console.log("currentPassword",currentPassword)
        console.log("newPassword",newPassword)

        const isPasswordValid = await this.hashService.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid current password');
        }

        const hashedPassword = await this.hashService.hash(newPassword);
        user.password = hashedPassword;
        await this.baseUserRepository.update(user);
    }
}