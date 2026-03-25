const Queue = require("../models/Queue");
const User = require("../models/User");

exports.createQueue = async (req, res) => {
  try {
    const { serviceName, doctorId, averageServiceTime } = req.body;

    if (!serviceName || !doctorId) {
      return res.status(400).json({
        success: false,
        message: "Service name and doctor are required",
      });
    }

    const doctor = await User.findById(doctorId);

    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({
        success: false,
        message: "Valid doctor not found",
      });
    }

    const queue = await Queue.create({
      serviceName,
      doctor: doctorId,
      averageServiceTime: averageServiceTime || 5,
    });

    res.status(201).json({
      success: true,
      message: "Doctor queue created successfully",
      queue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getQueues = async (req, res) => {
  try {
    const queues = await Queue.find()
      .populate("doctor", "name specialization email mobile")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      queues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteQueue = async (req, res) => {
  try {
    const { queueId } = req.params;

    const queue = await Queue.findById(queueId);

    if (!queue) {
      return res.status(404).json({
        success: false,
        message: "Queue not found",
      });
    }

    await Queue.findByIdAndDelete(queueId);

    res.status(200).json({
      success: true,
      message: "Queue deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};