import express from "express";
import path from "path";
import userindex from "./routers/userRoute.js";

const app = express();

app.set("view engine", "ejs");
const __dirname = path.resolve();

app.use("/", userindex);
app.use(express.static(__dirname + "/assets"));


app.listen(3000, () => {
  console.log("http://localhost:3000/");
});
