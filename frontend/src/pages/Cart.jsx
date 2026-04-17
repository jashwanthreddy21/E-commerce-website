import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import api from '../api/axios';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, fetchCart } = useCart();
  const { formatPrice } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      await api.post('/orders/');
      await fetchCart();
      navigate('/orders');
    } catch (error) {
      console.error("Checkout failed", error);
      alert("Checkout failed. Please check product stock.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container center-page" style={{ flexDirection: 'column' }}>
        <ShoppingBag size={64} style={{ color: 'var(--border)', marginBottom: '1rem' }} />
        <h2 style={{ marginBottom: '1rem' }}>Your cart is empty</h2>
        <Link to="/" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Shopping Cart</h1>
      
      <div className="grid" style={{ gridTemplateColumns: 'revert', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 60%' }}>
          {cart.map((item) => (
            <div key={item.id} className="card" style={{ display: 'flex', gap: '1rem', padding: '1.5rem', marginBottom: '1rem', alignItems: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius)', overflow: 'hidden', backgroundColor: 'var(--background)' }}>
                 {item.product.image_url && <img src={item.product.image_url} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: 600 }}>{item.product.name}</h3>
                <div style={{ color: 'var(--primary)', fontWeight: 600 }}>{formatPrice(item.product.price)}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <input 
                  type="number" 
                  min="1" 
                  max={item.product.stock}
                  value={item.quantity} 
                  onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                  className="form-control"
                  style={{ width: '80px' }}
                />
                <button onClick={() => removeFromCart(item.id)} className="btn btn-secondary" style={{ color: 'var(--error)' }} title="Remove item">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ flex: '1 1 30%', position: 'sticky', top: '80px', height: 'max-content' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Order Summary</h2>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{ fontWeight: 500 }}>{formatPrice(cartTotal)}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
              <span style={{ fontWeight: 500 }}>Free</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1rem', fontSize: '1.25rem', fontWeight: 700 }}>
              <span>Total</span>
              <span style={{ color: 'var(--primary)' }}>{formatPrice(cartTotal)}</span>
            </div>
            
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '0.75rem' }} 
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? <div className="spinner" style={{ width: '1.2rem', height: '1.2rem', borderWidth: '2px' }}></div> : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
