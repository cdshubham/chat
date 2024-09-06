import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    return await mongoose
      .connect
      //`YOUR MONGODB CONNECTION STRING HERE`
      ();
  } catch (err) {
    console.log("Error Connecting to Mongodb", err);
  }
};

export default connectToMongoDB;
