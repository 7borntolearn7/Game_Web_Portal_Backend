const User = require("../Models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./.env" });
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ status: "RS_ERROR", message: "All fields are required" });
    }

    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).json({
        status: "RS_ERROR",
        message: "Invalid Username And Password",
      });
    }
    res.clearCookie("token");
    const payload = {
      username: user.username,
      id: user._id,
    };
    const token = jwt.sign(payload, process.env.JWT_Secret, {
      expiresIn: "20h",
    });
    user.token = token;
    user.password = undefined;

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    req.user = {
      username: user.username,
      id: user._id,
    };
    res.cookie("token", token, options).json({
      status: "RS_OK",
      message: "Login successful",
      user: user.username,
      email: user.email,
      isEnabled: user.isEnabled,
      id: user._id,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "RS_ERROR", message: "Internal Server Error" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { username, oldPassword, newPassword, confirmPassword } = req.body;

    if (!username || !oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        status: "RS_ERROR",
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        status: "RS_ERROR",
        message: "User not found",
      });
    }

    if (user.password !== oldPassword) {
      return res.status(401).json({
        status: "RS_ERROR",
        message: "Invalid old password",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: "RS_ERROR",
        message: "New password and confirm password do not match",
      });
    }

    user.password = newPassword;

    await user.save();

    res.json({
      status: "RS_OK",
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "RS_ERROR",
      message: "Internal Server Error",
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { email, username, password, isEnabled } = req.body;

    const existingEmailUser = await User.findOne({ email });
    if (existingEmailUser) {
      return res.status(409).json({
        status: "RS_ERROR",
        message: "Email already exists",
      });
    }

    const existingUsernameUser = await User.findOne({ username });
    if (existingUsernameUser) {
      return res.status(409).json({
        status: "RS_ERROR",
        message: "Username already exists",
      });
    }
    const newUser = new User({
      email,
      username,
      password,
      isEnabled,
      updated_by: req.user.username,
    });
    await newUser.save();

    res.json({
      status: "RS_OK",
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "RS_ERROR", message: "Internal Server Error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ status: "RS_OK", message: users });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "RS_ERROR", message: "Internal Server Error" });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ status: "RS_OK", message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "RS_ERROR", message: "Internal Server Error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, isEnabled, email } = req.body;

    const existingUserWithNewUsername = await User.findOne({ username });

    if (
      existingUserWithNewUsername &&
      existingUserWithNewUsername._id.toString() !== userId
    ) {
      return res.status(409).json({
        status: "RS_ERROR",
        message: "Username already exists",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username,
        isEnabled,
        email,
        updated_by: req.user.username,
        updated_at: Date.now(),
      },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ status: "RS_ERROR", message: "User not found" });
    }

    res.json({
      status: "RS_OK",
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "RS_ERROR", message: "Internal Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ status: "RS_ERROR", message: "User not found" });
    }

    res.json({
      status: "RS_OK",
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "RS_ERROR", message: "Internal Server Error" });
  }
};
