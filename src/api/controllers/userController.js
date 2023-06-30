const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const saltRounds = 10; 

async function hashPassword(password) {
    return await bcrypt.hash(password, saltRounds);
}

async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

exports.userRegister = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const hashedPassword = await hashPassword(password);
      
      console.log(email, hashedPassword)
      const newUser = await User.create({
        email,
        password: hashedPassword
      });
      
      const accessToken = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
        expiresIn: "30 days"
      });
      
      await newUser.update({ accessToken });
      
      res.json({
        data: newUser,
        message: 'You have signed up successfully'
      });
    } catch (error) {
      next(error);
    }
  }
  

exports.userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return next(new Error('Email does not exist'));
        const validPassword = await validatePassword(password, user.password);
        if (!validPassword) return next(new Error('Password is not correct'));
        const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
            expiresIn: "30 days"
        });
        await User.update({ accessToken }, { where: { id: user.id } });
        res.status(200).json({
            data: { email: user.email },
            accessToken
        })
    } catch (error) {
        next(error);
    }
}

exports.allowIfLoggedin = async (req, res, next) => {
    try {
        const user = res.locals.loggedInUser;
        if (!user)
            return res.status(401).json({
                error: "You need to be logged in to access this route"
            });
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}
