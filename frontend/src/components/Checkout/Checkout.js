import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Checkout.css';

const Checkout = () => {
  const [creditCard, setCreditCard] = useState({ number: '', expiry: '', cvv: '' });
  const { cartItems, clearCart, recordLastOrder } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCreditCard({ ...creditCard, [name]: value });
  };

  const validateCreditCard = ({ number, expiry, cvv }) => {
    const numberValid = /^\d{4} \d{4} \d{4} \d{4}$/.test(number);
    const expiryValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry);
    const cvvValid = /^\d{3,4}$/.test(cvv);
    return numberValid && expiryValid && cvvValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateCreditCard(creditCard)) {
      toast.error('Please enter valid credit card details.');
      return;
    }
    try {
      console.log('Checkout request data:', { userId: user.id });
      const response = await axios.post('http://localhost:3001/checkout', {
        userId: user.id,
      });
      if (response.status === 201) {
        toast.success('Payment successful. Thank you for your purchase!');
        recordLastOrder(cartItems);
        clearCart();
        navigate('/summary');
      }
    } catch (error) {
      console.error('Error processing checkout:', error);
      toast.error('Failed to process checkout.');
    }
  };

  const totalCost = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="cart-summary">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-summary-item">
            {item.name} - {item.quantity} x ${item.price.toFixed(2)}
          </div>
        ))}
        <div className="total-cost">Total: ${totalCost.toFixed(2)}</div>
      </div>
      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            id="cardNumber"
            name="number"
            value={creditCard.number}
            onChange={handleInputChange}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            type="text"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cardExpiry">Expiry Date</label>
          <input
            id="cardExpiry"
            name="expiry"
            value={creditCard.expiry}
            onChange={handleInputChange}
            placeholder="MM/YY"
            maxLength="5"
            type="text"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cardCvv">CVV</label>
          <input
            id="cardCvv"
            name="cvv"
            value={creditCard.cvv}
            onChange={handleInputChange}
            placeholder="123"
            maxLength="4"
            type="text"
            required
          />
        </div>
        <button type="submit" className="submit-btn">Complete Purchase</button>
      </form>
    </div>
  );
};

export default Checkout;
