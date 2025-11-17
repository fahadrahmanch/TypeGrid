import { ObjectId } from "mongoose";
export interface ITokenService{
    generateAccessToken(_id:ObjectId):Promise<string>
    generateRefreshToken(_id:ObjectId):Promise<string>
}