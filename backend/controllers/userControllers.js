const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } }, //case insensitive
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  //console.log(keyword,'search keyword'); //{} 
  //user id from protect MW
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }); 
  //not including the logged in user
  //console.log(users, 'matching search users');
  res.send(users);
});

//@description     Auth/login the user
//@route           POST /api/user/login
//@access          Public

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  //console.log('login user', user)

  if (user && (await user.matchPassword(password))) {
    //instance method available on docs of certain collection

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

//@description     Register new user
//@route           POST /api/user/
//@access          Public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all the Feilds");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password, //mongoose mw to encrypt it before saving(creating) this doc in db//pre-save hook MW
  });

  //console.log("created user on signup",user)

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

module.exports = { registerUser, authUser, allUsers };
