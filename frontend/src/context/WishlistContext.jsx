import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());

  const fetchWishlist = useCallback(async () => {
    if (!user) { setWishlist([]); setWishlistIds(new Set()); return; }
    try {
      const res = await api.get('/wishlist/');
      setWishlist(res.data);
      setWishlistIds(new Set(res.data.map(item => item.product_id)));
    } catch (err) {
      console.error('Failed to fetch wishlist', err);
    }
  }, [user]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const addToWishlist = async (productId) => {
    try {
      const res = await api.post('/wishlist/', { product_id: productId });
      setWishlist(prev => [...prev, res.data]);
      setWishlistIds(prev => new Set([...prev, productId]));
    } catch (err) {
      console.error('Failed to add to wishlist', err);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      setWishlist(prev => prev.filter(item => item.product_id !== productId));
      setWishlistIds(prev => { const s = new Set(prev); s.delete(productId); return s; });
    } catch (err) {
      console.error('Failed to remove from wishlist', err);
    }
  };

  const toggleWishlist = (productId) => {
    if (wishlistIds.has(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, wishlistIds, toggleWishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
