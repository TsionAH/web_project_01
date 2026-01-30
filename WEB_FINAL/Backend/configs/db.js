import mongoose from "mongoose";

const connectDB = async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URL}/aau_social`)

    }
    catch (error) {
        console.log(error.message)

        
    }
}
export default connectDB;