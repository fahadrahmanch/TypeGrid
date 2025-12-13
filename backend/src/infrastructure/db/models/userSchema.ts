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
    default: "https://res.cloudinary.com/demo/image/upload/v1690000000/default-profile.jpg",
    required:false
},
number:{
    type:String,
    required:false,
    default:null
},
CompanyId:{
    type: Schema.Types.ObjectId,
      ref: "Company",   
      required: false,
      default:null
},
bio:{
    type:String,
    required:false,
    default:null,
},
age:{
    type:String,
    require:false,
    default:null
},
CompanyRole:{
    type:String,
    required:false,
    default:null,
},
gender:{
    type:String,
    require:false,
    default:null
},
KeyBoardLayout:{
    type:String,
    required:true,
    default:"QWERTY"
},
status:{
    type:String,
    required:false,
    default:"active"
},
googleId: {
    type: String,
    required: false,
    default: null,
},
role:{
    type:String,
    required:true,
    default:"user"
}

}); 
export const User= mongoose.model<AuthUserEntity>("user",userSchema);