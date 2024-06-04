const Cart = require('../models/cart');

const addCartItem = async (data) => {
  return await Cart.create(data);
};

const getCartItems = async (userId) => {
  return await Cart.findAll({ where: { userId } });
};

const updateCartItem = async (id, quantity) => {
  const cartItem = await Cart.findByPk(id);
  if (cartItem) {
    return await cartItem.update({ quantity });
  }
  return null;
};

const removeCartItem = async (id) => {
  const cartItem = await Cart.findByPk(id);
  if (cartItem) {
    await cartItem.destroy();
    return true;
  }
  return false;
};

const clearCart = async (userId) => {
  await Cart.destroy({ where: { userId } });
};

module.exports = {
  addCartItem,
  getCartItems,
  updateCartItem,
  removeCartItem,
  clearCart,
};
