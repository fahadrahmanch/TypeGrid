import { ObjectId } from "mongoose";
export class userEntity{
    _id?:ObjectId;
    name:string;
    email: string;
    imageUrl?:string
    password: string;
    bio?:string;
    age?:number;
    CompanyId?:ObjectId;
    CompanyRole?:string;
    KeyBoardLayout:'QWERTY'|'AZERTY'|'DVORAK';
    status?: "active" | "block";
    contactNumber?:number; 
    role:"user"|"admin"|"companyUser"|"companyAdmin";

    constructor(
        name:string,
        email:string,
        password:string,
        imageUrl?:string,
        contactNumber?:number,
        bio?:string,
        age?:number,
        CompanyId?:ObjectId,
        CompanyRole?:string,
        KeyBoardLayout:'QWERTY'|'AZERTY'|'DVORAK'='QWERTY',
        role:"user"|"admin"|"companyUser"|"companyAdmin"='user',
        status: "active" | "block"='active',
    ){
   
        this.name = name;
    this.email = email;
    this.password = password;
    this.imageUrl = imageUrl;
    this.contactNumber = contactNumber;
    this.bio = bio;
    this.age = age;
    this.CompanyId = CompanyId;
    this.CompanyRole = CompanyRole;
    this.KeyBoardLayout = KeyBoardLayout;
    this.role = role;
    this.status = status;
    }
   
}