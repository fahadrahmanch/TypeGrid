import { ObjectId } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  imageUrl?: string;
  password?: string;
  bio?: string;
  age?: string;
  number?: string;
  CompanyId?: string | ObjectId;
  CompanyRole?: string;
  KeyBoardLayout?: string;
  status?: string;
  contactNumber?: number;
  role?: string;
}
