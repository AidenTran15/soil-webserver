const Review = require('../models/review');

const createReview = async (data) => {
  return await Review.create(data);
};

const getReviewsByProduct = async (productId) => {
  return await Review.findAll({ where: { productId } });
};

const updateReview = async (id, data) => {
  const review = await Review.findByPk(id);
  if (review) {
    return await review.update(data);
  }
  return null;
};

const deleteReview = async (id) => {
  const review = await Review.findByPk(id);
  if (review) {
    await review.destroy();
    return true;
  }
  return false;
};

module.exports = {
  createReview,
  getReviewsByProduct,
  updateReview,
  deleteReview,
};
