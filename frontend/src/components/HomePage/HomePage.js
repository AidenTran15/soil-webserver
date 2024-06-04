// src/components/HomePage/HomePage.js
import React from 'react';
import GardeningTips from '../GardeningTips';
import ProductList from '../Products/Products';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="main-content">
      <section className="welcome-section">
        <h2>Welcome to SOIL</h2>
        <p>Discover the finest selection of organic foods dedicated to nourishing you and preserving our planet.</p>
      </section>
      
      <ProductList />  {/* Directly include ProductList component */}
      
      <section className="call-to-action">
        <p>Join our community to stay updated with the latest in organic living.</p>
        <Link to="/signup" className="signup-link">Sign Up Now</Link>
      </section>
      
      <GardeningTips />
    </div>
  );
};

export default HomePage;
