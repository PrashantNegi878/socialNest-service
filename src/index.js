const express = require("express");
const cookieParser = require("cookie-parser");
const connectDatabase = require("./config/database");
const { port } = require("./const");
const cors = require("cors");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

const app = express();

app.use(cors());

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);

connectDatabase()
  .then(() => {
    console.log("Connected to DB Successfully");
    app.listen(process.env.PORT, () => console.log("App Started"));
  })
  .catch((err) => {
    console.log("Failed to connect to DB : ", err);
  });
