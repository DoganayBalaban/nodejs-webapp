const Category = require("../models/category");
const Product = require("../models/product");

exports.getAllProducts = (req, res, next) => {
  Product.findAll()
    .then((products) =>
      res.render("admin/products", {
        title: "Admin Products",
        products: products,
        path: "/admin/products",
        action: req.query.action,
      })
    )
    .catch((err) => {
      console.log(err);
    });
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    title: "New Product",
    path: "/admin/add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  const name = req.body.name;
  const price = req.body.price;
  const desc = req.body.desc;
  const image = req.body.image;
  // req.body.categoryid
  Product.create({
    name: name,
    price: price,
    imageUrl: image,
    description: desc,
  })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log("err :>> ", err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const id = req.params.productid;

  Product.findByPk(id)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      Category.findAll()
        .then((categories) =>
          res.render("admin/edit-product", {
            title: "Edit Product",
            path: "/admin/edit-product",
            product: product,
            categories: categories,
          })
        )
        .catch((err) => console.log("err :>> ", err));
    })
    .catch((err) => {
      console.log("err :>> ", err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.id;
  const name = req.body.name;
  const price = req.body.price;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;
  const categoryid = req.body.categoryid;
  Product.findByPk(id)
    .then((product) => {
      product.name = name;
      product.price = price;
      product.description = description;
      product.imageUrl = imageUrl;
      return product.save();
    })
    .then((result) => {
      console.log("updated");
      res.redirect("/admin/products?action=update");
    })
    .catch((err) => {
      console.log("err :>> ", err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.id;
  Product.findByPk(id)
    .then((product) => {
      return product.destroy();
    })
    .then(() => {
      console.log("Ürün Başarıyla Silindi ");
      res.redirect("/admin/products?action=delete");
    })
    .catch((err) => {
      console.log("err :>> ", err);
    });
  // Product.destroy({ where: { id: id } })
  //   .then(() => res.redirect("/admin/products?action=delete"))
  //   .catch((err) => {
  //     console.log("err :>> ", err);
  //   });
};
