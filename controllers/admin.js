const Product = require("../models/product");

exports.getAllProducts = (req, res, next) => {
  const products = Product.getAllProducts();
  res.render("admin/products", {
    title: "Admin Products",
    products: products,
    path: "/admin/products",
  });
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    title: "New Product",
    path: "/admin/add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(
    req.body.name,
    req.body.price,
    req.body.desc,
    req.body.image
  );
  product.saveProduct();
  res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    title: "Edit Product",
    path: "/admin/edit-product",
  });
};

exports.postEditProduct = (req, res, next) => {
  res.redirect("/");
};
