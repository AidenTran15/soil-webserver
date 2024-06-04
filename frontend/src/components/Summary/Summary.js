import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';
import './Summary.css';

const Summary = () => {
  const { lastOrder } = useCart();

  const totalCost = lastOrder
    ? lastOrder.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)
    : '0.00';

  return (
    <div className="summary-container">
      <h1 className="summary-header">Order Summary</h1>
      {lastOrder && lastOrder.length > 0 ? (
        <div>
          {lastOrder.map((item, index) => (
            <div key={index} className="summary-item">
              <span>{item.name}</span>
              <span>{item.quantity} x ${item.price.toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-total">
            <span>Total</span>
            <span>${totalCost}</span>
          </div>
        </div>
      ) : (
        <p>No recent order to display.</p>
      )}
      <Link to="/" className="back-home-link">Back to Home</Link>
    </div>
  );
};

export default Summary;
