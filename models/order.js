const Sequelize = require("sequelize");
const { DataTypes } = require("sequelize");
const db = require("../utility/db");

const Order = db.define("order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = Order;
