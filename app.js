const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoDbStore = require("connect-mongodb-session")(session);
const csurf = require("csurf");

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/shop");
const accountRoutes = require("./routes/account");
const errorController = require("./controllers/errors");
const User = require("./models/user");
require("dotenv").config();

const app = express();

// Pug ayarları
app.set("view engine", "pug");
app.set("views", "./views");

// Middleware ayarları
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "./public")));
app.use(cookieParser());
var store = new mongoDbStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions",
});
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 gün
    },
    store: store,
  })
);
app.use(csurf());

// Kullanıcıyı middleware üzerinden ekle
app.use(async (req, res, next) => {
  try {
    if (!req.session.user) {
      return next();
    }
    const user = await User.findById(req.session.user._id);
    req.user = user;
    next();
  } catch (err) {
    console.error("Kullanıcıyı bulurken hata oluştu:", err);
  }
});

// Rotalar
app.use("/admin", adminRoutes);
app.use(userRoutes);
app.use(accountRoutes);

// 404 sayfası
app.use(errorController.get404Page);

// Veritabanına bağlanma ve sunucu başlatma
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Veritabanına başarıyla bağlanıldı.");
    app.listen(3000, () => {
      console.log("Sunucu 3000 portunda çalışıyor.");
    });
  })
  .catch((err) => {
    console.error("Veritabanına bağlanırken hata oluştu:", err);
  });
