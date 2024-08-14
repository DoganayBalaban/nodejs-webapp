const Category = require("../models/category");
const Product = require("../models/product");

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ userId: req.user._id })
      .populate("userId", "name -_id")
      .select("name price userId"); //.limit(10).sort({name:-1}).select({description:0})
    res.render("admin/products", {
      title: "Admin Products",
      products: products,
      path: "/admin/products",
      action: req.query.action,
      // isAuthenticated: req.session.isAuthenticated,
    });
  } catch (error) {
    console.log("error :>> ", error);
  }
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    title: "New Product",
    path: "/admin/add-product",
    // isAuthenticated: req.session.isAuthenticated,
  });
};

exports.postAddProduct = async (req, res, next) => {
  try {
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;

    const product = new Product({
      name,
      price,
      imageUrl,
      description,
      userId: req.user,
    });
    await product.save();
    res.redirect("/admin/products");
  } catch (error) {
    console.log("error :>> ", error);
  }
};

exports.getEditProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.productid,
      userId: req.user._id,
    });
    let categories = await Category.find();
    categories = categories.map((category) => {
      if (product.categories) {
        product.categories.find((item) => {
          if (item.toString() === category._id.toString()) {
            category.selected = true;
          }
        });
      }
      return category;
    });
    res.render("admin/edit-product", {
      title: "Edit Product",
      path: "/admin/edit-product",
      product,
      // isAuthenticated: req.session.isAuthenticated,
      categories,
    });
  } catch (error) {
    console.log("error :>> ", error);
  }
};

exports.postEditProduct = async (req, res, next) => {
  const id = req.body.id;
  const name = req.body.name;
  const price = req.body.price;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;
  const ids = req.body.categoryids;
  try {
    const product = await Product.findByIdAndUpdate(id, {
      name,
      price,
      imageUrl,
      description,
      categories: ids,
    });
    res.redirect("/admin/products?action=update");
    // const product = await Product.findById(id);
    // product.name = name;
    // product.price = price;
    // product.description = description;
    // product.imageUrl = imageUrl;
    // await product.save();
    // res.redirect("/admin/products?action=update");
  } catch (error) {
    console.log("error :>> ", error);
    next(error);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  try {
    const id = req.body.id;
    const product = await Product.findByIdAndDelete(id);
    if (product) {
      console.log("Ürün Başarıyla Silindi ");
    }
    res.redirect("/admin/products?action=delete");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.render("admin/categories", {
      title: "Categories",
      categories,
      path: "/admin/categories",
      action: req.query.action,
      // isAuthenticated: req.session.isAuthenticated,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.getAddCategory = async (req, res, next) => {
  try {
    res.render("admin/add-category", {
      title: "Add Category",
      path: "/admin/add-category",
      // isAuthenticated: req.session.isAuthenticated,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
exports.postAddCategory = async (req, res, next) => {
  try {
    const name = req.body.name;
    const description = req.body.description;
    const category = new Category({
      name,
      description,
    });
    await category.save();
    res.redirect("/admin/categories");
  } catch (error) {
    console.error(error);
    next(error);
  }
};
exports.getEditCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.categoryid);
    res.render("admin/edit-category", {
      title: "Edit Category",
      path: "/admin/edit-category",
      // isAuthenticated: req.session.isAuthenticated,
      category,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
exports.postEditCategory = async (req, res, next) => {
  try {
    const categoryid = req.body.id;
    const name = req.body.name;
    const description = req.body.description;
    const categories = await Category.findByIdAndUpdate(categoryid, {
      name,
      description,
    });
    await categories.save();
    res.redirect("/admin/categories?action=update");
  } catch (error) {
    console.error(error);
    next(error);
  }
};
exports.postDeleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.body.id);
    if (category) {
      console.log("Kategori Silindi");
    }
    res.redirect("/admin/categories?action=delete");
  } catch (error) {
    console.error(error);
    next(error);
  }
};
