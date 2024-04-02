const { ObjectId } = require("bson");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const { v4: uuidv4 } = require("uuid");

const LoginSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "user"],
    required: true,
    default: "user",
  },
  firstname: { type: String, required: false, default: "" },
  lastname: { type: String, required: false, default: "" },
  avatar: { type: String, required: false, default: "" },
  birthday: { type: Date, default: Date.now },
  cTime: { type: Date, default: Date.now },
});

const TokenSchema = new Schema({
  email: { type: String, required: true },
  token: { type: Number, required: true },
  expireAt: { type: Date, default: Date.now, index: { expires: 86400000 } },
});

const ProductSchema = new Schema({
  description: String,
  price: Number,
  imgSrc: String,
  category: String,
  stock: Number,
  productName: String,
  productId: String,
});

const CartSchema = new Schema({
  userID: String,
  cart: [ProductSchema],
});
exports.LoginSchema = LoginSchema;
exports.TokenSchema = TokenSchema;
exports.ProductSchema = ProductSchema;
exports.CartSchema = CartSchema;
