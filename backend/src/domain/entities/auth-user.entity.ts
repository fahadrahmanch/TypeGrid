import { UserEntity } from "./user.entity";
export default class AuthUserEntity extends UserEntity {
  password!: string;
  constructor(attrs?: Partial<AuthUserEntity>) {
    super(attrs);
  }
}
