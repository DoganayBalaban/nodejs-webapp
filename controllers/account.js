const User = require("../models/user");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.getLogin = (req, res, next) => {
  var errorMessage = req.session.errorMessage;
  delete req.session.errorMessage;
  res.render("account/login", {
    path: "/login",
    title: "Login",
    errorMessage,
  });
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      req.session.errorMessage = "Bu mail adresi ile bir kayıt bulunamamıştır";
      await req.session.save();
      return res.redirect("/login");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (isValidPassword) {
      req.session.isAuthenticated = true;
      req.session.user = user;
      await req.session.save();
      var url = req.session.redirectTo || "/";
      delete req.session.redirectTo;
      return res.redirect(url);
    } else {
      req.session.errorMessage = "Yanlış şifre";
      await req.session.save();
      return res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.getRegister = (req, res, next) => {
  var errorMessage = req.session.errorMessage;
  delete req.session.errorMessage;
  res.render("account/register", {
    path: "/register",
    title: "Register",
    errorMessage,
  });
};

exports.postRegister = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // E-posta ile kullanıcı olup olmadığını kontrol et
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      req.session.errorMessage = "Bu mail adresi ile daha önce kayıt olunmuş.";
      await req.session.save();
      return res.redirect("/register");
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluştur ve kaydet
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      cart: { items: [] },
    });

    await newUser.save();

    // Kaydın başarılı olduğunu belirtmek için oturum mesajı
    req.session.successMessage = "Kayıt başarılı. Lütfen giriş yapınız.";
    await req.session.save();

    // Kullanıcıyı giriş sayfasına yönlendir
    res.redirect("/login");

    // Hesap oluşturulduktan sonra e-posta gönder
    const msg = {
      to: email, // Alıcının e-posta adresi
      from: "info@doganaybalaban.com", // Onaylanmış gönderici adresi
      subject: "Hesap Oluşturuldu",
      html: `<h1>Hesabınız başarılı bir şekilde oluşturuldu.</h1>`,
    };

    try {
      await sgMail.send(msg);
      console.log("E-posta başarıyla gönderildi");
    } catch (error) {
      console.error("E-posta gönderme hatası:", error);
    }
  } catch (error) {
    console.error("Kayıt sırasında hata:", error);
    next(error);
  }
};

exports.getReset = (req, res, next) => {
  var errorMessage = req.session.errorMessage;
  delete req.session.errorMessage;
  res.render("account/reset", {
    path: "/reset-password",
    title: "Reset Password",
    errorMessage,
  });
};

exports.postReset = async (req, res, next) => {
  const { email } = req.body;
  try {
    const buff = await crypto.randomBytes(32);
    const token = buff.toString("hex");

    const user = await User.findOne({ email: email });
    if (!user) {
      req.session.errorMessage = "Böyle bir e-posta adresi bulunamadı.";
      await req.session.save();
      return res.redirect("/reset-password");
    }

    user.resetToken = token;
    user.expireToken = Date.now() + 3600000;
    await user.save();

    res.redirect("/");
    const msg = {
      to: email, // Alıcının e-posta adresi
      from: "info@doganaybalaban.com", // Onaylanmış gönderici adres
      subject: "Parolanızı sıfırlayın", // Konu
      html: `
        <p>Parolanızı güncellemek için aşağıdaki linke tıklayınız</p>
        <p><a href="http://localhost:3000/reset/${token}">Parola Sıfırla</a></p>
        `,
    };
    await sgMail.send(msg);
  } catch (error) {
    console.error("Parola sıfırlama sırasında hata:", error);
    next(error);
  }
};

exports.getNewPassword = async (req, res, next) => {
  var errorMessage = req.session.errorMessage;
  delete req.session.errorMessage;
  const { token } = req.params;
  try {
    const user = await User.findOne({
      resetToken: token,
      expireToken: { $gt: Date.now() },
    });

    if (!user) {
      req.session.errorMessage =
        "Parola sıfırlama tokeni geçersiz veya süresi dolmuş.";
      await req.session.save();
      return res.redirect("/reset-password");
    }

    res.render("account/new-password", {
      path: "/new-password",
      pageTitle: "New Password",
      errorMessage: errorMessage,
      userId: user._id.toString(),
      token: token,
    });
  } catch (error) {
    console.error("Yeni parola sayfası sırasında hata:", error);
    next(error);
  }
};

exports.postNewPassword = async (req, res, next) => {
  const { password: newPassword, token, userId } = req.body;
  try {
    const user = await User.findOne({
      resetToken: token,
      expireToken: { $gt: Date.now() },
      _id: userId,
    });

    if (!user) {
      req.session.errorMessage =
        "Parola sıfırlama isteği geçersiz veya süresi dolmuş.";
      await req.session.save();
      return res.redirect("/reset-password");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.expireToken = undefined;
    await user.save();

    res.redirect("/login");
  } catch (error) {
    console.error("Parola güncelleme sırasında hata:", error);
    next(error);
  }
};

exports.getLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log("err :>> ", err);
    res.redirect("/");
  });
};
