import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import api from '../api/axios';
import { useLocation } from '../context/LocationContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useLocation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/');
        // Sorting by newest first
        const sorted = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setOrders(sorted);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="center-page"><div className="spinner"></div></div>;

  if (orders.length === 0) {
    return (
      <div className="container center-page" style={{ flexDirection: 'column' }}>
        <Package size={64} style={{ color: 'var(--border)', marginBottom: '1rem' }} />
        <h2 style={{ marginBottom: '1rem' }}>You have no orders yet</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Your Orders</h1>
      <div className="grid grid-cols-1">
        {orders.map((order) => (
          <div key={order.id} className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Order #{order.id}</div>
                <div style={{ fontWeight: 500 }}>{new Date(order.created_at).toLocaleDateString()}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`badge ${order.status === 'Pending' ? 'badge-primary' : order.status === 'Delivered' ? 'badge-success' : ''}`}>
                  {order.status}
                </span>
                <div style={{ fontWeight: 700, marginTop: '0.25rem', color: 'var(--primary)' }}>
                  {formatPrice(order.total_amount)}
                </div>
              </div>
            </div>
            
            <div>
              {order.items && order.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontSize: '0.875rem' }}>
                  <span>{item.quantity}x {item.product.name}</span>
                  <span>{formatPrice(item.price_at_time * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
