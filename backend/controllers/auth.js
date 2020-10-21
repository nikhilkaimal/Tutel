const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

require('dotenv').config();

const User = require('../models/user');

exports.signup = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });

  if (userExists)
    return res.status(403).json({
      error: 'email taken',
    });

  const user = await new User(req.body);

  await user.save();

  res.status(200).json({ message: 'signup successful' });
};

exports.signin = (req, res) => {
  // find user
  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    // error or no user
    if (err || !user)
      return res.status(401).json({
        error: 'user with that email does not exist',
      });

    // if user, check email and password
    if (!user.authenticate(password))
      return res.status(401).json({
        error: 'email and password do not match',
      });

    // generate token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    // persist token in cookie
    res.cookie('token', token, { expire: new Date() + 9999 });

    // return res with user and token
    const { _id, name, email } = user;

    return res.json({ token, user: { _id, name, email } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'signout successful' });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  userProperty: 'auth',
});
