const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("nodeapp", "root", "2003asd2003", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
