const mongoose = require("mongoose");
require("../helper/Init_mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const { bool, boolean } = require("@hapi/joi");
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
  },
  googleID: {
    type: String,
  },
  username: {
    type: String,
  },
  firstname:{
    type:String
  },
  lastname:{
    type:String
  },
  bio:{
    type:String
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  pin: {
    type: String,
  },
  mobile: {
    type: String,
  },
  image:{
    type:String
  }
});
userSchema.pre("save", async function (next) {
  try {
    if (!this.password) return next();
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(this.password, salt);
    this.password = hashedpassword;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});
userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};
const user = mongoose.model("user", userSchema);
module.exports = user;
