import { Entity } from "./entity";
import { ObjectId } from "mongoose";
export class userEntity extends Entity<userEntity>{
    _id?:ObjectId
    name!:string;
    email!: string;
    imageUrl?:string;
    bio?:string;
    age?:number;
    CompanyId?:ObjectId;
    CompanyRole?:string;
    KeyBoardLayout!:"QWERTY"|"AZERTY"|"DVORAK";
    status?: "active" | "block";
    contactNumber?:number; 
    role!:"user"|"admin"|"companyUser"|"companyAdmin";

   
}