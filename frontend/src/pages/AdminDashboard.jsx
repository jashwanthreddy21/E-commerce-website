import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Settings, Package, LayoutDashboard, Plus } from 'lucide-react';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('orders'); // orders, products
  
  // New Product form state
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stock: '', image_url: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, productsRes] = await Promise.all([
        api.get('/orders/all'),
        api.get('/products/')
      ]);
      setOrders(ordersRes.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
      setProducts(productsRes.data);
    } catch (error) {
      console.error("Error fetching admin data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status?status_str=${newStatus}`);
      fetchData();
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products/', {
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        image_url: newProduct.image_url
      });
      setShowAddProduct(false);
      setNewProduct({ name: '', description: '', price: '', stock: '', image_url: '' });
      fetchData();
    } catch (error) {
      console.error("Error adding product", error);
    }
  };
  
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${productId}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  if (loading) return <div className="center-page"><div className="spinner"></div></div>;

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <LayoutDashboard size={32} style={{ color: 'var(--primary)' }} />
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Admin Dashboard</h1>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
        <button 
          onClick={() => setTab('orders')} 
          style={{ padding: '1rem', fontWeight: 500, color: tab === 'orders' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: tab === 'orders' ? '2px solid var(--primary)' : 'none' }}>
           All Orders ({orders.length})
        </button>
        <button 
          onClick={() => setTab('products')} 
          style={{ padding: '1rem', fontWeight: 500, color: tab === 'products' ? 'var(--primary)' : 'var(--text-muted)', borderBottom: tab === 'products' ? '2px solid var(--primary)' : 'none' }}>
           Inventory ({products.length})
        </button>
      </div>

      {tab === 'orders' && (
        <div className="card" style={{ padding: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem 0.5rem' }}>ID</th>
                <th style={{ padding: '1rem 0.5rem' }}>User ID</th>
                <th style={{ padding: '1rem 0.5rem' }}>Date</th>
                <th style={{ padding: '1rem 0.5rem' }}>Total</th>
                <th style={{ padding: '1rem 0.5rem' }}>Status</th>
                <th style={{ padding: '1rem 0.5rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem 0.5rem' }}>#{order.id}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>{order.user_id}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>${parseFloat(order.total_amount).toFixed(2)}</td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <span className={`badge ${order.status === 'Pending' ? 'badge-primary' : order.status === 'Delivered' ? 'badge-success' : ''}`}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.5rem' }}>
                    <select 
                      className="form-control" 
                      value={order.status} 
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button className="btn btn-primary" onClick={() => setShowAddProduct(!showAddProduct)}>
              <Plus size={18} /> {showAddProduct ? 'Cancel' : 'Add Product'}
            </button>
          </div>
          
          {showAddProduct && (
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Add New Product</h3>
              <form onSubmit={handleAddProduct} className="grid grid-cols-2" style={{ gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Price</label>
                  <input type="number" step="0.01" className="form-control" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Stock</label>
                  <input type="number" className="form-control" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Image URL</label>
                  <input type="text" className="form-control" value={newProduct.image_url} onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                  <label className="form-label">Description</label>
                  <textarea className="form-control" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} required rows="3"></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1' }}>Save Product</button>
              </form>
            </div>
          )}

          <div className="card" style={{ padding: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem 0.5rem' }}>ID</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Image</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Name</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Price</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Stock</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem 0.5rem' }}>{product.id}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      {product.image_url && <img src={product.image_url} alt="img" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />}
                    </td>
                    <td style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>{product.name}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>${product.price}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>{product.stock}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <button onClick={() => handleDeleteProduct(product.id)} className="btn" style={{ color: 'var(--error)', padding: '0.25rem 0.5rem', border: '1px solid var(--error)' }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
