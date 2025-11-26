import { Entity } from "./entity";
export class userEntity extends Entity<userEntity>{
    _id?:string;
    name!:string;
    email!: string;
    imageUrl?:string;
    bio?:string;
    age?:number;
    CompanyId?:string;
    CompanyRole?:string;
    KeyBoardLayout!:"QWERTY"|"AZERTY"|"DVORAK";
    status?: "active" | "block";
    contactNumber?:number; 
    googleId?:string|null;
    role!:"user"|"admin"|"companyUser"|"companyAdmin";
}