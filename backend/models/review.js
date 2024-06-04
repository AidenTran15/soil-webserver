const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./index');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  reviewText: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100], // max 100 words
    },
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
}, {
  tableName: 'reviews',
  timestamps: true,
});

module.exports = Review;
