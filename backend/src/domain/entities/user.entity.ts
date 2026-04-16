import { Entity } from './entity';
export class UserEntity extends Entity<UserEntity> {
  _id?: string;
  name!: string;
  email!: string;
  imageUrl?: string;
  bio?: string;
  age?: string;
  number?: string;
  CompanyId?: string;
  CompanyRole?: string;
  KeyBoardLayout!: 'QWERTY' | 'AZERTY' | 'DVORAK';
  status?: 'active' | 'block';
  contactNumber?: number;
  gender?: string;
  googleId?: string | null;
  role!: 'user' | 'admin' | 'companyUser' | 'companyAdmin';
  createdAt?: Date;
}
