const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/shop");
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

// Kullanıcıyı middleware üzerinden ekle
app.use(async (req, res, next) => {
  try {
    const user = await User.findOne({ name: "doganay" });
    req.user = user;
    next();
  } catch (err) {
    console.error("Kullanıcıyı bulurken hata oluştu:", err);
  }
});

// Rotalar
app.use("/admin", adminRoutes);
app.use(userRoutes);

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

    let user = await User.findOne({ name: "doganay" });
    if (!user) {
      user = new User({
        name: "doganay",
        email: "doganay@gmail.com",
        cart: { items: [] },
      });
      await user.save();
    }
    console.log("Kullanıcı bilgisi:", user);

    app.listen(3000, () => {
      console.log("Sunucu 3000 portunda çalışıyor.");
    });
  })
  .catch((err) => {
    console.error("Veritabanına bağlanırken hata oluştu:", err);
  });
