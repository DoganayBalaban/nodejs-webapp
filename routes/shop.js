const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop");

// Ana sayfa ve ürün rotaları
router.get("/", shopController.getIndex);
router.get("/products", shopController.getProducts);
router.get("/products/:productid", shopController.getProduct);
router.get("/categories/:categoryid", shopController.getProductsByCategoryId);

// Sepet rotaları
router.get("/cart", shopController.getCart);
router.post("/cart", shopController.postCart);
router.post("/delete-cartitem", shopController.deleteCartItem);

// Sipariş rotaları
router.get("/orders", shopController.getOrders);
router.post("/create-order", shopController.postOrders);

module.exports = router;
