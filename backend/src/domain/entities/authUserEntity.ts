import { userEntity } from "./userEntity";
export default class AuthUserEntity extends userEntity{
  password!: string;
  salt!: string;
    constructor(attrs?: Partial<AuthUserEntity>) {
    super(attrs);
  }
}