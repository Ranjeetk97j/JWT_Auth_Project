import mongoose from "mongoose";

const connectDB = async (DATABASE_URL) =>{
    try{
        const OPTION_DB = {
            dbName : 'JWT_DB',
        }
        await mongoose.connect(DATABASE_URL,OPTION_DB);
        console.log('Connected Successfully...');

    }catch(err){
        console.log(err);
    }
}

export default connectDB;