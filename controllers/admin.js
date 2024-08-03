const Category = require("../models/category");
const Product = require("../models/product");

exports.getAllProducts = (req, res, next) => {
  Product.getAllProducts()
    .then((products) =>
      res.render("admin/products", {
        title: "Admin Products",
        products: products[0],
        path: "/admin/products",
        action: req.query.action,
      })
    )
    .catch((err) => {
      console.log(err);
    });
};

exports.getAddProduct = (req, res, next) => {
  Category.getAllCategories()
    .then((categories) =>
      res.render("admin/add-product", {
        title: "New Product",
        path: "/admin/add-product",
        categories: categories[0],
      })
    )
    .catch((err) => {
      console.log("err :>> ", err);
    });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(
    req.body.name,
    req.body.price,
    req.body.desc,
    req.body.image,
    req.body.categoryid
  );
  product
    .saveProduct()
    .then(() => res.redirect("/"))
    .catch((err) => {
      console.log("err :>> ", err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const id = req.params.productid;

  Product.getById(id)
    .then((product) =>
      Category.getAllCategories()
        .then((categories) =>
          res.render("admin/edit-product", {
            title: "Edit Product",
            path: "/admin/edit-product",
            product: product[0][0],
            categories: categories[0],
          })
        )
        .catch((err) => console.log("err :>> ", err))
    )
    .catch((err) => {
      console.log("err :>> ", err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const product = new Product();
  product.id = req.body.id;
  product.name = req.body.name;
  product.price = req.body.price;
  product.description = req.body.description;
  product.imageUrl = req.body.imageUrl;
  product.categoryid = req.body.categoryid;
  Product.updateProduct(product)
    .then(() => res.redirect("/admin/products?action=update"))
    .catch((err) => {
      console.log("err :>> ", err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.id;
  Product.deleteById(id)
    .then(() => {
      res.redirect("/admin/products?action=delete");
    })
    .catch((err) => {
      console.log("err :>> ", err);
    });
};
