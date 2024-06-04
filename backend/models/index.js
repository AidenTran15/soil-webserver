const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('s3827472_fsd_a2', 's3827472_fsd_a2', 'newpassword123', {
  host: 'rmit.australiaeast.cloudapp.azure.com',
  dialect: 'mysql',
  port: 3306,
  logging: console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    freezeTableName: true,
    timestamps: false
  }
});

module.exports = sequelize;
