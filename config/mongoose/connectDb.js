import mongoose from "mongoose";


const uri = process.env.MONGODB;
function dbConnect() {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(uri)
    .then(console.log(`data base connected ${uri}`))
    .catch((err) => console.log(err));
}
export default dbConnect;
