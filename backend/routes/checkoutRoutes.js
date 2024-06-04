const express = require('express');
const { checkout } = require('../services/checkoutService');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { userId } = req.body;
    console.log('Checkout request body:', req.body);
    const result = await checkout(userId);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error processing checkout request:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;
