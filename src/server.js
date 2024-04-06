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
const OrderSchema = require("./schemas.js").OrderSchema;
const sendemail = require("./tokenSender.js");
require("dotenv").config();

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
    console.log("reqqq>>", req.body);
    const { formData: values } = req?.body;
    const token = sendemail(values.email);
    TokenModel.create({
      email: values.email,
      token: token,
    })
      .then((user) => res.json(user))
      .catch((err) => res.json(err));
  } catch (error) {
    console.log("error>>", error);
    res.json(error);
  }
});

app.post("/checkotp", async (req, res) => {
  try {
    console.log("req>>", req.body);
    const { formData: values } = req?.body;
    const userotp = parseInt(values.otp);
    console.log(typeof userotp);
    TokenModel.find({ token: userotp })
      .then((result) => {
        console.log("resultofot[]>>", result);
        if (result.length === 0) res.status(200).send(false);
        else res.status(200).send(true);
      })
      .catch(() => res.status(500).send("Internal Server error"));
  } catch (error) {
    console.log("error>>", error);
    res.json(error);
  }
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
    const birthday = values.birthday ? new Date(values.birthday) : new Date();
    const password = values.password
      ? await bcrypt.hash(values.password, 10)
      : "";
    const role = values.role ? values.role : "user";
    console.log("username>> ", username);
    console.log("email>> ", email);
    console.log("password>> ", password);
    console.log("birthday>>", birthday);

    if (!username || !email || !password || !role) {
      return res.status(406).send("Field missing");
    }

    const currentTime = new Date();
    LoginModel.create({
      username: username,
      email: email,
      password: password,
      role: role,
      birthday: birthday,
      cTime: currentTime,
      deleted: "false",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=1",
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
  console.log("req.body>>", req.body);
  const { formData: values } = req?.body;
  console.log("email>>", values.email);
  LoginModel.find({ email: values.email })
    .then((result) => {
      console.log("resultEmail>>", result);
      if (result.length === 0) res.status(200).send(false);
      else res.status(200).send(true);
    })
    .catch(() => res.status(500).send("Internal Server error"));
});

app.post("/checkusername", (req, res) => {
  const { formData: values } = req?.body;
  LoginModel.find({ username: values.username })
    .then((result) => {
      console.log("resultUser>>", result);
      if (result.length === 0) res.status(200).send(false);
      else res.status(200).send(true);
    })
    .catch(() => res.status(500).send("Internal Server error"));
});

app.post("/getuser", (req, res) => {
  const username = req?.body?.username;
  // console.log("inside getUser", username);
  let user = "";
  LoginModel.findOne({ username: username })
    .then((item) => {
      if (item) {
        // console.log("item>>", item);
        user = {
          id: item._id,
          username: item.username,
          email: item.email,
          pw: item.password,
          birthday: item.birthday,
          firstname: item.firstname,
          lastname: item.lastname,
          avatar: item.avatar,
        };
      }

      res.status(200);
      res.send(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(406);
      res.send(err);
    });
});

// get users data from admin
app.get("/admin/user", (req, res) => {
  LoginModel.find()
    .then((data) => {
      let users = data.map((item, idx) => {
        return {
          id: item._id,
          username: item.username,
          email: item.email,
          pw: item.password,
          birthday: item.birthday,
          firstname: item.firstname,
          lastname: item.lastname,
        };
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

app.put("/admin/user", (req, res) => {
  try {
    const { formData: values } = req.body;
    console.log("update>>user>>values>>", values);
    LoginModel.findOneAndUpdate({ _id: values.id }, values, {
      new: true,
    })
      .then((data) => {
        if (data) {
          res.status(200).json(data);
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
  } catch (error) {
    console.log("error>>", error);
  }
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

// ProductApi //////////// //////////// //////////// //////////// //////////// //////////// //////////// //////////// //////////// //////////// //////////// ////////////

const { ProductSchema } = require("./schemas.js"); // Assuming you have a Product model

// app.post("/getProducts", async (req, res) => {
//   // Extract the product ID and product name from the request body
//   const productId = req.body.id;
//   const productName = req.body.name;
//   const Product = mongoose.model("Product", ProductSchema);
//   // Use the product ID or product name to retrieve the products from the database
//   const products = await Product.find({
//     $or: [
//       { productId: productId },
//       { productName: { $regex: new RegExp(productName, "i") } },
//     ],
//   });

//   // Check if any products were found
//   if (products.length > 0) {
//     // If any products were found, send them back in the response
//     res.json(products);
//   } else {
//     // If no products were found, send a 404 status code and an error message
//     res.status(404).json({ message: "No products found" });
//   }
// });
const Product = mongoose.model("Product", ProductSchema);
app.get("/getproductbbyid/:id", async (req, res) => {
  const productId = req?.params?.id;

  console.log("productId>>", productId);
  const products = await Product.find({ productId: productId });
  if (products.length > 0) {
    console.log("products:", products);
    res.status(200).json(products);
  } else {
    res.status(404).json({ message: "No products found" });
  }
});
app.get("/getproductbbyname/:name", async (req, res) => {
  const productName = req?.query?.id;

  console.log("productName>>", productName);

  const products = await Product.find({ productName: productName });
  if (products.length > 0) {
    console.log("products:", products);
    res.json(products);
  } else {
    res.status(404).json({ message: "No products found" });
  }
});
app.post("/getProducts", async (req, res) => {
  const productId = req?.body?.id ? req?.body?.id : "";
  const productName = req?.body?.name ? req?.body?.name : "";

  const conditions = [];
  if (productId) {
    conditions.push({ productId: productId });
  }
  if (productName) {
    conditions.push({ productName: { $regex: new RegExp(productName, "i") } });
  }
  const products = await Product.find({ $or: conditions });
  if (products.length > 0) {
    console.log("products:", products);
    res.json(products);
  } else {
    res.status(404).json({ message: "No products found" });
  }
});
app.post("/filterProducts", async (req, res) => {
  let filterByCat = req.body.category;
  let filterByPrice = req.body.priceRange;
  const Product = mongoose.model("Product", ProductSchema);
  console.log("filterByCat", filterByCat);
  console.log("filterByCat", filterByCat.length);

  console.log("filterByPrice", filterByPrice[0]);
  console.log("filterByPrice", typeof filterByPrice[1]);
  let allCategory = [
    "HouseHoldSupply",
    "MeatNSeafood",
    "DairyChilledEggs",
    "BreakfastNBakery",
  ];
  if (filterByCat.length == 0) {
    filterByCat = allCategory;
    console.log("filterByCat", filterByCat);
  }
  await Product.find({
    category: { $in: filterByCat },
    price: { $gte: filterByPrice[0], $lte: filterByPrice[1] },
  })
    .then((products) => {
      console.log("products:", products);
      res.status(200).json(products);
    })
    .catch((err) => {
      res.status(400).json({ message: "server error" });
    });
});
app.get("/getAllProducts", async (req, res) => {
  const Product = mongoose.model("Product", ProductSchema);

  // Retrieve all products from the database
  // const products = await Product.find({ deleted: "false" });
  const products = await Product.find({ deleted: "false" });

  // Send the products back in the response
  res.json(products);
});

app.put("/admin/products", async (req, res) => {
  try {
    const { formData: product } = req?.body;
    const Product = mongoose.model("Product", ProductSchema);
    console.log("update>>product>>", product);
    Product.findOneAndUpdate({ productId: product.productId }, product, {
      new: true,
    })
      .then((data) => {
        if (data) {
          res.status(200).json(data);
        } else {
          res.setHeader("Content-Type", "text/plain");
          res.status(404).send("Product not found.");
        }
      })
      .catch((error) => {
        res.setHeader("Content-Type", "text/plain");
        res.status(500).send("Internal Server Error");
        console.log(error);
      });
  } catch (error) {
    console.log("error>>", error);
  }
});
//create product
app.post("/admin/products", (req, res) => {
  try {
    const { formData: values } = req?.body;
    console.log("product>>", values);
    Product.create(values)
      .then((product) => res.status(200).json(product))
      .catch((err) => res.status(404).json(err));
  } catch (error) {
    console.log("error>>", error);
    res.json(error);
  }
});
//flagged for delete
app.put("/admin/delete/product", async (req, res) => {
  try {
    const Cart = mongoose.model("Cart", CartSchema);
    const productId = req?.body?.productId;
    console.log("del>>", productId);

    const resp = await Product.findOneAndUpdate(
      { productId },
      { $set: { deleted: "true" } },
      { new: true }
    );

    const cart = await Cart.updateMany(
      { "cart.product.productId": productId },
      { $set: { "cart.$.product.deleted": "true" } },
      { new: true }
    );

    res.status(200).json([resp, cart]);
  } catch (error) {
    res.status(500).json("internal server error");
  }
});
// CartApi //////////// //////////// //////////// //////////// //////////// //////////// //////////// //////////// //////////// //////////// //////////// ////////////
const { CartSchema } = require("./schemas.js");
const Cart = mongoose.model("Cart", CartSchema);

app.post("/addToCart", async (req, res) => {
  let product = req.body.product; // get the product ID from the request body
  let userDetail = req.body.userDetail;

  // const Product = mongoose.model("Product", ProductSchema);
  // const product = await Product.findOne({ productId: productId }); // find the product by its ID
  // console.log("product:::", product);
  if (product) {
    if (product.stock > 0) {
      console.log("product:", product);
      const cart = await Cart.findOne({
        userID: userDetail.id,
        "cart.product.productId": product.productId,
      });

      if (cart) {
        // If the product already exists in the cart, increment the quantity
        await Cart.updateOne(
          {
            userID: userDetail.id,
            "cart.product.productId": product.productId,
          },
          { $inc: { "cart.$.quantity": 1 } }
        );
      } else {
        // If the product does not exist in the cart, add it
        const cartItem = {
          product: product,
          quantity: 1,
        };

        await Cart.findOneAndUpdate(
          { userID: userDetail.id }, // condition
          { $push: { cart: cartItem } }, // update
          { new: true, upsert: true } // options
        );
      }
      res.status(200).json(cart);
    } else {
      console.log("out of stock");
      res.status(204).json({ message: "out of stock" });
    }
  } else {
    res.status(404).json({ message: "No product found" });
  }
});

app.post("/getCart", async (req, res) => {
  const userDetail = req.body.id;
  const cart = await Cart.find({
    userID: userDetail,
    "cart.product.deleted": false,
  });
  console.log("cart:", userDetail);

  console.log("cart:", cart);
  res.status(200).json(cart[0]);
});

app.post("/saveCart", async (req, res) => {
  const cart = req.body.cartUpdate;
  const userId = req.body.userId;

  console.log("cartUpdate:", cart);
  console.log("userId:", userId);
  // Iterate over the cart items
  for (let item of cart) {
    // Find the product in the database
    console.log("item:::", item);
    console.log("product:::", item.product);
    console.log("stock:::", item.product.stock);
    console.log("id:::", item.product.productId);

    const product = await Product.findOne({
      productId: item.product.productId,
    });
    console.log("product:::", product);
    // Check if the stock is sufficient
    if (product.stock < item.quantity) {
      return res.status(400).json({
        message: `Insufficient stock for product ${product.productName}`,
      });
    }
  }
  if (cart && userId) {
    const newCart = await Cart.findOneAndUpdate(
      { userID: userId },
      { $set: { cart: cart } },
      { new: true } // This option returns the updated document
    );
    console.log("newCart:", newCart);
    res.status(200).json(newCart);
  } else {
    res.status(500).json({ message: "internal server error" });
  }
});

app.post("/deleteFromCart", async (req, res) => {
  const userId = req.body.userId;
  const productId = req.body.productId;

  console.log("productId:", productId);
  console.log("userId:", userId);

  if (userId && productId) {
    const newCart = await Cart.findOneAndUpdate(
      { userID: userId },
      { $pull: { cart: { "product.productId": productId } } },
      { new: true } // This option returns the updated document
    );
    console.log("newCart:", newCart);
    res.status(200).json(newCart);
  } else {
    res.status(500).json({ message: "internal server error" });
  }
});

app.post("/checkStock", async (req, res) => {
  const productId = req.body.productId;
  const quantity = req.body.quantity;
  try {
    await Product.find({ productId: productId }).then((resp) => {
      if (quantity > resp[0].stock) {
        console.log("out of stock");
        res.status(200).json({ success: false, message: "out of stock" });
      } else {
        console.log("in stock");
        res.status(200).json({ success: true, message: "ok" });
      }
    });
  } catch {
    res.status(500).json({ success: false, message: "server error" });
  }
});

// Order Api //////////// //////////// //////////// //////////// //////////// //////////// //////////// //////////// //////////// //////////// //////////// ////////////
const Order = mongoose.model("Order", OrderSchema);
app.post("/orderSubmit", async (req, res) => {
  const order = req.body.order;
  const userId = req.body.userId;
  let checkEnoughStock = {
    true: [],
    false: [],
  };
  console.log("cartUpdate:", order);
  console.log("userId:", userId);
  // Iterate over the order items
  for (let item of order) {
    // Find the product in the database
    console.log("item:::", item);
    console.log("product:::", item.product);
    console.log("stock:::", item.product.stock);
    console.log("id:::", item.product.productId);

    const product = await Product.findOne({
      productId: item.product.productId,
    });
    console.log("product:::", product);
    // Check if the stock is sufficient
    if (product.stock < item.quantity) {
      checkEnoughStock["false"].push(product.productName);
      console.log("checkEnoughStock:", checkEnoughStock["false"]);
    } else {
      checkEnoughStock["true"].push(product.productId);
    }
  }
  if (checkEnoughStock["false"].length > 0) {
    console.log(`Insufficient stock for product ${checkEnoughStock["false"]}`);
    return res.status(201).json({
      outOfStock: `${checkEnoughStock["false"]}`,
    });
  }

  const date = new Date()
    .toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" })
    .replace(/\./g, "-");

  try {
    await Order.findOneAndUpdate(
      { userID: userId }, // find a document with this filter
      {
        $push: {
          orders: { date: date, items: order, status: "Pending" },
        },
      }, // document to insert when nothing was found
      { upsert: true, new: true, runValidators: true } // options
    );
    console.log("Order updated successfully");

    try {
      await Cart.findOneAndDelete({ userID: userId });
      console.log("Cart deleted successfully");
      return res.status(200).json({
        message: `${checkEnoughStock["true"]}`,
      });
    } catch (error) {
      console.error("Error deleting cart:", error);
    }
  } catch (error) {
    console.error("Error saving order:", error);
    return res.status(500).json({ error: "Error saving order" });
  }
});

app.post("/retrieveOrder", async (req, res) => {
  const userid = req.body.userID;
  let orderProfile = await Order.findOne({
    userID: userid,
  });
  let processingOrderList = [];
  let orderList = orderProfile.orders;
  console.log("orderList", orderList.length);
  for (i in orderList) {
    if (orderList[i].status != "finished") {
      processingOrderList.push(orderList[i]);
    }
  }
  console.log("processingOrderList", processingOrderList);
  return res.status(200).json({
    orderList: processingOrderList,
  });
});

// listen to port 8000a
const server = app.listen(api_port);
