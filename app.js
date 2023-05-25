import dotenv from 'dotenv'
import express from "express";
import path from "path";
import logger from "morgan";

import connectDb from "./config/mongoose/connectDb.js";
import userindex from "./routers/userRoute.js";
import adminindex from "./routers/adminRoute.js";

const app = express();
app.use(logger("dev"));

app.set("view engine", "ejs");
const __dirname = path.resolve();

// Router
connectDb()
log
dotenv.config()
app.use("/", userindex);
app.use("/admin", adminindex);
app.use(express.static(__dirname + "/assets"));

const port = process.env.PORT
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
