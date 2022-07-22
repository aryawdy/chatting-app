const Message = require("../models/messageModel");

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Message.create({
      message,
      users: [from, to],
      sender: from,
    });
    if (data) return res.json({ msg: "Message addedd successfully" });
    return res.json({ msg: "Failed to add message to the database" });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await Message.find({ users: { $all: [from, to] } }).sort({
      updatedAt: 1,
    });
    const projectMessages = messages.map((el) => {
      return {
        fromSelf: el.sender.toString() === from,
        message: el.message,
      };
    });
    res.json(projectMessages);
  } catch (err) {
    next(err);
  }
};
