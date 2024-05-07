const User = require("../models/User");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "name, email and password are required",
      });
    }

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    user = await User.create({
      name,
      email,
      password,
    });

    cookieToken(user, res);
  } catch (err) {
    res.status(500).json({
      message: "internal server error",
      error: err,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "email and password are required",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }

    const isMatch = await user.isValidatedPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect password",
      });
    }

    cookieToken(user, res);
  } catch (err) {
    res.status(500).json({
      message: "internal server error",
      error: err,
    });
  }
};
