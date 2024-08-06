const Product = require("../models/product");
const Category = require("../models/category");

exports.getIndex = (req, res, next) => {
  Product.findAll({
    attributes: ["id", "name", "price", "imageUrl"],
  })
    .then((products) => {
      Category.findAll()
        .then((categories) =>
          res.render("shop/index", {
            title: "Shopping",
            products: products,
            categories: categories,
            path: "/",
          })
        )
        .catch((err) => {
          console.log("err :>> ", err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.findAll({
    attributes: ["id", "name", "price", "imageUrl", "description"],
  })
    .then((products) => {
      Category.findAll()
        .then((categories) =>
          res.render("shop/products", {
            title: "Products",
            products: products,
            categories: categories,
            path: "/products",
          })
        )
        .catch((err) => {
          console.log("err :>> ", err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProductsByCategoryId = (req, res, next) => {
  const categoryId = req.params.categoryid;
  const products = Product.getProductsByCategoryId(categoryId);
  const categories = Category.getAllCategories();
  res.render("shop/products", {
    title: "Products",
    products: products,
    categories: categories,
    path: "/products",
    selectedCategory: categoryId,
  });
};

exports.getProduct = (req, res, next) => {
  Product.findByPk(req.params.productid)
    .then((product) =>
      res.render("shop/product-detail", {
        title: product.name,
        product: product,
        path: "/products",
      })
    )
    .catch((err) => console.log("err", err));
};

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    title: "Cart",
    path: "/cart",
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    title: "Orders",
    path: "/orders",
  });
};
