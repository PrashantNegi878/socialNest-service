const express = require("express");
const mongoose = require("mongoose");
const { authMiddleware } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/send/:status/:to", authMiddleware, async (req, res) => {
  try {
    const from = req.user._id;
    const to = req.params.to;
    const status = req.params.status;

    const allowedStatus = ["interested", "ignored"];
    if (!allowedStatus.includes(status)) {
      throw new Error("Invalid Status");
    }

    const connectionRequest = new ConnectionRequest({
      from,
      to,
      status,
    });
    
    const isUserExists = await User.findById(to);
    if (!isUserExists) {
      throw new Error("User not found");
    }

    const isExistingRequest = await ConnectionRequest.findOne({ $or: [{ from, to }, { from: to, to: from }] });
    if (isExistingRequest) {
      throw new Error("Request already exists");
    }

    const data = await connectionRequest.save();

    res.status(201).send(status== "interested" ? "Request Sent" : "Request Ignored");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

requestRouter.post("/review/:status/:id", authMiddleware, async (req, res) => {
  try {
    const status = req.params.status;
    const id = req.params.id;

    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      throw new Error("Invalid Status");
    }

    const connectionRequest = await ConnectionRequest.findOne({_id:id , to:req.user.id, status: "interested"});
    if (!connectionRequest) {
      throw new Error("User not found");
    }
    connectionRequest.status = status;
    await connectionRequest.save();
    res.status(201).send(status== "accepted" ? "Request Accepted" : "Request Rejected");
  }
  catch (err) {
    res.status(400).send(err.message);}

  });

module.exports = requestRouter;
