import express from "express";
import path from "path";
import logger from "morgan";
import userindex from "./routers/userRoute.js";
import adminindex from "./routers/adminRoute.js";

const app = express();
app.use(logger('dev'));

app.set("view engine", "ejs");
const __dirname = path.resolve();

app.use("/", userindex);
app.use("/admin", adminindex);
app.use(express.static(__dirname + "/assets"));

app.listen(3000, () => {
  console.log("http://localhost:3000/");
});
