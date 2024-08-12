const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");
const db = require("../utility/db");

const CartItem = db.define("cartItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
});

module.exports = CartItem;
