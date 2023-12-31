const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const saltRounds = 10;

const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

const validatePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

exports.userRegister = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await hashPassword(password);

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        message: 'Email already exists',
      });
    }

    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    const accessToken = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: '30 days',
    });

    await newUser.update({ accessToken });

    res.json({
      data: newUser,
      message: 'You have signed up successfully',
    });
  } catch (error) {
    next(error);
  }
};


exports.userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Email does not exist');
    }
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) {
      throw new Error('Password is not correct');
    }
    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30 days",
    });
    await User.update({ accessToken }, { where: { id: user.id } });
    res.status(200).json({
      data: { email: user.email },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

exports.allowIfLoggedin = (req, res, next) => {
  try {
    const user = res.locals.loggedInUser;
    if (!user) {
      return res.status(401).json({
        error: "You need to be logged in to access this route",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
