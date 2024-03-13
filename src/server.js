const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const LoginSchema = require("./schemas.js").LoginSchema;
const LoginModel = mongoose.model("login", LoginSchema);
const TokenSchema = require("./schemas.js").TokenSchema;
const TokenModel = mongoose.model("token", TokenSchema);
const sendemail = require("./tokenSender.js")
require('dotenv').config();

const port = process.env.PORT || 3000;
const api_port = process.env.API_PORT || 8000;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: `http://localhost:${port}`, // <-- location of the react app were connecting to
    credentials: true,
  })
);
app.use(
  session({
    secret: "secretcode",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require("./passportConfig")(passport);

mongoose.connect(process.env.DB_URL); // put your own database link here

const db = mongoose.connection;
// Upon connection failure
db.on("error", console.error.bind(console, "Connection error:"));
// Upon opening the database successfully
db.once("open", function () {
  console.log("Connection is open... success");
});


app.get("/register", (req, res) => {
  res.send("Authenticated");
});

app.post("/sendemail", async (req, res) => {
  try {
    console.log("reqqq>>", req.body)
    const { formData: values } = req?.body;
    const token = sendemail(values.email)
    TokenModel.create({
      email: values.email,
      token: token
    })
      .then((user) => res.json(user))
      .catch((err) => res.json(err));
  } catch (error) {
    console.log("error>>", error);
    res.json(error);
  }
})

app.post("/checkotp", async (req, res) => {
  try {
    console.log("req>>", req.body)
    const { formData: values } = req?.body;
    const userotp = parseInt(values.otp)
    console.log(typeof(userotp))
    TokenModel.find({ token: userotp })
    .then((result) => {
      console.log("resultofot[]>>", result)
      if (result.length === 0) res.status(200).send(false);
      else res.status(200).send(true);
    })
    .catch(() => res.status(500).send("Internal Server error"));
  } catch (error) {
    console.log("error>>", error);
    res.json(error);
  }
})

app.get("/login", (req, res) => {
  res.status(403).send("login");
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    console.log("running");
    console.log("user", user);
    if (err) throw err;
    if (!user) res.status(403).send("Password or Username dont match");
    else {
      req.logIn(user, async (err) => {
        if (err) throw err;
        const currentTime = new Date();
        const timestamp =
          currentTime.getFullYear() +
          "/" +
          (currentTime.getMonth() + 1) +
          "/" +
          currentTime.getDate() +
          " " +
          currentTime.getHours() +
          ":" +
          currentTime.getMinutes();
        res.status(200).send({ user: req.user, timestamp: timestamp });
        console.log(req.user);
      });
    }
  })(req, res, next);
});

app.get("/user", (req, res) => {
  LoginModel.find({}).then((result) => {
    res.json(result);
  });
});

app.post("/userbyusername", (req, res) => {
  const user = req.body?.username || "";
  if (!user) {
    return req.status(500).send("User missing");
  }
  LoginModel.findOne({ username: user })
    .then((user) => {
      if (user) {
        const favValueArr = user.fav;
        console.log("Favorite value:", favValueArr);
        res.status(200).send(favValueArr);
      } else {
        console.log("User not found");
        return res.status(404).send("User missing");
      }
    })
    .catch((error) => {
      res.status(404).send("Error finding user:", error);
    });
});

app.post("/register", async (req, res) => {
  try {
    const { formData: values } = req.body;
    console.log("values>>", values);
    const username = values.username ? values.username : "";
    const email = values.email ? values.email : "";
    const password = values.password ? await bcrypt.hash(values.password, 10) : "";
    const role = values.role ? values.role : "user";
    console.log("username>> ", username);
    console.log("email>> ", email);
    console.log("password>> ", password);

    if (!username || !email || !password || !role) {
      return res.status(406).send("Field missing");
    }

    LoginModel.create({
      username: username,
      email: email,
      password: password,
      role: role,
    })
      .then((user) => res.json(user))
      .catch((err) => res.json(err));
  } catch (error) {
    console.log("error>>", error);
    res.json(error);
  }
});

app.delete("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).send("OK");
  });
});

app.get("/checkAuth", (req, res) => {
  res.set("Content-Type", "application/json");
  console.log("checking>>>");
  if (req.isAuthenticated()) {
    console.log("checkAuth");
    return res.status(200).send(req.user);
  }
  return res.status(403).send("Not Auth");
});

function checkAuth(req, res, next) {
  console.log("req.user>", req.user);
  console.log("req.isAuthenticated())>>", req.isAuthenticated());
  if (req.isAuthenticated()) {
    console.log("req.isAuthenticated>>", req.isAuthenticated);
    return next();
  }
  console.log("redirectted");
  res.redirect("/login");
}

app.get("/home", checkAuth, (req, res) => {
  res.send("Authenticated");
});

app.post("/checkemail", (req, res) => {
  console.log("req.body>>", req.body)
  const { formData: values } = req?.body;
  console.log("email>>", values.email)
  LoginModel.find({ email: values.email })
    .then((result) => {
      console.log("resultEmail>>", result)
      if (result.length === 0) res.status(200).send(false);
      else res.status(200).send(true);
    })
    .catch(() => res.status(500).send("Internal Server error"));
});

app.post("/checkusername", (req, res) => {
  const { formData: values } = req?.body;
  console.log("valeu.s", values.username)
  LoginModel.find({ username: values.username })
    .then((result) => {
      console.log("resultUser>>", result)
      if (result.length === 0) res.status(200).send(false);
      else res.status(200).send(true);
    })
    .catch(() => res.status(500).send("Internal Server error"));
});






// get users data
app.get("/admin/user", (req, res) => {
  LoginModel.find()
    .then((data) => {
      let users = data.map((item, idx) => {
        return { id: item._id, name: item.username, email: item.email, pw: item.password, fav: item.fav };
      });
      res.status(200);
      res.send(users);
    })
    .catch((err) => {
      console.log(err);
      res.status(406);
      res.send(err);
    });
});

// Delete User data
app.delete("/deleteuser/:username", (req, res) => {
  LoginModel.findOneAndDelete({ username: req.params["username"] })
    .then((data) => {
      if (data) {
        res.sendStatus(204);
      } else {
        res.setHeader("Content-Type", "text/plain");
        res.status(404).send("User was not found, no user was deleted.");
        console.log("User was not found, no user was deleted.");
      }
    })
    .catch((error) => {
      res.setHeader("Content-Type", "text/plain");
      res.status(500).send("Internal Server Error");
    });
});

// Update User Data
app.put("/updateuser/:id", async (req, res) => {
  let updatedData = req.body;

  if (!updatedData.username || !updatedData.password) {
    res.setHeader("Content-Type", "text/plain");
    res.status(400).send("Request body must include both username and password.");
    return;
  }
  //hash password
  const hashedPw = await bcrypt.hash(updatedData.password, 10);
  updatedData.password = hashedPw;

  LoginModel.findOneAndUpdate({ _id: req.params.id }, updatedData, { new: true })
    .then((data) => {
      if (data) {
        res.json(data);
      } else {
        res.setHeader("Content-Type", "text/plain");
        res.status(404).send("User not found.");
      }
    })
    .catch((error) => {
      res.setHeader("Content-Type", "text/plain");
      res.status(500).send("Internal Server Error");
      console.log(error);
    });
});


// listen to port 8000
const server = app.listen(api_port);
