import mongoose from "mongoose";
export class connectDB{
    private DB_URL;
    constructor(){
    this.DB_URL=process.env.MONGO_URL||" ";
    console.log(this.DB_URL);
    }
    public async connectDatabase():Promise<void>{
    try{
    await mongoose.connect(this.DB_URL);
    console.log("connected db");
    }
    catch(err){
        console.error(err,"mongo db connection fail");
    }
    }

}