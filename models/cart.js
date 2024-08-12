const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");
const db = require("../utility/db");

const Cart = db.define("cart", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = Cart;
