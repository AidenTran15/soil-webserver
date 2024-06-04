import axios from 'axios';

const API_URL = 'http://13.210.66.41:3001/products';

const getAllProducts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export default {
  getAllProducts,
};
