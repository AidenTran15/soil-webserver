import React, { useState, useEffect } from 'react';
import reviewService from '../../services/reviewService';
import { useAuth } from '../../contexts/AuthContext';
import { fetchUserData } from '../../services/authService'; // Import the fetchUserData function
import { useNavigate } from 'react-router-dom';
import './Review.css';

const Review = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(1);
  const [editingReview, setEditingReview] = useState(null);
  const [editingReviewText, setEditingReviewText] = useState('');
  const [editingRating, setEditingRating] = useState(1);
  const [usernames, setUsernames] = useState({}); // State to store usernames
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const fetchedReviews = await reviewService.getReviews(productId);
        setReviews(fetchedReviews);
        await fetchUsernames(fetchedReviews); // Fetch usernames after getting reviews
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [productId]);

  const fetchUsernames = async (reviews) => {
    const usernamesMap = {};
    for (const review of reviews) {
      if (!usernamesMap[review.userId]) {
        try {
          const userData = await fetchUserData(review.userId);
          usernamesMap[review.userId] = userData.username;
        } catch (error) {
          console.error('Error fetching username:', error);
        }
      }
    }
    setUsernames(usernamesMap);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const review = {
        userId: user.id,
        productId,
        reviewText: newReview,
        rating,
      };
      await reviewService.createReview(review);
      const fetchedReviews = await reviewService.getReviews(productId); // Fetch reviews again after submission
      setReviews(fetchedReviews);
      await fetchUsernames(fetchedReviews); // Fetch usernames again after adding a review
      setNewReview('');
      setRating(1);
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await reviewService.deleteReview(id);
      const fetchedReviews = await reviewService.getReviews(productId); // Fetch reviews again after deletion
      setReviews(fetchedReviews);
      await fetchUsernames(fetchedReviews); // Fetch usernames again after deleting a review
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleEditClick = (review) => {
    setEditingReview(review.id);
    setEditingReviewText(review.reviewText);
    setEditingRating(review.rating);
  };

  const handleEditSave = async () => {
    try {
      await reviewService.updateReview(editingReview, { reviewText: editingReviewText, rating: editingRating });
      const fetchedReviews = await reviewService.getReviews(productId); // Fetch reviews again after editing
      setReviews(fetchedReviews);
      await fetchUsernames(fetchedReviews); // Fetch usernames again after editing a review
      setEditingReview(null);
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const userHasReviewed = reviews.some(review => review.userId === (user && user.id));

  return (
    <div className="review-section">
      <button onClick={() => navigate('/')} className="home-button">Home</button>
      <h3>Reviews</h3>
      {reviews.map(review => (
        <div key={review.id} className="review-item">
          {editingReview === review.id ? (
            <div className="edit-form">
              <textarea
                value={editingReviewText}
                onChange={(e) => setEditingReviewText(e.target.value)}
                placeholder="Edit your review here (max 100 words)"
                maxLength="100"
              />
              <select value={editingRating} onChange={(e) => setEditingRating(e.target.value)}>
                <option value={1}>1 - Poor</option>
                <option value={2}>2 - Fair</option>
                <option value={3}>3 - Good</option>
                <option value={4}>4 - Very Good</option>
                <option value={5}>5 - Excellent</option>
              </select>
              <div className="edit-form-buttons">
                <button onClick={handleEditSave} className="save">Save</button>
                <button onClick={() => setEditingReview(null)} className="cancel">Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <p className="username"><strong>{usernames[review.userId] || 'Anonymous'}</strong></p> {/* Display username */}
              <p>{review.reviewText}</p>
              <p className="rating">Rating: {review.rating}</p>
              {review.userId === (user && user.id) && (
                <>
                  <button onClick={() => handleEditClick(review)} className="edit">Edit</button>
                  <button onClick={() => handleDelete(review.id)} className="delete">Delete</button>
                </>
              )}
            </div>
          )}
        </div>
      ))}
      {user && !userHasReviewed && (
        <form onSubmit={handleSubmit} className="review-form">
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write your review here (max 100 words)"
            maxLength="100"
          />
          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value={1}>1 - Poor</option>
            <option value={2}>2 - Fair</option>
            <option value={3}>3 - Good</option>
            <option value={4}>4 - Very Good</option>
            <option value={5}>5 - Excellent</option>
          </select>
          <button type="submit">Submit Review</button>
        </form>
      )}
      {!user && (
        <p className="login-prompt">Please <button onClick={() => navigate('/signin')}>log in</button> to write a review.</p>
      )}
    </div>
  );
};

export default Review;
