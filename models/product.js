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
    this.id = Math.floor(Math.random() * 99999) + 1;
    this.name = name;
    this.price = price;
    this.description = description;
    this.image = image;
  }
  saveProduct() {
    products.push(this);
  }
  static getAllProducts() {
    return products;
  }
};
