import {DB_Name} from "../constant.js"
import mongoose from "mongoose";
const connectdb = async()=>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_Name}`);
        console.log(`MONGODB connected at ${connectionInstance.connection.host}`)
    }
    catch(err){
        console.log("Mongodb connection failed",err)
        process.exit(1)
    }
}
export default connectdb;