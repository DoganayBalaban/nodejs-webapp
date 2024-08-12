const Product = require("../models/product");
const Category = require("../models/category");

exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.find();
    const categories = await Category.find();
    res.render("shop/index", {
      title: "Shopping",
      products: products,
      categories: categories,
      path: "/",
    });
  } catch (error) {
    console.log("error :>> ", error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    const categories = await Category.find();
    res.render("shop/products", {
      title: "Products",
      products,
      categories,
      path: "/",
    });
  } catch (error) {
    console.log("error :>> ", error);
  }
};

// exports.getProductsByCategoryId = (req, res, next) => {
//   const categoryid = req.params.categoryid;
//   const model = [];
//   Category.findAll()
//     .then((categories) => {
//       model.categories = categories;
//       const category = categories.find((i) => i.id == categoryid);
//       category.getProducts();
//     })
//     .then((products) => {
//       res.render("shop/products", {
//         title: "Products",
//         products: products || [],
//         categories: model.categories,
//         path: "/products",
//         selectedCategory: categoryid,
//       });
//     })
//     .catch((err) => {
//       console.log("err :>> ", err);
//     });
// };
exports.getProductsByCategoryId = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryid;

    // Tüm kategorileri alın
    const categories = await Category.findAll();
    const category = categories.find((i) => i.id == categoryId);

    // Seçilen kategoriye ait ürünleri alın
    const products = await category.getProducts();

    // Verileri render etmek için gönderin
    res.render("shop/products", {
      title: "Products",
      products: products,
      categories: categories,
      path: "/products",
      selectedCategory: categoryId,
    });
  } catch (err) {
    console.log("Error :>> ", err);
    next(err); // Hata durumunu sonraki middleware'e ilet
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.productid);
    res.render("shop/product-detail", {
      title: product.name,
      product,
      path: "/products",
    });
  } catch (error) {
    console.log("error :>> ", error);
  }
};

exports.getCart = (req, res, next) => {
  const action = req.query.action;
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getProducts()
        .then((products) => {
          res.render("shop/cart", {
            title: "Cart",
            path: "/cart",
            products: products,
            action,
          });
        })
        .catch((err) => {
          console.log("err :>> ", err);
        });
    })
    .catch((err) => {
      console.log("err :>> ", err);
    });
};
exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  let quantity = 1;
  let userCart;

  req.user
    .getCart()
    .then((cart) => {
      userCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        quantity += product.cartItem.quantity;
        return product;
      }
      return Product.findByPk(productId);
    })
    .then((product) => {
      userCart.addProduct(product, { through: { quantity: quantity } });
    })
    .then(() => {
      res.redirect("/cart?action=add");
    })
    .catch((err) => {
      console.log("err :>> ", err);
    });
};
exports.deleteCartItem = (req, res, next) => {
  const productId = req.body.id;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(() => {
      res.redirect("/cart?action=delete");
    });
};

exports.getOrders = (req, res, next) => {
  req.user.getOrders({ include: ["products"] }).then((orders) => {
    res.render("shop/orders", {
      title: "Orders",
      path: "/orders",
      orders,
    });
  });
};
exports.postOrders = (req, res, next) => {
  let userCart;
  req.user
    .getCart()
    .then((cart) => {
      userCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          order.addProducts(
            products.map((product) => {
              product.orderItem = {
                quantity: product.cartItem.quantity,
                price: product.price,
              };
              return product;
            })
          );
        })
        .catch((err) => console.log("err :>> ", err));
    })
    .then(() => {
      userCart.setProducts(null);
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.log("err :>> ", err));
};
