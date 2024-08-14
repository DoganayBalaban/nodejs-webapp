const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/authentication");
const shopController = require("../controllers/shop");
const isAuth = require("../middleware/isAuth");

// Ana sayfa ve ürün rotaları
router.get("/", isAuth, shopController.getIndex);
router.get("/products", isAuth, shopController.getProducts);
router.get("/products/:productid", isAuth, shopController.getProduct);
router.get(
  "/categories/:categoryid",
  isAuth,
  shopController.getProductsByCategoryId
);

// Sepet rotaları
router.get("/cart", isAuth, isAuthenticated, shopController.getCart);
router.post("/cart", isAuth, isAuthenticated, shopController.postCart);
router.post(
  "/delete-cartitem",
  isAuth,
  isAuthenticated,
  shopController.deleteCartItem
);

// Sipariş rotaları
router.get("/orders", isAuth, isAuthenticated, shopController.getOrders);
router.post(
  "/create-order",
  isAuth,
  isAuthenticated,
  shopController.postOrders
);

module.exports = router;
