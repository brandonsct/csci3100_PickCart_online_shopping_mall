const { ObjectId } = require("bson");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const EventSchema = new Schema({
  eventId: {
    type: Number,
    required: [true, "eventId is required"],
    unique: true,
  },
  //titlee
  title: {
    type: String,
    required: true,
  },
  //venueid
  venue: {
    type: Number,
    required: [true, "venue is required"],
  },

  //predatee
  dateTime: {
    type: String,
    required: true,
  },
  //desce
  desc: {
    type: String,
    required: true,
  },
  //presentere
  presenter: {
    type: String,
    required: true,
  },
  //pricee
  price: {
    type: String,
    required: true,
  },
});

const VenueSchema = new Schema({
  venueId: {
    type: Number,
    required: [true, "venueId is required"],
    unique: true,
  },
  //venue
  venueName: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  long: {
    type: Number,
    required: true,
  },
  lut: {
    type: Array,
    required: true,
  },
});

const CommentSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "login",
    required: true,
  },
  venueId: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const LoginSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  invitations: { type: [Schema.Types.ObjectId], ref: "Invite", default: [] },
  role: {type: String, enum: ['admin', 'user'], required: true, default: "user"}, 
  fav: {type: Array, required: true, default:[]}

});

const InviteSchema = new Schema({
  eventId: { type: Number, required: true, unique: true },
  event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  users: { type: [Schema.Types.ObjectId], ref: "login", default: [] },
});

const FavVenueSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "login" },
  venue: { type: Schema.Types.ObjectId, ref: "venue" },
});

exports.EventSchema = EventSchema;
exports.LoginSchema = LoginSchema;
exports.CommentSchema = CommentSchema;
exports.VenueSchema = VenueSchema;
exports.InviteSchema = InviteSchema;
exports.FavVenueSchema = FavVenueSchema;
