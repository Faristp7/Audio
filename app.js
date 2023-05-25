import dotenv from 'dotenv'
import express from "express";
import path from "path";
import logger from "morgan";
import bodyParser from 'body-parser';
import { check,validationResult } from 'express-validator'; 

import connectDb from "./config/mongoose/connectDb.js";
import userindex from "./routers/userRoute.js";
import adminindex from "./routers/adminRoute.js";

const app = express();
app.use(logger("dev"));

app.set("view engine", "ejs");
const __dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/assets"));

// database connect
connectDb()

//Routers
dotenv.config()
app.use("/", userindex);
app.use("/admin", adminindex);

const port = process.env.PORT
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
