const express = require("express");
const app = express();

const path = require("path");
const bp = require("body-parser");

//pug kurulumu
app.set("view engine", "pug");
app.set("views", "./views");
// const connection = require("./utility/db");

const port = 3000;

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/shop");
const errorController = require("./controllers/errors");
const sequelize = require("./utility/db");

const Category = require("./models/category");
const Product = require("./models/product");

//bire çok ilişki kurulur
Product.belongsTo(Category);
Category.hasMany(Product);
//db sync
sequelize
  .sync({ force: true })
  .then((result) => {
    console.log("result :>> ", result);
  })
  .catch((err) => {
    console.log("err :>> ", err);
  });

// req.body içeriğini okuma
app.use(bp.urlencoded({ extended: false }));
// statik dosyaları kullanıma açma
app.use(express.static(path.join(__dirname, "./public")));

//routes
app.use("/admin", adminRoutes);
app.use(userRoutes);
app.use(errorController.get404Page);
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Veritabanı Bağlantısı Başarılı");
//   })
//   .catch((err) => {
//     console.log("err :>> ", err);
//   });

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
