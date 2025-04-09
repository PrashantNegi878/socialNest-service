const express = require("express");
const { authMiddleware } = require("../middleware/auth");

const profileRouter = express.Router();

profileRouter.get("/", authMiddleware, async (req, res) => {
  try {
    res.status(200).send("Profile Page");
  } catch (err) {
    res.status(500).send(`Unexpected error occured : ${err.message}`);
  }
});
profileRouter.get("/edit", authMiddleware, async (req, res) => {
  try {
    res.status(200).send("Profile Page");
  } catch (err) {
    res.status(500).send(`Unexpected error occured : ${err.message}`);
  }
});

module.exports = profileRouter;
