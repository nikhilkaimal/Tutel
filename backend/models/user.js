const mongoose = require('mongoose');
const { v1: uuidv1 } = require('uuid');
const crypto = require('crypto');
const { Buffer } = require('buffer');
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
  about: { type: String, trim: true },
  following: [{ type: ObjectId, ref: 'User' }],
  followers: [{ type: ObjectId, ref: 'User' }],
  hashed_password: {
    type: String,
    required: true,
  },
  salt: String,
  created: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
});

// virtual field
userSchema
  .virtual('password')
  .set(function (password) {
    // temp variable -> _password
    this._password = password;

    // generate timestamp
    this.salt = uuidv1();

    // encrypt
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// methods
userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
  encryptPassword: function (password) {
    if (!password) return 'no password';

    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return err;
    }
  },
};

module.exports = mongoose.model('User', userSchema);
