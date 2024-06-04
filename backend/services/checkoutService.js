const Cart = require('../models/cart');

const checkout = async (userId) => {
  try {
    // Retrieve cart items for the user
    const cartItems = await Cart.findAll({ where: { userId } });
    if (!cartItems.length) {
      throw new Error('No items in cart to checkout.');
    }
    
    // Process payment and other checkout operations here (e.g., reduce stock, send confirmation email, etc.)
    const total = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    console.log('Checkout data:', { userId, cartItems, total });
    
    // Clear cart after successful checkout
    await Cart.destroy({ where: { userId } });
    return { message: 'Checkout successful', total };
  } catch (error) {
    console.error('Error during checkout:', error);
    throw error;
  }
};

module.exports = {
  checkout,
};
