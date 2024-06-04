const { createReview } = require('../services/reviewService');
const Review = require('../models/review');

// Mock the Review model
jest.mock('../models/review');

// Before all tests, clear any previous mocks
beforeEach(() => {
  jest.clearAllMocks();
});

describe('Review Service Tests', () => {

  // Creating a Review:

  // Purpose: To ensure that a review can be created successfully.
  // Steps:
  //      1. Define the review data to be used for creating the review.
  //      2. Mock the Review.create method to return a resolved promise with the review data.
  //      3. Call createReview with the defined review data.
  //      4. Assert that the returned review matches the input data.
  //      5. Verify that Review.create was called with the correct data.
  test('should create a new review successfully', async () => {
    // Arrange
    const reviewData = {
      userId: 1,
      productId: 1,
      reviewText: 'Great product!',
      rating: 5,
    };

    const createdReview = {
      id: 1,
      ...reviewData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mocking the Review.create method
    Review.create.mockResolvedValue(createdReview);

    // Act
    const result = await createReview(reviewData);

    // Assert
    expect(result).toEqual(createdReview);
    expect(Review.create).toHaveBeenCalledWith(reviewData);
  });

  // Error Handling during Review Creation:

  // Purpose: To ensure that errors during review creation are handled properly.
  // Steps:
  //      1. Define the review data to be used for creating the review.
  //      2. Mock the Review.create method to throw an error.
  //      3. Call createReview with the defined review data and assert that it throws the expected error.
  //      4. Verify that Review.create was called with the correct data.
  test('should handle errors during review creation', async () => {
    // Arrange
    const reviewData = {
      userId: 1,
      productId: 1,
      reviewText: 'Great product!',
      rating: 5,
    };

    const errorMessage = 'Database error';

    // Mocking the Review.create method to throw an error
    Review.create.mockRejectedValue(new Error(errorMessage));

    // Act & Assert
    await expect(createReview(reviewData)).rejects.toThrow(errorMessage);
    expect(Review.create).toHaveBeenCalledWith(reviewData);
  });
});
