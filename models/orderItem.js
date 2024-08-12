const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");
const db = require("../utility/db");

const OrderItem = db.define("orderItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
  price: {
    type: DataTypes.DOUBLE,
  },
});

module.exports = OrderItem;
