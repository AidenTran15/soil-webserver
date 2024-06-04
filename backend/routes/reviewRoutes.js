const express = require('express');
const { createReview, getReviewsByProduct, updateReview, deleteReview } = require('../services/reviewService');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const review = await createReview(req.body);
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

router.get('/:productId', async (req, res) => {
  try {
    const reviews = await getReviewsByProduct(req.params.productId);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedReview = await updateReview(req.params.id, req.body);
    if (updatedReview) {
      res.status(200).json(updatedReview);
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const success = await deleteReview(req.params.id);
    if (success) {
      res.status(200).json({ message: 'Review deleted successfully' });
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;
