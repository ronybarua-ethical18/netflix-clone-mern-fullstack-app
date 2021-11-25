const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//register user
const registerUser = async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
  });
  try {
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

//login user
const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
      const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

      if (originalPassword !== req.body.password) {
        res.status(403).json("Wrong password or username");
      }
      const accessToken = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.SECRET_KEY,
        {
          expiresIn: "5d",
        }
      );
      const { password, ...info } = user._doc;

      res.status(200).json({
        message: "Login Successful",
        data: { ...info, accessToken },
      });
    } else {
      res.status(403).json("User does not exist");
    }
  } catch (error) {
    res.status(403).json("Authentication Error");
  }
};

//delete user
const deleteUser = async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted successfully");
    } catch (error) {
      res.status(500).json("Internal server error");
    }
  } else {
    res.status(403).json("You can delete only your account");
  }
};

//update user
const updateUser = async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString();
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json("Internal server error");
    }
  } else {
    res.status(403).json("You can update only your account");
  }
};

//get user
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...info } = user._doc;
    res.status(200).json(info);
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};

//get all user
const getAllUser = async (req, res) => {
  const query = req.query.new;
  if (req.user.isAdmin) {
    try {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(5)
        : await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json("Internal server error");
    }
  } else {
    res.status(403).json("You are not allowed to see all users");
  }
};

//get user stats
const getStats = async (req, res) => {
  const today = new Date();
  const lastYear = today.setFullYear(today.setFullYear() - 1);

  const monthsArray = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  try {
    const data = await User.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: {$sum: 1 },
        },
      },
    ]);

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json(error)
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  getStats,
  getAllUser,
  deleteUser,
  updateUser,
};
