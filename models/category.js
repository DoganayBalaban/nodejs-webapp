const connection = require("../utility/db");

module.exports = class Category {
  constructor(name) {
    this.id = (categories.length + 1).toString;
    this.name = name;
    this.description = description;
  }
  saveCategory() {
    return (
      (connection.execute =
        "INSERT INTO categories (name, description) VALUES (?, ?)"),
      [this.name, this.description]
    );
  }
  static updateCategory(category) {
    return (
      (connection.execute =
        "UPDATE categories SET categories.name = ?, categories.description = ? WHERE categories.id = ?"),
      [category.name, category.description, category.id]
    );
  }
  static getAllCategories() {
    return connection.execute("SELECT * FROM categories");
  }
  static getById(id) {
    return connection.execute("SELECT * FROM categories WHERE id = ?", [id]);
  }
  static deleteById(id) {
    return connection.execute("DELETE FROM categories WHERE id = ?", [id]);
  }
};
