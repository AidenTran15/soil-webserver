const express = require('express');
const { addCartItem, getCartItems, updateCartItem, removeCartItem, clearCart } = require('../services/cartService');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const cartItem = await addCartItem(req.body);
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const cartItems = await getCartItems(req.params.userId);
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedCartItem = await updateCartItem(req.params.id, req.body.quantity);
    if (updatedCartItem) {
      res.status(200).json(updatedCartItem);
    } else {
      res.status(404).json({ message: 'Cart item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const success = await removeCartItem(req.params.id);
    if (success) {
      res.status(200).json({ message: 'Cart item removed successfully' });
    } else {
      res.status(404).json({ message: 'Cart item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

router.delete('/clear/:userId', async (req, res) => {
  try {
    await clearCart(req.params.userId);
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;
