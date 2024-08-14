const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.getLogin = (req, res, next) => {
  res.render("account/login", {
    path: "/login",
    title: "Login",
  });
};
exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.redirect("/login");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      return req.session.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    }
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    next(error);
  }
};
exports.getRegister = (req, res, next) => {
  res.render("account/register", {
    path: "/register",
    title: "Register",
    isAuthenticated: req.session.isAuthenticated,
  });
};
exports.postRegister = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      return res.redirect("/register");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      cart: { items: [] },
    });
    await newUser.save();
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    next(error);
  }
};
exports.getReset = (req, res, next) => {
  res.render("account/reset", {
    path: "/reset",
    title: "Reset",
  });
};
exports.postReset = (req, res, next) => {
  res.redirect("/login");
};
