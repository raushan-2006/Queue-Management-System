const Token = require("../models/Token");
const Queue = require("../models/Queue");


// 📌 BOOK TOKEN
exports.bookToken = async (req, res) => {
  try {
    if (req.user.role !== "patient") {
      return res.status(403).json({
        success: false,
        message: "Only patients can book appointments",
      });
    }

    const { queueId } = req.body;

    const queue = await Queue.findById(queueId).populate("doctor", "name specialization");

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Doctor queue not found",
      });
    }

    const tokenNumber = queue.lastIssuedToken + 1;

    const token = await Token.create({
      tokenNumber,
      user: req.user.id,
      queue: queueId,
      status: "waiting",
    });

    queue.lastIssuedToken = tokenNumber;
    await queue.save();

    res.status(201).json({
      success: true,
      message: "Appointment token booked successfully",
      token,
      doctor: queue.doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// 📌 GET TOKEN STATUS (MAIN PART YOU NEED 🔥)
exports.getTokenStatus = async (req, res) => {
  try {
    const { tokenId } = req.params;

    const token = await Token.findById(tokenId).populate("queue");

    if (!token) {
      return res.status(404).json({
        success: false,
        message: "Token not found",
      });
    }

    // 👇 count people ahead
    const peopleAhead = await Token.countDocuments({
      queue: token.queue._id,
      tokenNumber: { $lt: token.tokenNumber },
      status: "waiting",
    });

    // 👇 calculate waiting time
    const estimatedWait =
      peopleAhead * token.queue.averageServiceTime;

    // 👇 FINAL RESPONSE (IMPORTANT)
    res.status(200).json({
      success: true,
      tokenId: token._id,
      tokenNumber: token.tokenNumber,
      peopleAhead,
      estimatedWait,
      currentServing: token.queue.currentToken,
      serviceName: token.queue.serviceName,
      status: token.status,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// 📌 CALL NEXT TOKEN (ADMIN)
exports.callNextToken = async (req, res) => {
  try {
    const { queueId } = req.body;

    const queue = await Queue.findById(queueId);

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Queue not found",
      });
    }

    if (
      req.user.role === "doctor" &&
      queue.doctor.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only manage your own queue",
      });
    }

    const nextToken = await Token.findOne({
      queue: queueId,
      status: "waiting",
    }).sort({ tokenNumber: 1 });

    if (!nextToken) {
      return res.status(404).json({
        success: false,
        message: "No waiting patients",
      });
    }

    nextToken.status = "served";
    await nextToken.save();

    queue.currentToken = nextToken.tokenNumber;
    await queue.save();

    req.app.get("io").emit("queueUpdated", {
      queueId,
      tokenNumber: nextToken.tokenNumber,
    });

    res.status(200).json({
      success: true,
      message: "Next patient called",
      token: nextToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};