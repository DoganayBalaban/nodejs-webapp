const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin");

router.get("/products", adminController.getAllProducts);
router.get("/add-product", adminController.getAddProduct);
router.post("/add-product", adminController.postAddProduct);
router.get("/products/:productid", adminController.getEditProduct);
router.get("/categories", adminController.getAllCategories);
router.post("/categories", adminController.postEditCategory);
router.get("/categories/:categoryid", adminController.getEditCategory);
router.get("/add-category", adminController.getAddCategory);
router.post("/add-category", adminController.postAddCategory);
router.post("/delete-category", adminController.postDeleteCategory);
router.post("/products", adminController.postEditProduct);
router.post("/delete-product", adminController.postDeleteProduct);

module.exports = router;
