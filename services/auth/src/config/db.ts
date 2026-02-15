import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string,{
            dbName: "Zomato_Clone",
        });

        console.log("connect to maongoDB");
    } catch (error) {
        console.log(error);
    }
};

export default connectDB;