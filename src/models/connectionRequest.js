const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  status: {
    type: String,
    enum: {
      values: ["ignored", "interested", "accepted", "rejected"],
      message: "{VALUE} is not a valid status",
    },
    default: "pending",
  },
});

connectionRequestSchema.pre("save", async function (next) {
  const connectionRequest = this;
  if (connectionRequest.from.equals(connectionRequest.to.toString())) {
    throw new Error("You cannot send request to yourself");
  }
  next();
});

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
