const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    tokenNumber: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    queue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Queue",
      required: true,
    },
    status: {
      type: String,
      enum: ["waiting", "served", "skipped"],
      default: "waiting",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Token", tokenSchema);