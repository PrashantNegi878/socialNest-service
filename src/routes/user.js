const express = require("express");
const User = require("../models/user");
const { authMiddleware } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");


const userRouter = express.Router();

userRouter.get("/", async (req, res) => {
  const email = req.body.email;

  try {
    const result = await User.find({ emailId: email });
    if (result.length === 0) return res.status(400).send("No User Found");
    return res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Error occured while finding User", err.message);
  }
});

userRouter.get("/users", async (req, res) => {
  try {
    const result = await User.find({});
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send("Error occured while finding User", err.message);
  }
});

userRouter.delete("/", async (req, res) => {
  const userId = req.body.userId;
  try {
    const result = await User.findByIdAndDelete(userId);
    console.log(result);
    if (result === null) res.status(400).send("No User Found");
    else res.status(200).send(`Deleted User ${result.firstName} successfully`);
  } catch (err) {
    res.status(500).send("Error occured while deleting User" + err.message);
  }
});

userRouter.patch("/", async (req, res) => {
  const data = req.body;
  const userId = data.userId;
  try {
    const result = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
      returnDocument: "after",
    });
    console.log(result);
    if (result === null) res.status(400).send("No User Found");
    else res.status(200).send(`Updated User ${result.firstName} successfully`);
  } catch (err) {
    res.status(500).send("Error occured while updating User" + err.message);
  }
});

userRouter.get("/requests", authMiddleware, async (req, res) => {
  const userId = req.user._id;
  console.log(userId);

  try {
    const connectionRequests = await ConnectionRequestModel.find({
      to: userId,
      status: "interested",
    }).populate("from", ["firstName", "lastName", "photoUrl"]);
    if (connectionRequests === null) res.status(400).send("No User Found");
    else res.status(200).send({'requests':connectionRequests});
  } catch (err) {
    res.status(500).send("Error occured while finding Requests" + err.message);
  }
});

userRouter.get("/connections", authMiddleware, async (req, res) => {
  const userId = req.user._id;
  console.log(userId);

  try {
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { from: userId, status: "accepted" },
        { to: userId, status: "accepted" },
      ],
    })
      .populate("from", ["firstName", "lastName", "photoUrl"])
      .populate("to", ["firstName", "lastName", "photoUrl"]);
    if (connectionRequests === null) res.status(400).send("No User Found");

    let result = [];

    for (let connection of connectionRequests) {
      if (connection.from._id !== userId) result.push(connection.from);
      else if (connection.to._id !== userId) result.push(connection.to);
    }

    res.status(200).send({'connections' :result});
  } catch (err) {
    res.status(500).send({'message' : "Error occured while finding Requests" + err.message});
  }
});

userRouter.get("/feed", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 10 ? 10 : limit;

    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ from: userId }, { to: userId }],
    }).select(["from", "to"]);

    const hiddenUsers = new Set();

    for (let connection of connectionRequests) {
      hiddenUsers.add(connection.from.toString());
      hiddenUsers.add(connection.to.toString());
    }

    const feedUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddenUsers) } },
        { _id: { $ne: userId } },
      ],
    }).select(["firstName", "lastName", "photoUrl", "_id"]).skip(limit * (page - 1)).limit(limit);

    return res.status(200).send({ feedUsers: Array.from(feedUsers) });
  } catch (err) {
    res.status(500).send("Error occured with Feed api" + err.message);
  }
});

module.exports = userRouter;
