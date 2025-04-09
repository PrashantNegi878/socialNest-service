const jwt = require("jsonwebtoken");
const User = require("../models/user");
const admin = require("../utils/firebase");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);

    if (!token) {
      return res.status(401).send("Unauthorized Access");
    }
    const decodedToken = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({ emailId: decodedToken.email });

    console.log(user);
    if (!user) {
      return res.status(401).send("Unauthorized Access");
    }    
    
    req.user = user;

    next();
  } catch (err) {
    return res.status(401).send("Something went wrong : ", err.message);
  }
};

module.exports = { authMiddleware };
