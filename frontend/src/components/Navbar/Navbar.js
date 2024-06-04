import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { toast } from 'react-toastify'; 
import './Navbar.css';


const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cartItems } = useCart();

  // Calculate the total number of items in the cart for the cart icon
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCartClick = () => {
    if (user) {
      navigate('/cart');
    } else {
      toast.error("Please log in to view your cart.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">SOIL</Link>
      <div className="navbar-nav">
        <Link to="/shop" className="nav-item">Shop Online</Link>
        <Link to="/diet-plan" className="nav-item">Diet Plan</Link>
        <Link to="/meal-planning" className="nav-item">Meal Planning</Link>
        <Link to="/location" className="nav-item">Location</Link>
        <Link to="/about-us" className="nav-item">About Us</Link>
        {user ? (
          <>
            <Link to="/profile" className="nav-item">Profile</Link>
            <button onClick={handleLogout} className="navbar-login">Logout</button>
          </>
        ) : (
          <Link to="/signin" className="navbar-login">Login</Link>
        )}
      </div>
      <div onClick={handleCartClick} className="cart-icon-link">
        <img src='/baseline_shopping_cart_white_24dp.png' alt="Cart" className="cart-icon" />
        <span className="cart-count">{itemCount}</span>
      </div>
    </nav>
  );
};

export default Navbar;
