import mongoose,{Schema} from "mongoose";
import { AuthUserEntity } from "../../../domain/entities";
const userSchema:mongoose.Schema=new Schema<AuthUserEntity>({
name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
password:{
    type:String,
    required:false
},
imageUrl:{
    type:String,
    // default: 'https://res.cloudinary.com/demo/image/upload/v1690000000/default-profile.jpg',
    required:false
},
CompanyId:{
    type:String,
    default:null,
    required:false
},
bio:{
    type:String,
    required:false
},
CompanyRole:{
    type:String,
    required:false,
    default:null,
},
KeyBoardLayout:{
    type:String,
    required:true,
    default:"QWERTY"
},
status:{
    type:String,
    required:false,
    default:"Active"
},
googleId: {
    type: String,
    required: false,
    default: null,
},
role:{
    type:String,
    required:false,
}

});
export const User= mongoose.model<AuthUserEntity>("user",userSchema);