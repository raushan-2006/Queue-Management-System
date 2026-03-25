const mongoose = require("mongoose");

const queueSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    currentToken: {
      type: Number,
      default: 0,
    },
    lastIssuedToken: {
      type: Number,
      default: 0,
    },
    averageServiceTime: {
      type: Number,
      default: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Queue", queueSchema);