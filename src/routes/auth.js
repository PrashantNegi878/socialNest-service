const express = require("express");
const User = require("../models/user");
const admin = require("../utils/firebase");

const authRouter = express.Router();

authRouter.get("/signup", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  console.log(token);

  const decodedToken = await admin.auth().verifyIdToken(token);
  const user = await User.findOne({ emailId: decodedToken.email });
  console.log(user);
  if (user) {
    return res.status(400).json({message:"User already exists"});
  }
  console.log(decodedToken);

  try {
    const myUser = new User({
      firstName: decodedToken.name.split(" ")[0],
      lastName: decodedToken.name.split(" ")[1],
      emailId: decodedToken.email,
      photoUrl: decodedToken.picture,
    });
    await myUser.save();
    res.status(201).send({message: `User ${myUser.firstName} added`});
  } catch (err) {
    res.status(500).send({message :`Unexpected error occured : ${err.message}`});
  }
});

authRouter.get("/login", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({ emailId: decodedToken.email });

    if (!user) {
      return res.status(400).send({message :"User not found, try signing up"});
    }
    res.status(200).send({message :"Login Success"});
  } catch (err) {
    res.status(500).send({message :`Unexpected error occured : ${err.message}`});
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.status(200).send({message :"Logged Out"});
});

module.exports = authRouter;
