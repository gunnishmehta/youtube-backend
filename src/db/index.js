import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';


const connectDB = async()=>{
    try {
        const connectionInsance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

        console.log(connectionInsance.connection.host);
    } catch (error) {
        console.log("MongoDB connection Failed: ",error);
        process.exit(1);
    }
};

export default connectDB;