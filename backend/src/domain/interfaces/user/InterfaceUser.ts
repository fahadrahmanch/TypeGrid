import { ObjectId } from "mongoose";

export interface InterfaceUser {
    name: string;
    email: string;
    imageUrl?: string;
    password?: string;
    bio?: string;
    age?: number;
    CompanyId?: string | ObjectId;  
    CompanyRole?: string;
    KeyBoardLayout?: string;
    status?: string;
    contactNumber?: number;
    role?: string;
}
