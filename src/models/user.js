const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {jwtSecret} = require("../const");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      validate(val) {
        if (!validator.isEmail(val))
          throw new Error("Not a valid email : " + val);
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum :{
        values: ["M", "F", "Others"],
        message: "{VALUE} is not a valid value"
      }
      // validate(val) {
      //   if (!["M", "F", "Others"].includes(val))
      //     throw new Error("Not a Valid Gender, can be either M, F or Others");
      // },
    },
    photoUrl: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png",
      validate(val) {
        if (!validator.isURL(val)) throw new Error("Not a valid URL : " + val);
      },
    },
    about: {
      type: String,
      default: "Add info about you here",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  return await jwt.sign({ userId: this._id }, jwtSecret,{expiresIn: "7d"});
};

userSchema.methods.validatePassword =async function (hasedPassword) {
  return await bcrypt.compare(hasedPassword, this.password);;
}

const User = mongoose.model("User", userSchema);
module.exports = User;
