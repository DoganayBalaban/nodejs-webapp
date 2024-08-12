const Product = require("../models/product");
const Category = require("../models/category");
const Order = require("../models/order");

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

exports.getProductsByCategoryId = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryid;
    const model = {};

    // Kategorileri bulma
    model.categories = await Category.find();

    // Ürünleri bulma
    const products = await Product.find({
      categories: categoryId,
    });

    // Sonucu render etme
    res.render("shop/products", {
      title: "Products",
      products: products,
      categories: model.categories,
      path: "/products",
      selectedCategory: categoryId,
    });
  } catch (error) {
    console.error("error :>> ", error);
    next(error); // Hatanın bir üst katmana iletilmesi
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

exports.getCart = async (req, res, next) => {
  req.user
    .getCart()
    .then((products) => {
      res.render("shop/cart", {
        title: "Cart",
        path: "/cart",
        products,
      });
    })
    .catch((err) => {
      console.log("err :>> ", err);
    });
};
exports.postCart = async (req, res, next) => {
  try {
    const productId = req.body.productId;
    const product = await Product.findById(productId);
    await req.user.addToCart(product);
    res.redirect("/cart?action=add");
  } catch (error) {
    console.error(error);
    next(error);
  }
};
exports.deleteCartItem = async (req, res, next) => {
  try {
    const productId = req.body.id;
    await req.user.deleteCartItem(productId);
    res.redirect("/cart?action=delete");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ "user.userId": req.user._id });
    res.render("shop/orders", {
      path: "/orders",
      orders,
      title: "Orders",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
exports.postOrders = async (req, res, next) => {
  try {
    // Kullanıcı sepetindeki ürünleri yükle
    await req.user.populate("cart.items.productId");
    // Sipariş nesnesi oluştur
    const order = new Order({
      user: {
        userId: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
      items: req.user.cart.items.map((p) => ({
        product: {
          _id: p.productId._id,
          name: p.productId.name,
          price: p.productId.price,
          imageUrl: p.productId.imageUrl,
        },
        quantity: p.quantity,
      })),
    });

    // Siparişi kaydet
    await order.save();

    // Kullanıcının sepetini temizle
    await req.user.clearCart();

    // Sipariş sayfasına yönlendir
    res.redirect("/orders");
  } catch (err) {
    console.error(err);
    next(err); // Hatanın üst katmanlara iletilmesi için
  }
};
