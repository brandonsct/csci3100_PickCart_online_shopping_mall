const { ObjectId } = require("bson");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const LoginSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], required: true, default: "user" },
  birthday: { type: Date, default: Date.now },
  cTime: { type: Date, default: Date.now }
});

const TokenSchema = new Schema({
  email: { type: String, required: true },
  token: { type: Number, required: true },
  expireAt: { type: Date, default: Date.now, index: { expires: 86400000 } }
})

exports.LoginSchema = LoginSchema;
exports.TokenSchema = TokenSchema;