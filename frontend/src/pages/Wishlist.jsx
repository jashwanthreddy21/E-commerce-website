import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useLocation } from '../context/LocationContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { formatPrice } = useLocation();
  const { addToCart } = useCart();

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
          color: 'white',
          padding: '0.6rem',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          boxShadow: '0 4px 12px rgba(239,68,68,0.3)',
        }}>
          <Heart size={22} strokeWidth={2.5} />
        </div>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>My Wishlist</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem', marginTop: '0.2rem' }}>
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
      </div>

      {wishlist.length === 0 ? (
        /* Empty State */
        <div style={{
          textAlign: 'center',
          padding: '5rem 2rem',
          background: 'var(--surface)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🩶</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>Your wishlist is empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '380px', margin: '0 auto 2rem' }}>
            Find products you love and click the ❤️ heart icon to save them here for later.
          </p>
          <Link to="/" className="btn btn-primary" style={{ padding: '0.75rem 2rem', borderRadius: '50px' }}>
            <ShoppingBag size={18} style={{ marginRight: '0.5rem' }} />
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-4" style={{ gap: '1.5rem' }}>
          {wishlist.map(item => (
            <ProductCard key={item.id} product={item.product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
