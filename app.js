const express = require("express");
const app = express();

const path = require("path");
const bp = require("body-parser");

//pug kurulumu
app.set("view engine", "pug");
app.set("views", "./views");

const port = 3000;

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/shop");
const errorController = require("./controllers/errors");

// req.body içeriğini okuma
app.use(bp.urlencoded({ extended: false }));
// statik dosyaları kullanıma açma
app.use(express.static(path.join(__dirname, "./public")));

//routes
app.use("/admin", adminRoutes);
app.use(userRoutes);
app.use(errorController.get404Page);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
