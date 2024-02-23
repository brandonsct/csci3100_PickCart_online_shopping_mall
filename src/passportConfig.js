const mongoose = require("mongoose");
const LoginSchema = require("./schemas.js").LoginSchema;
const LoginModel = mongoose.model("login", LoginSchema);
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
  passport.use(
    new localStrategy((username, password, done) => {
      LoginModel.findOne({ username: username })
        .then((user) => {
          if (!user) {
            console.log("user not found")
            return done(null, false);}
          return bcrypt.compare(password, user.password).then((result) => {
            if (result) {
              return done(null, user);
            } else {
              console.log("pw not match")
              return done(null, false);
            }
          });
        })
        .catch((err) => {
          throw err;
        });
    })
  );

  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });
  passport.deserializeUser((id, cb) => {
    console.log("deserialize");
    LoginModel.findOne({ _id: id })
      .then((user) => {
        const userInformation = {
          username: user.username,
          role: user.role
        };
        cb(null, userInformation);
      })
      .catch((err) => {
        cb(err);
      });
  });
};
