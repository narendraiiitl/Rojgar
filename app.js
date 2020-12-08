const express = require("express");
const app = express();
const morgan = require("morgan");
const createError = require("http-errors");
const dotenv = require("dotenv");
const authroutes = require("./routes/Authenticate");
const apiroutes = require("./routes/Api");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require('cors')
const { verifyAccessToken } = require("./helper/JWT_helper");
require('./helper/Passport_setup');
dotenv.config();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(passport.initialize());
app.get("/", async (req, res, next) => {
  try {
    res.send("hello from exress");
  } catch (error) {
    next(err);
  }
});
app.get("/secret", verifyAccessToken, async (req, res, next) => {
  try {
    res.send("hello from the secret page");
    console.log(req.payload);
  } catch (err) {
    console.log(err.message);
    next(createError(err));
  }
});
app.use("/auth", authroutes);

app.use("/api", apiroutes);

app.use(async (req, res, next) => {
  next(createError.NotFound("this route doesnot exist"));
});

app.listen(process.env.port, () => {
  console.log(`listening on port ${process.env.port}`);
});
