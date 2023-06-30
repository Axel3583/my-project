require('dotenv').config();

const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.RDS_DBNAME, process.env.RDS_USERNAME, process.env.RDS_PASSWORD, {
  host: process.env.RDS_HOSTNAME,
  dialect: 'mysql',
  port: process.env.RDS_PORT,
});


module.exports = sequelize;
