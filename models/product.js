const connection = require("../utility/db");

module.exports = class Product {
  constructor(name, price, description, imageUrl, categoryid) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this.categoryid = categoryid;
  }
  saveProduct() {
    return connection.execute(
      "INSERT INTO products (name, price, description, imageUrl, categoryid) VALUES (?, ?, ?, ?,?)",
      [this.name, this.price, this.description, this.imageUrl, this.categoryid]
    );
  }
  static updateProduct(product) {
    return connection.execute(
      "UPDATE products SET products.name=?, products.price=?, products.description=?, products.imageUrl=?, products.categoryid=? WHERE products.id = ?",
      [
        product.name,
        product.price,
        product.description,
        product.imageUrl,
        product.categoryid,
        product.id,
      ]
    );
  }
  static getAllProducts() {
    return connection.execute("select * from products");
  }
  static getById(id) {
    return connection.execute("select * from products where id = ?", [id]);
  }
  static deleteById(id) {
    return connection.execute("delete from products where id = ?", [id]);
  }
  static getProductsByCategoryId(id) {
    return connection.execute("select * from products where categoryid = ?", [
      id,
    ]);
  }
};
