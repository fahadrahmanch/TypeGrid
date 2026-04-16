import AuthUserEntity from '../../../../domain/entities/auth-user.entity';
import { AddUserDTO } from '../../../DTOs/companyAdmin/add-uset.dto';

export interface IAddUserUseCase {
  addUser(data: AddUserDTO): Promise<AuthUserEntity>;
}
