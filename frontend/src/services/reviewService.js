import axios from 'axios';

const API_URL = 'http://13.210.66.41:3001/reviews';

const createReview = async (review) => {
  const response = await axios.post(API_URL, review);
  return response.data;
};

const getReviews = async (productId) => {
  const response = await axios.get(`${API_URL}/${productId}`);
  return response.data;
};

const updateReview = async (id, review) => {
  const response = await axios.put(`${API_URL}/${id}`, review);
  return response.data;
};

const deleteReview = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

// Assign the object to a variable before exporting
const reviewService = {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
};

export default reviewService;
