import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const CartContext = createContext();



export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [lastOrder, setLastOrderState] = useState(null);

  const recordLastOrder = (currentCart) => {
    setLastOrderState(currentCart);
  };

  const clearCart = useCallback(async () => {
    if (user) {
      try {
        await axios.delete(`http://13.210.66.41:3001/cart/clear/${user.id}`);
        setCartItems([]);
      } catch (error) {
        console.error('Error clearing cart:', error);
        toast.error('Failed to clear cart.');
      }
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      clearCart(); // Clears the cart when user logs out
    }
  }, [user, clearCart]);

  const addCartItem = async (item) => {
    if (!user) {
      toast.error('You must be logged in to add items to the cart.');
      return;
    }
    try {
      const response = await axios.post('http://13.210.66.41:3001/cart', {
        userId: user.id,
        productId: item.id,
        quantity: 1,
      });
      const addedItem = response.data; // Use response data to get the added item's ID
      setCartItems([...cartItems, { ...item, id: addedItem.id, quantity: 1 }]);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Failed to add item to cart.');
    }
  };
  

  const updateCartItemQuantity = async (itemId, quantity) => {
    console.log('Updating item with ID:', itemId); // Log ID
    try {
      await axios.put(`http://13.210.66.41:3001/cart/${itemId}`, { quantity });
      setCartItems(cartItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ));
    } catch (error) {
      console.error('Error updating item quantity:', error);
      toast.error('Failed to update item quantity.');
    }
  };
  
  const removeCartItem = async (itemId) => {
    console.log('Removing item with ID:', itemId); // Log ID
    try {
      await axios.delete(`http://13.210.66.41/cart/${itemId}`);
      setCartItems(cartItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error('Failed to remove item from cart.');
    }
  };
  

  return (
    <CartContext.Provider value={{ cartItems, addCartItem, removeCartItem, updateCartItemQuantity, clearCart, lastOrder, recordLastOrder }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
