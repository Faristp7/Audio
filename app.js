import 'dotenv/config';
import express from "express";
import path from "path";
import logger from "morgan";
import bodyParser from "body-parser";
import session from "express-session";
import MongoStore from "connect-mongo";

import connectDb from "./config/mongoose/connectDb.js";
import userindex from "./routers/userRoute.js";
import adminindex from "./routers/adminRoute.js";

const app = express();
app.use(logger("dev"));

app.set("view engine", "ejs");
const __dirname = path.resolve();

app.use(
  express.json({
    limit: "50mb",
  })
);

app.use(bodyParser.urlencoded({limit:"50mb" , extended: true }));
app.use(bodyParser.json());

// session
app.use(
  session({
    secret: "secrectkey",
    saveUninitialized: true,
    resave: false,
    // store: MongoStore.create({ mongoUrl: process.env.MONGODB }),
  })
);

app.use((req, res, next) => {
  res.header("Cache-Control", "no-cache, private, no-store, must-revalidate");
  next();
}); // to prevent back page

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/assets"));

// database connect
connectDb();

//Routers

app.use("/", userindex);
app.use("/admin", adminindex);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
