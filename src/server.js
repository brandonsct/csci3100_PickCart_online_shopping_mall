const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const EventSchema = require("./schemas.js").EventSchema;
const VenueSchema = require("./schemas.js").VenueSchema;
const CommentSchema = require("./schemas.js").CommentSchema;
const LoginSchema = require("./schemas.js").LoginSchema;
const InviteSchema = require("./schemas.js").InviteSchema;
const FavVenueSchema = require("./schemas.js").FavVenueSchema;
const LoginModel = mongoose.model("login", LoginSchema);
const fetchXML = require("./fetchXML.js");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000", // <-- location of the react app were connecting to
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

// mongoose.connect('mongodb://127.0.0.1:27017/project');
mongoose.connect("mongodb+srv://longchingkwok:kf5KCtNZsPkT90yx@cluster0.b7xmo7d.mongodb.net/"); // put your own database link here

const db = mongoose.connection;
// Upon connection failure
db.on("error", console.error.bind(console, "Connection error:"));
// Upon opening the database successfully
db.once("open", function () {
  console.log("Connection is open... success");
  app.get("/home", checkAuth, (req, res) => {
    res.send("Authenticated");
  });

  app.get("/register", (req, res) => {
    res.send("Authenticated");
  });

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
          const result = await fetchXML.getXML();
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

  app.get("/lcsdevents", async (req, res) => {
    try {
      const result = await fetchXML.getXML();
      console.log("runn>>");
      res.set("Content-Type", "application/json");
      res.send([result]);
    } catch (error) {
      console.log("error>>", error);
    }
  });

  app.post("/register", async (req, res) => {
    try {
      const { formData: values } = req.body;
      console.log("values>>", values);
      const username = values.username ? values.username : "";
      const email = "test@cuhk.edu.hk";
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

  app.get("/checkUsername", (req, res) => {
    LoginModel.find({})
      .then((result) => {
        const usernames = result.map((obj) => obj.username);
        console.log("usernames>>", usernames);
        res.status(200).send(usernames);
      })
      .catch(() => res.status(500).send("Internal Server error"));
  });
});

// app.get("/addroles", (req, res)=>{
//   LoginModel.updateMany({ role: { $exists: false } }, { $set: { role: 'admin' } })
//   .then((result=>console.log("result>>>", result)))
//   .catch((err)=>console.log("err>>>", err))
// })
// app.get ("/addFav", (req, res)=>{
//   LoginModel.updateMany({ fav: { $exists: false } }, { $set: { fav: [] } })
//     .then((result=>console.log("result>>>", result)))
//     .catch((err)=>console.log("err>>>", err))
// })

app.post("/addFavbyUser", async (req, res) => {
  const favlocid = req.body?.locid || "";
  const user = req.body?.username || "";
  if (!favlocid || !user) {
    return res.status(404).send("Field missing");
  }

  try {
    const loginDoc = await LoginModel.findOne({ username: user });

    if (!loginDoc) {
      return res.status(404).send("User not found");
    }

    const favArray = loginDoc.fav;

    if (favArray.includes(parseInt(favlocid))) {
      // Remove favlocid from fav array
      const updatedDoc = await LoginModel.findOneAndUpdate(
        { username: user },
        { $pull: { fav: parseInt(favlocid) } },
        { new: true }
      );
      res.status(201).send(updatedDoc);
    } else {
      // Add favlocid to fav array
      const updatedDoc = await LoginModel.findOneAndUpdate(
        { username: user },
        { $addToSet: { fav: parseInt(favlocid) } },
        { new: true }
      );
      res.status(201).send(updatedDoc);
    }
  } catch (err) {
    console.log("err>>", err);
    res.status(500).send(err);
  }
});

app.get("/ev/:eventId", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  Event.findOne({ eventId: req.params.id })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(404).send("No such event");
    });
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

const Event = mongoose.model("Event", EventSchema);
const Venue = mongoose.model("Venue", VenueSchema);
const Comment = mongoose.model("Comment", CommentSchema);
const Invite = mongoose.model("Invite", InviteSchema);
const FavVenue = mongoose.model("FavVenue", FavVenueSchema);
//Favorite venues
app.post("/venue/fav", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  const usrname = req.body.user;
  const venue = req.body.locid;

  LoginModel.findOne({ username: usrname })
    .then((userData) => {
      const userId = userData._id;
      Venue.findOne({ venueId: venue })
        .then((venueData) => {
          const venueId = venueData._id;
          FavVenue.findOne({ user: userId, venue: venueId })
            .then((favVenueData) => {
              if (favVenueData) {
                // Favorite venue already exists for the user
                res.status(409).send("Favorite venue already exists");
              } else {
                FavVenue.create({
                  user: userId,
                  venue: venueId,
                })
                  .then(() => {
                    res.status(200).send("Added to favorite venue");
                  })
                  .catch((err) => {
                    console.log(err);
                    res.status(500).send(err);
                  });
              }
            })
            .catch((err) => {
              console.log(err);
              res.status(500).send(err);
            });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send(err);
    });
});
//show favourite venue data
app.get("/venue/fav/:user", async (req, res) => {
  try {
    const username = req.params.user;
    // console.log(username);
    const userData = await LoginModel.findOne({ username });
    if (!userData) {
      return res.status(404).send("No Favourite");
    }

    const userId = userData._id;
    const data = await FavVenue.find({ user: userId });
    const favVenues = [];

    for (const item of data) {
      // console.log(item.venue);
      const venueData = await Venue.findById(item.venue);
      const count = await Event.countDocuments({ venue: venueData.venueId });
      favVenues.push({
        name: venueData.venueName,
        lat: venueData.lat,
        long: venueData.long,
        locid: venueData.venueId,
        eventCount: count,
      });
    }
    res.status(200).send(favVenues);
  } catch (err) {
    res.status(500).send(err);
  }
});
//delete favourite venue
app.delete("/venue/fav", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  const usrname = req.body.user;
  const venue = req.body.locid;

  LoginModel.findOne({ username: usrname })
    .then((userData) => {
      const userId = userData._id;
      Venue.findOne({ venueId: venue })
        .then((venueData) => {
          const venueId = venueData._id;
          FavVenue.findOneAndDelete({ user: userId, venue: venueId })
            .then((favVenueData) => {
              if (!favVenueData) {
                // Favorite venue does not exist for the user
                res.status(404).send("Favorite venue not found");
              } else {
                res.status(200).send("Removed from favorite venues");
              }
            })
            .catch((err) => {
              res.status(500).send(err);
            });
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

app.get("/venue/:venueId/ev", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log(req.params.venueId);
  Event.find({ venue: req.params.venueId })
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(404);
      res.send("Venue not found");
    });
});
//show all location data
app.get("/venue", async (req, res) => {
  try {
    const data = await Venue.find();
    const venues = [];

    for (const item of data) {
      const count = await Event.countDocuments({ venue: item.venueId });
      venues.push({
        name: item.venueName,
        lat: item.lat,
        long: item.long,
        locid: item.venueId,
        eventCount: count,
      });
    }

    res.status(200).send(venues);
  } catch (err) {
    console.log(err);
    res.status(406).send(err);
  }
});

//get venue details
app.get("/venue/:venueId", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  Venue.findOne({ venueId: req.params.venueId })
    .then((data) => {
      let venue = {
        venueId: data.venueId,
        venueName: data.venueName,
        lat: data.lat,
        long: data.long,
      };
      res.status(200);
      res.send(venue);
    })
    .catch((err) => {
      res.status(404);
      res.send("Venue not found");
    });
});
//show all location data
app.get("/venue", (req, res) => {
  Venue.find()
    .then((data) => {
      let venues = data.map((item, idx) => {
        return { name: item.venueName, lat: item.lat, long: item.long, locid: item.venueId };
      });
      res.status(200);
      res.send(venues);
    })
    .catch((err) => {
      console.log(err);
      res.status(406);
      res.send(err);
    });
});

// get comments
app.get("/comments/:venueId", (req, res) => {
  Comment.find({ venueId: req.params.venueId })
    .populate("user")
    .then((data) => {
      let comments = data.map((item, idx) => {
        return { user: item.user.username, venueId: item.venueId, content: item.content };
      });
      res.status(200);
      res.send(comments);
    })
    .catch((err) => {
      console.log(err);
      res.status(406);
      res.send(err);
    });
});

//new comment
app.post("/newcomment", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  const usrname = req.body.user;
  LoginModel.findOne({ username: usrname })
    .then((data) => {
      const userId = data._id;
      Comment.create({
        user: userId,
        venueId: req.body.venueId,
        content: req.body.content,
      })
        .then(() => {
          res.status(200);
          res.send("New comment created");
        })
        .catch((err) => {
          res.status(406);
          res.send(err);
        });
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});
//update invite
app.put("/invites/update/:eventId", async (req, res) => {
  const user = await LoginModel.findOne({ username: req.body.username });
  let msg;
  const invite = await Invite.findOne({
    eventId: req.params.eventId,
  });
  //found invite
  if (invite) {
    //delete action
    if (req.body.delete) {
      try {
        invite.users.pull({ _id: user._id });
        user.invitations.pull({ _id: invite._id });
      } catch (err) {
        console.log(err);
      }
    } else {
      //add user to invite
      invite.users.addToSet(user._id);
      user.invitations.addToSet(invite._id);
    }
    //save invite only if new invite.users is not empty, if empty then delete
    if (invite.users.length !== 0) {
      invite
        .save()
        .then(() => {})
        .catch((err) => {
          console.log(err);
          console.log("test");
        });
      msg = invite;
    } else {
      Invite.findByIdAndDelete(invite._id)
        .then(() => {})
        .catch((err) => {
          console.log(err);
        });
      msg = null;
    }
    user
      .save()
      .then(() => {
        res.status(200).send(null);
      })
      .catch((err) => {
        console.log(err);
        res.status(403).send(err);
      });
  } else {
    res.status(404).send("Not found");
  }
});
//create new invite
app.put("/invites/create/:eventId", async (req, res) => {
  const user = await LoginModel.findOne({ username: req.body.username });
  const invite = await Invite.findOne({ eventId: req.params.eventId });
  if (!invite) {
    const userArray = [];
    const event = await Event.findOne({ eventId: req.params.eventId });
    userArray.push(user._id);
    console.log(userArray);
    const newInvite = new Invite({
      eventId: req.params.eventId,
      event: event._id,
      users: userArray,
    });
    newInvite
      .save()
      .then(() => {
        user.invitations.addToSet(newInvite._id);
      })
      .catch((err) => console.log(err));
    user
      .save()
      .then(() => {
        res.status(200).send(null);
      })
      .catch((err) => {
        console.log(err);
        res.status(403).send(err);
      });
  } else {
    res.status(400).send("Existing Invite!");
  }
});
//create 1 if not delete (maybe can remove by deleting button)

//get event invite for 1 user
app.post("/invites/user", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (req.body.username) {
    const user = await LoginModel.findOne({ username: req.body.username });
    try {
      Invite.find({ users: user._id })
        .populate([
          {
            path: "users",
          },
          {
            path: "event",
          },
        ])
        .then((data) => {
          res.status(200).send(data);
        })
        .catch((err) => {
          res.status(404).send(err);
        });
    } catch (err) {
      console.log(err);
    }
  } else {
    res.status(400).send("No username provided");
  }
});

//Get event invite for 1 event
app.get("/invites/:eventId", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  Invite.findOne({ eventId: req.params.eventId })
    .populate([
      {
        path: "users",
      },
      {
        path: "event",
      },
    ])
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

//get all invites
app.get("/invites", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  Invite.find()
    .populate([
      {
        path: "users",
      },
      {
        path: "event",
      },
    ])
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((data) => {
      res.status(404).send(null);
    });
});
/*app.get("/ev/free/:venueId", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  Event.find({ price: "Free admission by tickets", venue: req.params.venueId })
    .then((data) => {
      console.log("Hi");
      const output = [];
      for (length in data) {
        output.push({
          eventId: data[length].eventId,
          title: data[length].title,
          venue: data[length].venue,
          dateTime: data[length].dateTime,
          desc: data[length].desc,
          presenter: data[length].presenter,
          price: data[length].price,
        });
      }
      res.status(200).send(output);
    })
    .catch((err) => {
      res.setHeader("Content-Type", "text/plain");
      console.log(err);
      res.status(500).send("Internal Server Error");
    });
});*/

// CRUD event data
// Create an event

// Delete User data
app.delete("/admin/event/delete/:eventId", (req, res) => {
  Event.findOneAndDelete({ eventId: req.params["eventId"] })
    .then((data) => {
      if (data) {
        res.sendStatus(204);
      } else {
        res.setHeader("Content-Type", "text/plain");
        res.status(404).send("Event was not found, no event was deleted.");
        console.log("Event was not found, no event was deleted.");
      }
    })
    .catch((error) => {
      console.log(error);
      res.setHeader("Content-Type", "text/plain");
      res.status(500).send("Internal Server Error");
    });
});

// Update Event Data
app.put("/admin/event/update/:eventId", (req, res) => {
  const updatedData = req.body;

  if (
    !updatedData.title ||
    !updatedData.venue ||
    !updatedData.dateTime ||
    !updatedData.desc ||
    !updatedData.presenter ||
    !updatedData.price
  ) {
    res.setHeader("Content-Type", "text/plain");
    res.status(400).send("Request body must include all fields.");
    return;
  }

  Event.findOneAndUpdate({ eventId: req.params.eventId }, updatedData, { new: true })
    .then((data) => {
      if (data) {
        res.json(data);
      } else {
        res.setHeader("Content-Type", "text/plain");
        res.status(404).send("Event not found.");
      }
    })
    .catch((error) => {
      res.setHeader("Content-Type", "text/plain");
      res.status(500).send("Internal Server Error");
      console.log(error);
    });
});

app.post("/admin/event/create", async (req, res) => {
  try {
    console.log("req.body>>", req.body);
    const values = req.body;
    console.log("values>>", values);
    const eventid = values.eventId ? parseInt(values.eventId) : "";
    const title = values.title ? values.title : "";
    const venue = values.venue ? values.venue : "";
    const dateTime = values.dateTime ? values.dateTime : "";
    const description = values.desc ? values.desc : "";
    const presenter = values.presenter ? values.presenter : "";
    const price = values.price ? values.price : "";
    console.log("eventID>> ", eventid);
    console.log("title>> ", title);
    console.log("venue>> ", venue);
    console.log("dateTime>> ", dateTime);
    console.log("description>> ", description);
    console.log("presenter>> ", presenter);
    console.log("price>> ", price);

    if (!eventid || !title || !venue || !dateTime || !description || !presenter || !price) {
      return res.status(406).send("Field missing");
    }

    Event.create({
      eventId: eventid,
      title: title,
      venue: venue,
      dateTime: dateTime,
      desc: description,
      presenter: presenter,
      price: price,
    })
      .then((event) => res.status(201).send(event))
      .catch((err) => res.status(404).send(err));
  } catch (error) {
    console.log("error>>", error);
    res.status(404).send(err);
  }
});

//Read all Event data
app.get("/admin/event", (req, res) => {
  Event.find()
    .then((data) => {
      let evs = data.map((item, idx) => {
        return {
          eventId: item.eventId,
          title: item.title,
          venue: item.venue,
          dateTime: item.dateTime,
          desc: item.desc,
          presenter: item.presenter,
          price: item.price,
        };
      });
      res.status(200);
      res.send(evs);
    })
    .catch((err) => {
      console.log(err);
      res.status(406);
      res.send(err);
    });
});

// listen to port 8000
const server = app.listen(8000);
