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
  const id = req.params.productid;
  const product = Product.getById(id);
  res.render("admin/edit-product", {
    title: "Edit Product",
    path: "/admin/edit-product",
    product: product,
  });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.id;
  const product = Product.getById(id);

  if (!product) {
    // Ürün bulunamadı, hata sayfasına yönlendir veya hata mesajı göster
    return res.status(404).send("Ürün bulunamadı.");
  }
  product.name = req.body.name;
  product.price = req.body.price;
  product.description = req.body.desc;
  product.image = req.body.image;
  Product.updateProduct(product);
  res.redirect("/admin/products");
};
