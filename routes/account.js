const express = require("express");
const router = express.Router();

const accountController = require("../controllers/account");
const csrf = require("../middleware/csrf");
const isAuth = require("../middleware/isAuth");

router.get("/login", isAuth, csrf, accountController.getLogin);
router.post("/login", isAuth, accountController.postLogin);
router.get("/register", isAuth, csrf, accountController.getRegister);
router.post("/register", isAuth, accountController.postRegister);
router.get("/logout", isAuth, accountController.getLogout);
router.get("/reset-password", isAuth, csrf, accountController.getReset);
router.post("/reset-password", isAuth, accountController.postReset);
router.get(
  "/reset-password/:token",
  isAuth,
  csrf,
  accountController.getNewPassword
);
router.post(
  "/reset-password/:token",
  isAuth,
  accountController.postNewPassword
);

module.exports = router;
