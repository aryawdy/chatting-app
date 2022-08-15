const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

module.exports.register = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      res.json({ message: "Username already used", status: false });
    }
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      res.json({ message: "Email already used", status: false });
    }
    const hashedPassword = await bcrypt.hash(password, 5);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { password, username } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      res.json({ message: "Incorrect username or password", status: false });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.json({ message: "Incorrect username or password", status: false });
    }
    delete user.password;
    return res.json({ status: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const avatarImage = req.body.image;
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { isAvatarImageSet: true, avatarImage }
    );
    return res.json({ isSet: user.isAvatarImageSet, image: user.avatarImage });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const users = await User.find({ _id: { $ne: userId } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (error) {
    next(error);
  }
};
