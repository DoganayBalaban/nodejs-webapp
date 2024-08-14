const express = require("express");
const router = express.Router();
const isAdmin = require("../middleware/isAdmin");
const isAuth = require("../middleware/isAuth");
const csrf = require("../middleware/csrf");
const adminController = require("../controllers/admin");

// Ürün rotaları
router.get("/products", isAuth, adminController.getAllProducts);
router.get("/add-product", csrf, isAdmin, adminController.getAddProduct);
router.post("/add-product", isAuth, isAdmin, adminController.postAddProduct);
router.get(
  "/products/:productid",
  csrf,
  isAuth,
  isAdmin,
  adminController.getEditProduct
);
router.post("/products", isAuth, isAdmin, adminController.postEditProduct);
router.post(
  "/delete-product",
  isAdmin,
  isAuth,
  adminController.postDeleteProduct
);

// Kategori rotaları
router.get(
  "/categories",
  csrf,
  isAdmin,
  isAuth,
  adminController.getAllCategories
);
router.get(
  "/add-category",
  csrf,
  isAdmin,
  isAuth,
  adminController.getAddCategory
);
router.post("/add-category", isAdmin, adminController.postAddCategory);
router.get(
  "/categories/:categoryid",
  csrf,
  isAdmin,
  isAuth,
  adminController.getEditCategory
);
router.post("/categories", isAdmin, adminController.postEditCategory);
router.post(
  "/delete-category",
  isAdmin,
  isAuth,
  adminController.postDeleteCategory
);

module.exports = router;
