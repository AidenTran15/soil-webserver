import React, { useEffect, useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Products.css';

const Products = () => {
  const { addCartItem, cartItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://http://13.210.66.41:3001/products');
        console.log('Fetched products:', response.data);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const isInCart = (productId) => {
    return cartItems.some((item) => item.productId === productId);
  };

  const handleAddToCart = (product) => {
    if (!user) {
      toast.error('You must be logged in to add items to the cart.', {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate('/signin');
      return;
    }

    addCartItem(product);
    toast.success(`${product.name} added to cart!`, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const standardProducts = products.filter(product => !product.special);
  const specialProducts = products.filter(product => product.special);

  return (
    <div className="products">
      <h2>Standard Products</h2>
      <div className="products-grid standard-products">
        {standardProducts.map((product) => {
          const imageUrl = `${process.env.PUBLIC_URL}${product.image}`;
          console.log('Product:', product);
          console.log('Image URL:', imageUrl);
          return (
            <div key={product.id} className="product-item">
              <img src={imageUrl} alt={product.name} className="product-image" />
              <h4 className="product-name">{product.name}</h4>
              <p>{product.description}</p>
              <p className="product-price">${product.price.toFixed(2)} / {product.unit}</p>
              <button 
                onClick={() => handleAddToCart(product)} 
                className="add-to-cart-link" 
                disabled={isInCart(product.id)}
              >
                Add to Cart
              </button>
              <button 
                onClick={() => navigate(`/product/${product.id}`)} 
                className="view-details-link"
              >
                View Details
              </button>
            </div>
          );
        })}
      </div>

      <h2>Special Products</h2>
      <div className="products-grid special-products">
        {specialProducts.map((product) => {
          const imageUrl = `${process.env.PUBLIC_URL}${product.image}`;
          return (
            <div key={product.id} className="product-item special">
              <img src={imageUrl} alt={product.name} className="product-image" />
              <h4 className="product-name">{product.name}</h4>
              <p>{product.description}</p>
              <p className="product-price">${product.price.toFixed(2)} / {product.unit}</p>
              <button 
                onClick={() => handleAddToCart(product)} 
                className="add-to-cart-link" 
                disabled={isInCart(product.id)}
              >
                Add to Cart
              </button>
              <button 
                onClick={() => navigate(`/product/${product.id}`)} 
                className="view-details-link"
              >
                View Details
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Products;
