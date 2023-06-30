const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.RDS_DBNAME, process.env.RDS_USERNAME, process.env.RDS_PASSWORD, {
  host: process.env.RDS_HOSTNAME,
  dialect: 'mysql',
  port: process.env.RDS_PORT
});

const User = sequelize.define('User', {
  username: DataTypes.STRING,
  password: DataTypes.STRING,
}, {});

module.exports = User;
