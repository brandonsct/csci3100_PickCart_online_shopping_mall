const { ObjectId } = require("bson");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const LoginSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: {type: String, enum: ['admin', 'user'], required: true, default: "user"}, 
});


exports.LoginSchema = LoginSchema;