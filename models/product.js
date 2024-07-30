const products = [
  {
    id: "1",
    name: "samsung",
    price: 2000,
    image: "https://place-hold.it/300x500",
    description: "iyi telefon",
  },
  {
    id: "2",
    name: "Iphone",
    price: 2000,
    image: "https://place-hold.it/300x500",
    description: "iyi telefon",
  },
  {
    id: "3",
    name: "LG",
    price: 2000,
    image: "https://place-hold.it/300x500",
    description: "iyi telefon",
  },
];
module.exports = class Product {
  constructor(name, price, description, image) {
    this.id = (Math.floor(Math.random() * 99999) + 1).toString();
    this.name = name;
    this.price = price;
    this.description = description;
    this.image = image;
  }
  saveProduct() {
    products.push(this);
  }
  static updateProduct(product) {
    const index = products.findIndex((i) => i.id === product.id);

    products[index].name = product.name;
    products[index].price = product.price;
    products[index].description = product.description;
    products[index].image = product.image;
  }
  static getAllProducts() {
    return products;
  }
  static getById(id) {
    return products.find((product) => product.id == id);
  }
};
