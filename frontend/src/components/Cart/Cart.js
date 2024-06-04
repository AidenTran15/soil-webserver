import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

import './Cart.css';

const Cart = () => {
  const { cartItems, removeCartItem, updateCartItemQuantity } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  const handleChangeQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeCartItem(productId); // If quantity less than 1, remove the item
    } else {
      updateCartItemQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    // Navigate to checkout page
    navigate('/checkout');
  };

  return (
    <div className="cart-container">
      {cartItems.length === 0 ? (
        <p className="empty-cart-message">Your cart is empty.</p>
      ) : (
        cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-image" />
            <h4>{item.name}</h4>
            <p>{item.description}</p>
            <input 
              type="number" 
              value={item.quantity} 
              onChange={(e) => handleChangeQuantity(item.id, parseInt(e.target.value, 10))}
              min="1" 
            />
            <p className="cart-item-price">${item.price.toFixed(2)}</p>
            <button onClick={() => removeCartItem(item.id)}>Remove</button>
          </div>
        ))
      )}
      <button className="proceed-to-checkout-btn" onClick={handleCheckout} disabled={cartItems.length === 0}>Proceed to Checkout</button>
    </div>
  );
};

export default Cart;
