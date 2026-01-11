import { userEntity } from "./UserEntity";
export default class AuthUserEntity extends userEntity{
  password!: string;
    constructor(attrs?: Partial<AuthUserEntity>) {
    super(attrs);
  }
}